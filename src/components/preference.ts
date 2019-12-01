import DOMBuilder from "#/components/builder";
import {
  PreferenceData,
  BarWidth,
  PreferenceButtons,
  PreferenceUpdateEventString,
  UIVisibility
} from "#/interfaces/index";
import { isHTMLElementArray } from "#/utils";

export default class LaymicPreference {
  private readonly PREFERENCE_KEY = "laymic_preferenceData";
  rootEl: HTMLElement;
  // preference el
  el: HTMLElement;
  // preference wrapper el
  wrapperEl: HTMLElement;
  buttons: PreferenceButtons;
  builder: DOMBuilder;
  // preference save data
  data: PreferenceData = this.defaultPreferenceData;
  constructor(builder: DOMBuilder, rootEl: HTMLElement) {
    this.builder = builder;
    const containerEl = builder.createDiv();
    const preferenceClassNames = this.builder.classNames.preference;
    containerEl.className = preferenceClassNames.container;

    const wrapperEl = builder.createDiv();
    wrapperEl.className = preferenceClassNames.wrapper;

    const preferenceBtnClass = preferenceClassNames.button;
    const isAutoFullscreen = builder.createCheckBoxButton("ビューワー展開時の自動全画面化", `${preferenceBtnClass} ${preferenceClassNames.isAutoFullscreen}`);

    const isDisableTapSlidePage = builder.createCheckBoxButton("タップデバイスでのタップページ送りを無効化", preferenceBtnClass);

    const progressBarWidth = builder.createSelectButton(
      "進捗バー表示設定",
      this.barWidthLabels,
      preferenceBtnClass
    );

    const paginationVisibility = builder.createSelectButton(
      "ページ送りボタン表示設定",
      this.uiVisibilityLabels,
      `${preferenceBtnClass} ${preferenceClassNames.paginationVisibility}`
    );

    const zoomButtonRatio = builder.createSelectButton(
      "ズームボタン倍率設定",
      this.zoomButtonRatioLabels,
      `${preferenceBtnClass} ${preferenceClassNames.zoomButtonRatio}`
    );

    const descriptionEl = builder.createDiv();
    [
      "",
      "※1: 一部設定値は次回ページ読み込み時に適用されます",
      "※2: 自動全画面処理はビューワー展開ボタンクリック時にしか動きません",
    ].forEach(s => {
      const p = builder.createParagraph();
      p.textContent = s;
      descriptionEl.appendChild(p);
    });

    [
      progressBarWidth,
      paginationVisibility,
      zoomButtonRatio,
      isAutoFullscreen,
      isDisableTapSlidePage,
      descriptionEl
    ].forEach(el => wrapperEl.appendChild(el));
    containerEl.appendChild(wrapperEl);

    this.rootEl = rootEl;
    this.el = containerEl;
    this.wrapperEl = wrapperEl;
    this.buttons = {
      progressBarWidth,
      paginationVisibility,
      zoomButtonRatio,
      isAutoFullscreen,
      isDisableTapSlidePage,
    };
    // 各種イベントをボタンに適用
    this.applyEventListeners();
  }

  private get defaultPreferenceData(): PreferenceData {
    return {
      isAutoFullscreen: false,
      isDisableTapSlidePage: false,
      progressBarWidth: "auto",
      paginationVisibility: "auto",
      zoomButtonRatio: 1.5,
    }
  }

  private get barWidthValues(): BarWidth[] {
    return [
      "auto",
      "none",
      "tint",
      "medium",
      "bold",
    ]
  }

  private get barWidthLabels(): string[] {
    return [
      "初期値",
      "非表示",
      "細い",
      "普通",
      "太い"
    ]
  }

  private get uiVisibilityValues(): UIVisibility[] {
    return [
      "auto",
      "hidden",
      "visible",
    ]
  }

  private get uiVisibilityLabels(): string[] {
    return [
      "初期値",
      "非表示",
      "表示",
    ]
  }

  private get zoomButtonRatioValues(): number[] {
    return [
      1.5,
      2.0,
      2.5,
      3.0
    ]
  }

  private get zoomButtonRatioLabels(): string[] {
    return [
      "1.5倍",
      "2.0倍",
      "2.5倍",
      "3.0倍"
    ]
  }

  get isAutoFullscreen(): boolean {
    return this.data.isAutoFullscreen;
  }

