import { ViewerDOMBuilder } from "#/builder";
import { PreferenceData, ViewerDirection, PreferenceButtons, StateClassNames } from "#/interfaces";

const PREFERENCE_KEY = "mangaViewer_preferenceData";

export class MangaViewerPreference {
  // preference el
  el: HTMLElement;
  // preference wrapper el
  wrapperEl: HTMLElement;
  buttons: PreferenceButtons;
  stateNames: StateClassNames;
  // preference save data
  data: PreferenceData = this.loadPreferenceData();
  constructor(builder: ViewerDOMBuilder, className?: string) {
    const containerEl = builder.createDiv();
    containerEl.className = (className) ? className : "mangaViewer_preference";

    const wrapperEl = builder.createDiv();
    wrapperEl.className = "mangaViewer_preferenceWrapper";

    const preferenceBtnClass = "mangaViewer_preferenceButton";
    const isAutoFullscreen = builder.createCheckBoxButton("ビューワー展開時の自動全画面化: ", preferenceBtnClass);

    const viewerDirectionValues = [
      "自動",
      "横読み",
      "縦読み",
    ];

    const viewerDirection = builder.createSelectButton("ビューワー方向初期値: ", viewerDirectionValues, preferenceBtnClass);

    const isEnableTapSlidePage = builder.createCheckBoxButton("タップデバイスでの「タップでのページ送り」を有効化する: ", preferenceBtnClass);

    const descriptionEl = builder.createDiv();
    [
      " ",
      "※1: 一部設定値は次回以降のページ読み込み時に適用されます",
      "※2: 自動全画面化処理はブラウザの仕様から「ビューワー展開ボタンクリック時」にしか動きません",
    ].forEach(s => {
      const p = builder.createParagraph();
      p.textContent = s;
      descriptionEl.appendChild(p);
    });

    [
      isAutoFullscreen,
      viewerDirection,
      isEnableTapSlidePage,
      descriptionEl
    ].forEach(el => wrapperEl.appendChild(el));
    containerEl.appendChild(wrapperEl);

    this.el = containerEl;
    this.wrapperEl = wrapperEl;
    this.buttons = {
      isAutoFullscreen,
      isEnableTapSlidePage,
      viewerDirection
    }
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

  get viewerDirection(): ViewerDirection {
    return this.data.viewerDirection;
  }

  set viewerDirection(direction: ViewerDirection) {
    this.data.viewerDirection = direction;
    this.savePreferenceData();
  }

  private get defaultPreferenceData(): PreferenceData {
    return {
      isAutoFullscreen: false,
      isEnableTapSlidePage: false,
      viewerDirection: "auto",
    }
  }

  private savePreferenceData() {
    localStorage.setItem(PREFERENCE_KEY, JSON.stringify(this.data));
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

    const vdIdx = [
      "auto",
      "horizontal",
      "vertical",
    ].indexOf(this.viewerDirection);

    const vdItemEls = Array.from(this.buttons.viewerDirection.getElementsByClassName("mangaViewer_selectItem") || [])
    if (this.isHTMLElementArray(vdItemEls) && vdItemEls[vdIdx]) {
      vdItemEls[vdIdx].style.order = "-1";
    }
  }

  private isHTMLElementArray(array: any): array is HTMLElement[] {
    let bool = true;

    if (Array.isArray(array)) {
      array.forEach(v => {
        const b = v instanceof HTMLElement;
        if (!b) bool = false;
      })
    } else {
      bool = false;
    }

    return bool;
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

    const viewerDirectionItemEls = Array.from(this.buttons.viewerDirection.getElementsByClassName("mangaViewer_selectItem") || []);
    if (this.isHTMLElementArray(viewerDirectionItemEls)) {
      viewerDirectionItemEls.forEach((el) => {
        el.addEventListener("click", (e) => {
          if (!(e.target instanceof HTMLElement)) return;

          const idx = parseInt(e.target.dataset.itemIdx || "", 10);

          if (idx === 0) {
            // auto
            this.viewerDirection = "auto";
          } else if (idx === 1) {
            // horizontal
            this.viewerDirection = "horizontal";
          } else if (idx === 2) {
            // vertical
            this.viewerDirection = "vertical";
          }

          viewerDirectionItemEls.forEach(el => el.style.order = "");

          el.style.order = "-1";
        })
      })
    }
  }
}
