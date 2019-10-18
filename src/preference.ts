import { ViewerDOMBuilder } from "#/builder";
import { PreferenceData, BarWidth, PreferenceButtons, StateClassNames, UIVisibility } from "#/interfaces";
import { isHTMLElementArray } from "#/utils";

export class MangaViewerPreference {
  private readonly PREFERENCE_KEY = "mangaViewer_preferenceData";
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

    const progressBarWidths = [
      "初期値",
      "非表示",
      "細い",
      "普通",
      "太い"
    ]

    const progressBarWidth = builder.createSelectButton("進捗バー表示設定", progressBarWidths, preferenceBtnClass);

    const uiVisibilityValues = [
      "初期値",
      "非表示",
      "表示",
    ];

    const paginationVisibility = builder.createSelectButton("ページ送りボタン表示設定", uiVisibilityValues, preferenceBtnClass);

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
      paginationVisibility,
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
      paginationVisibility,
    };
    this.stateNames = builder.stateNames;

    // 読み込んだpreference値を各ボタン状態に適用
    this.applyCurrentPreferenceValue();
    // 各種イベントをボタンに適用
    this.applyButtonEventListeners();
  }

  private get defaultPreferenceData(): PreferenceData {
    return {
      isAutoFullscreen: false,
      isEnableTapSlidePage: false,
      progressBarWidth: "auto",
      paginationVisibility: "auto",
    }
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
    this.dispatchPreferenceUpdateEvent("progressBarWidth");
  }

  get paginationVisibility(): UIVisibility {
    return this.data.paginationVisibility;
  }

  set paginationVisibility(visibility: UIVisibility) {
    this.data.paginationVisibility = visibility;
    this.savePreferenceData();
    this.dispatchPreferenceUpdateEvent("paginationVisibility");
  }

  private savePreferenceData() {
    localStorage.setItem(this.PREFERENCE_KEY, JSON.stringify(this.data));
  }

  private dispatchPreferenceUpdateEvent(detail: string = "") {
    const ev = new CustomEvent("MangaViewerPreferenceUpdate", {
      detail
    });

    this.rootEl.dispatchEvent(ev);
  }

  /**
   * localStorageから設定データを読み込む
   */
  private loadPreferenceData(): PreferenceData {
    const dataStr = localStorage.getItem(this.PREFERENCE_KEY);

    let data = this.defaultPreferenceData;

    if (dataStr) {
      try {
        data = JSON.parse(dataStr)
      } catch(e) {
        console.error(e);
        localStorage.removeItem(this.PREFERENCE_KEY);
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
      isEnableTapSlidePage,
      paginationVisibility,
      progressBarWidth,
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

    const uiVisibilityValues: UIVisibility[] = [
      "auto",
      "hidden",
      "visible",
    ];

    const barWidthValues: BarWidth[] = [
      "auto",
      "none",
      "tint",
      "medium",
      "bold",
    ];

    [
      {
        // pagination visibility
        els: this.getSelectItemEls(paginationVisibility),
        idx: uiVisibilityValues.indexOf(this.paginationVisibility)
      },
      {
        // progress bar width
        els: this.getSelectItemEls(progressBarWidth),
        idx: barWidthValues.indexOf(this.progressBarWidth)
      }
    ].forEach(obj => {
      const {els, idx} = obj;
      if (isHTMLElementArray(els) && els[idx]) {
        els[idx].style.order = "-1";
      }
    })
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

    const paginationVisibilityHandler = (e: MouseEvent, el: HTMLElement, itemEls: HTMLElement[]) => {
      if (!(e.target instanceof HTMLElement)) return;

      const idx = parseInt(e.target.dataset.itemIdx || "", 10);

      if (idx === 0) {
        // auto
        this.paginationVisibility = "auto";
      } else if (idx === 1) {
        // horizontal
        this.paginationVisibility = "hidden";
      } else if (idx === 2) {
        // vertical
        this.paginationVisibility = "visible";
      }

      itemEls.forEach(el => el.style.order = "");

      el.style.order = "-1";
    }

    const progressBarWidthHandler = (e: MouseEvent, el: HTMLElement, itemEls: HTMLElement[]) => {
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

    // 各種selectButton要素のイベントリスナーを登録
    [
      {
        el: this.buttons.paginationVisibility,
        callback: (e: MouseEvent, el: HTMLElement, itemEls: HTMLElement[]) => paginationVisibilityHandler(e, el, itemEls)
      },
      {
        el: this.buttons.progressBarWidth,
        callback: (e: MouseEvent, el: HTMLElement, itemEls: HTMLElement[]) => progressBarWidthHandler(e, el, itemEls)
      },
    ].forEach(obj => {
      const {el: parentEl, callback} = obj;
      const els = this.getSelectItemEls(parentEl);
      if (isHTMLElementArray(els)) {
        els.forEach(el => el.addEventListener("click", e => {
          // 親要素がアクティブな時 === selectButtonが選択された時
          // この時だけ処理を動かす
          const isActive = parentEl.classList.contains(this.stateNames.active);
          if (isActive) callback(e, el, els);
        }));
      }
    })
  }

  /**
   * 入力した要素内部にあるselectItem要素を配列として返す
   * @param  el selectButtonを想定した引数
   * @return    クラス名で抽出したElement配列
   */
  private getSelectItemEls(el: HTMLElement): Element[] {
    const selectItemClass = "mangaViewer_selectItem";
    return Array.from(el.getElementsByClassName(selectItemClass) || [])
  }
}