  set isAutoFullscreen(bool: boolean) {
    this.data.isAutoFullscreen = bool;
    this.savePreferenceData();
  }

  get isDisableTapSlidePage(): boolean {
    return this.data.isDisableTapSlidePage;
  }

  set isDisableTapSlidePage(bool: boolean) {
    this.data.isDisableTapSlidePage = bool;
    this.savePreferenceData();
    this.dispatchPreferenceUpdateEvent("isDisableTapSlidePage");
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

  get zoomButtonRatio(): number {
    return this.data.zoomButtonRatio;
  }

  set zoomButtonRatio(ratio: number) {
    this.data.zoomButtonRatio = ratio;
    this.savePreferenceData();
  }

  private savePreferenceData() {
    localStorage.setItem(this.PREFERENCE_KEY, JSON.stringify(this.data));
  }

  private dispatchPreferenceUpdateEvent(detail: PreferenceUpdateEventString) {
    const ev = new CustomEvent("LaymicPreferenceUpdate", {
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
        data = JSON.parse(dataStr);
      } catch(e) {
        console.error(e);
        localStorage.removeItem(this.PREFERENCE_KEY);
      }
    }

    return data;
  }

  /**
   * preferenceと関係する項目をセットする
   * 主にページ読み込み直後にLaymicクラスから呼び出される
   */
  applyPreferenceValues() {
    // 更新前のデータをdeep copy
    const oldData: PreferenceData = Object.assign(this.data);
    // 設定値をlocalStorageの値と同期させる
    this.data = this.loadPreferenceData();

    const dispatchs: PreferenceUpdateEventString[] = [];
    // 新旧で値が異なっていればdispatchsに追加
    if (oldData.progressBarWidth !== this.data.progressBarWidth) dispatchs.push("progressBarWidth");
    if (oldData.paginationVisibility !== this.data.paginationVisibility) dispatchs.push("paginationVisibility");
    if (oldData.isDisableTapSlidePage !== this.data.isDisableTapSlidePage) dispatchs.push("isDisableTapSlidePage");

    dispatchs.forEach(s => this.dispatchPreferenceUpdateEvent(s));

    // 読み込んだpreference値を各ボタン状態に適用
    this.overwritePreferenceElValues();
  }

  /**
   * 現在のpreference状態をボタン状態に適用する
   * 主に初期化時に用いる関数
   */
  private overwritePreferenceElValues() {
    const {
      isAutoFullscreen,
      isDisableTapSlidePage,
      paginationVisibility,
      progressBarWidth,
      zoomButtonRatio,
    } = this.buttons;

    const {
      active
    } = this.builder.stateNames;

    if (this.isAutoFullscreen) {
      isAutoFullscreen.classList.add(active);
    } else {
      isAutoFullscreen.classList.remove(active);
    }

    if (this.isDisableTapSlidePage) {
      isDisableTapSlidePage.classList.add(active);
    } else {
      isDisableTapSlidePage.classList.remove(active);
    }

    [
      {
        // pagination visibility
        els: this.getSelectItemEls(paginationVisibility),
        idx: this.uiVisibilityValues.indexOf(this.paginationVisibility)
      },
      {
        // progress bar width
        els: this.getSelectItemEls(progressBarWidth),
        idx: this.barWidthValues.indexOf(this.progressBarWidth)
      },
      {
        // zoom button ratio
        els: this.getSelectItemEls(zoomButtonRatio),
        idx: this.zoomButtonRatioValues.indexOf(this.zoomButtonRatio)
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
  private applyEventListeners() {
    this.buttons.isAutoFullscreen.addEventListener("click", () => {
      this.isAutoFullscreen = !this.isAutoFullscreen;
    });

    this.buttons.isDisableTapSlidePage.addEventListener("click", () => {
      this.isDisableTapSlidePage = !this.isDisableTapSlidePage;
    });

    const paginationVisibilityHandler = (e: MouseEvent, el: HTMLElement, itemEls: HTMLElement[]) => {
      if (!(e.target instanceof HTMLElement)) return;

      const idx = parseInt(e.target.dataset.itemIdx || "", 10);

      if (idx === 1) {
        // horizontal
        this.paginationVisibility = "hidden";
      } else if (idx === 2) {
        // vertical
        this.paginationVisibility = "visible";
      } else {
        // auto
        this.paginationVisibility = "auto";
      }

      itemEls.forEach(el => el.style.order = "");

      el.style.order = "-1";
    }

    const progressBarWidthHandler = (e: MouseEvent, el: HTMLElement, itemEls: HTMLElement[]) => {
      if (!(e.target instanceof HTMLElement)) return;

      const idx = parseInt(e.target.dataset.itemIdx || "", 10);

      if (idx === 1) {
        this.progressBarWidth = "none";
      } else if (idx === 2) {
        this.progressBarWidth = "tint";
      } else if (idx === 3) {
        this.progressBarWidth = "medium";
      } else if (idx === 4) {
        this.progressBarWidth = "bold";
      } else {
        // auto
        this.progressBarWidth = "auto";
      }

      itemEls.forEach(el => el.style.order = "");

      el.style.order = "-1";
    }

    const zoomButtonRatioHandler = (e: MouseEvent, el: HTMLElement, itemEls: HTMLElement[]) => {
      if (!(e.target instanceof HTMLElement)) return;

      const idx = parseInt(e.target.dataset.itemIdx || "", 10);

      if (idx === 1) {
        // 2.0倍
        this.zoomButtonRatio = 2.0;
      } else if (idx === 2) {
        // 2.5倍
        this.zoomButtonRatio = 2.5;
      } else if (idx === 3) {
        // 3.0倍
        this.zoomButtonRatio = 3.0;
      } else {
        // 1.5
        this.zoomButtonRatio = 1.5;
      }

      // 全ての子要素を一旦初期値に戻す
      itemEls.forEach(el => el.style.order = "");

      // クリックされた要素を一番上に押し上げる
      el.style.order = "-1";
    };

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
      {
        el: this.buttons.zoomButtonRatio,
        callback: (e: MouseEvent, el: HTMLElement, itemEls: HTMLElement[]) => zoomButtonRatioHandler(e, el, itemEls)
      }
    ].forEach(obj => {
      const {el: parentEl, callback} = obj;
      const els = this.getSelectItemEls(parentEl);
      if (isHTMLElementArray(els)) {
        els.forEach(el => el.addEventListener("click", e => {
          // 親要素がアクティブな時 === selectButtonが選択された時
          // この時だけ処理を動かす
          const isActive = parentEl.classList.contains(this.builder.stateNames.active);
          if (isActive) {
            callback(e, el, els);
          }
        }));
      }
    })

    // preference wrapperのクリックイベント
    this.wrapperEl.addEventListener("click", e => {
      // セレクトボタン要素を全て非アクティブ化
      this.deactivateSelectButtons();

      // クリックイベントをpreference containerへ伝播させない
      e.stopPropagation();
    })

    // preference containerのクリックイベント
    this.el.addEventListener("click", () => {
      this.deactivateSelectButtons();
      this.hidePreference();
    })
  }

  /**
   * 設定画面を表示する
   */
  showPreference() {
    this.rootEl.classList.add(this.builder.stateNames.showPreference);
  }

  /**
   * 設定画面を非表示とする
   */
  hidePreference() {
    this.rootEl.classList.remove(this.builder.stateNames.showPreference);
  }

  /**
   * 全てのセレクトボタンを非アクティブ状態にする
   * 設定画面が閉じられる際に呼び出される
   */
  private deactivateSelectButtons() {
    [
      this.buttons.progressBarWidth,
      this.buttons.paginationVisibility,
    ].forEach(el => el.classList.remove(this.builder.stateNames.active));
  }

  /**
   * 入力した要素内部にあるselectItem要素を配列として返す
   * @param  el selectButtonを想定した引数
   * @return    クラス名で抽出したElement配列
   */
  private getSelectItemEls(el: HTMLElement): Element[] {
    const selectItemClass = this.builder.classNames.select.item;
    return Array.from(el.getElementsByClassName(selectItemClass) || [])
  }

  /**
   * BarWidthの値から進捗バー幅数値を取得する
   * @param  widthStr BarWidth値
   * @return          対応する数値
   */
  getBarWidth(widthStr: BarWidth = "auto") {
    let width = 8;
    if (widthStr === "none") {
      width = 0;
    } else if (widthStr === "tint") {
      width = 4;
    } else if (widthStr === "bold")  {
      width = 12;
    }

    return width;
  }
}
