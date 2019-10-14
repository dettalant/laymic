import { ViewerDOMBuilder } from "#/builder";
import { PreferenceData, BarWidth, PreferenceButtons, StateClassNames } from "#/interfaces";
import { isHTMLElementArray } from "#/utils";

const PREFERENCE_KEY = "mangaViewer_preferenceData";

export class MangaViewerPreference {
  rootEl: HTMLElement;
  // preference el
  el: HTMLElement;
  // preference wrapper el
  wrapperEl: HTMLElement;
  buttons: PreferenceButtons;
  stateNames: StateClassNames;
  // preference save data
  data: PreferenceData = this.loadPreferenceData();
  constructor(builder: ViewerDOMBuilder, rootEl: HTMLElement, className?: string) {
    const containerEl = builder.createDiv();
    containerEl.className = (className) ? className : "mangaViewer_preference";

    const wrapperEl = builder.createDiv();
    wrapperEl.className = "mangaViewer_preferenceWrapper";

    const preferenceBtnClass = "mangaViewer_preferenceButton";
    const isAutoFullscreen = builder.createCheckBoxButton("ビューワー展開時の自動全画面化", preferenceBtnClass);

    const isEnableTapSlidePage = builder.createCheckBoxButton("タップデバイスでの「タップでのページ送り」を有効化する", preferenceBtnClass);

    // const uiVisibilityValues = [
    //   "自動",
    //   "表示する",
    //   "表示しない",
    // ];

    const progressBarWidths = [
      "自動",
      "なし",
      "細い",
      "普通",
      "太い"
    ]

    const progressBarWidth = builder.createSelectButton("進捗バー表示設定", progressBarWidths, preferenceBtnClass);

    const descriptionEl = builder.createDiv();
    [
      "",
      "※1: 一部設定値は次回以降のページ読み込み時に適用されます",
      "※2: 自動全画面化処理はブラウザの仕様から「ビューワー展開ボタンクリック時」にしか動きません",
    ].forEach(s => {
      const p = builder.createParagraph();
      p.textContent = s;
      descriptionEl.appendChild(p);
    });

    [
      progressBarWidth,
      isAutoFullscreen,
      isEnableTapSlidePage,
      descriptionEl
    ].forEach(el => wrapperEl.appendChild(el));
    containerEl.appendChild(wrapperEl);

    this.rootEl = rootEl;
    this.el = containerEl;
    this.wrapperEl = wrapperEl;
    this.buttons = {
      isAutoFullscreen,
      isEnableTapSlidePage,
      progressBarWidth,
    };
    this.stateNames = builder.stateNames;

    // 読み込んだpreference値を各ボタン状態に適用
    this.applyCurrentPreferenceValue();
    // 各種イベントをボタンに適用
    this.applyButtonEventListeners();
  }

  get isAutoFullscreen(): boolean {
    return this.data.isAutoFullscreen;
  }

  set isAutoFullscreen(bool: boolean) {
    this.data.isAutoFullscreen = bool;
    this.savePreferenceData();
  }

  get isEnableTapSlidePage(): boolean {
    return this.data.isEnableTapSlidePage;
  }

  set isEnableTapSlidePage(bool: boolean) {
    this.data.isEnableTapSlidePage = bool;
    this.savePreferenceData();
  }


  get progressBarWidth(): BarWidth {
    return this.data.progressBarWidth
  }

  set progressBarWidth(Width: BarWidth) {
    this.data.progressBarWidth = Width;
    this.savePreferenceData();
    this.dispatchViewerUpdateEvent("progressBarWidth");
  }

  private get defaultPreferenceData(): PreferenceData {
    return {
      isAutoFullscreen: false,
      isEnableTapSlidePage: false,
      progressBarWidth: "auto",
    }
  }

  private savePreferenceData() {
    localStorage.setItem(PREFERENCE_KEY, JSON.stringify(this.data));
  }

  private dispatchViewerUpdateEvent(detail: string = "") {
    const ev = new CustomEvent("MangaViewerPreferenceUpdate", {
      detail
    });

    this.rootEl.dispatchEvent(ev);
  }

  /**
   * localStorageから設定データを読み込む
   */
  private loadPreferenceData(): PreferenceData {
    const dataStr = localStorage.getItem(PREFERENCE_KEY);

    let data = this.defaultPreferenceData;

    if (dataStr) {
      try {
        data = JSON.parse(dataStr)
      } catch(e) {
        console.error(e);
        localStorage.removeItem(PREFERENCE_KEY);
      }
    }

    return data;
  }

  /**
   * 現在のpreference状態をボタン状態に適用する
   * 主に初期化時に用いる関数
   */
  private applyCurrentPreferenceValue() {
    const {
      isAutoFullscreen,
      isEnableTapSlidePage
    } = this.buttons;

    const {
      active
    } = this.stateNames;

    if (this.isAutoFullscreen) {
      isAutoFullscreen.classList.add(active);
    } else {
      isAutoFullscreen.classList.remove(active);
    }

    if (this.isEnableTapSlidePage) {
      isEnableTapSlidePage.classList.add(active);
    } else {
      isEnableTapSlidePage.classList.remove(active);
    }

    const uiVisibilityValues = [
      "auto",
      "visible",
      "hidden"
    ];

    const pbwIdx = uiVisibilityValues.indexOf(this.progressBarWidth);
    const pbwItemEls = Array.from(this.buttons.progressBarWidth.getElementsByClassName("mangaViewer_selectItem") || []);
    if (isHTMLElementArray(pbwItemEls) && pbwItemEls[pbwIdx]) {
      pbwItemEls[pbwIdx].style.order = "-1";
    }
  }

  /**
   * 各種ボタンイベントを登録する
   * インスタンス生成時に一度だけ呼び出される
   */
  private applyButtonEventListeners() {
    this.buttons.isAutoFullscreen.addEventListener("click", () => {
      this.isAutoFullscreen = !this.isAutoFullscreen;
    });

    this.buttons.isEnableTapSlidePage.addEventListener("click", () => {
      this.isEnableTapSlidePage = !this.isEnableTapSlidePage;
    });

    const uiVisibilityButtonHandler = (e: MouseEvent, el: HTMLElement, itemEls: HTMLElement[]) => {
      if (!(e.target instanceof HTMLElement)) return;

      const idx = parseInt(e.target.dataset.itemIdx || "", 10);

      if (idx === 0) {
        // auto
        this.progressBarWidth = "auto";
      } else if (idx === 1) {
        // horizontal
        this.progressBarWidth = "none";
      } else if (idx === 2) {
        // vertical
        this.progressBarWidth = "tint";
      } else if (idx === 3) {
        this.progressBarWidth = "medium";
      } else if (idx === 4) {
        this.progressBarWidth = "bold";
      }

      itemEls.forEach(el => el.style.order = "");

      el.style.order = "-1";
    }

    const pbvItemEls = Array.from(this.buttons.progressBarWidth.getElementsByClassName("mangaViewer_selectItem") || []);
    if (isHTMLElementArray(pbvItemEls)) {
      pbvItemEls.forEach((el) => el.addEventListener("click", (e) => {
        // 親要素がアクティブな時 === selectButtonが選択された時
        // この時だけ処理を動かす
        const isActive = this.buttons.progressBarWidth.classList.contains(this.stateNames.active)

        if (isActive) {
          uiVisibilityButtonHandler(e, el, pbvItemEls)
        }
      }));
    }
  }
}
