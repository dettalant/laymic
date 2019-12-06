import { SimpleSelectBuilder, SelectItem } from "@dettalant/simple_choices";
import DOMBuilder from "#/components/builder";
import {
  PreferenceData,
  PreferenceChoices,
  BarWidth,
  PreferenceButtons,
  PreferenceUpdateEventString,
  UIVisibility
} from "#/interfaces/index";
import { isBarWidth, isUIVisibility } from "#/utils";

export default class LaymicPreference {
  private readonly PREFERENCE_KEY = "laymic_preferenceData";
  rootEl: HTMLElement;
  // preference el
  el: HTMLElement;
  // preference wrapper el
  wrapperEl: HTMLElement;
  buttons: PreferenceButtons;
  choices: PreferenceChoices;
  builder: DOMBuilder;
  // preference save data
  data: PreferenceData = this.defaultPreferenceData;
  constructor(builder: DOMBuilder, rootEl: HTMLElement) {
    this.builder = builder;
    const selectBuilder = new SimpleSelectBuilder(this.builder.classNames.select);

    const containerEl = builder.createDiv();
    const preferenceClassNames = this.builder.classNames.preference;
    containerEl.className = preferenceClassNames.container;

    const wrapperEl = builder.createDiv();
    wrapperEl.className = preferenceClassNames.wrapper;

    const preferenceBtnClass = preferenceClassNames.button;
    const isAutoFullscreen = builder.createCheckBoxButton("ビューワー展開時の自動全画面化", `${preferenceBtnClass} ${preferenceClassNames.isAutoFullscreen}`);

    const isDisableTapSlidePage = builder.createCheckBoxButton("タップデバイスでのタップページ送りを無効化", preferenceBtnClass);

    const progressBarWidth = selectBuilder.create("進捗バー表示設定", this.barWidthItems, preferenceBtnClass);

    const paginationVisibility = selectBuilder.create(
      "ページ送りボタン表示設定",
      this.uiVisibilityItems,
      `${preferenceBtnClass} ${preferenceClassNames.paginationVisibility}`
    );

    const zoomButtonRatio = selectBuilder.create(
      "ズームボタン倍率設定",
      this.zoomButtonRatioItems,
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
      progressBarWidth.el.container,
      paginationVisibility.el.container,
      zoomButtonRatio.el.container,
      isAutoFullscreen,
      isDisableTapSlidePage,
      descriptionEl
    ].forEach(el => wrapperEl.appendChild(el));
    containerEl.appendChild(wrapperEl);

    this.rootEl = rootEl;
    this.el = containerEl;
    this.wrapperEl = wrapperEl;
    this.buttons = {
      progressBarWidth: progressBarWidth.el.container,
      paginationVisibility: paginationVisibility.el.container,
      zoomButtonRatio: paginationVisibility.el.container,
      isAutoFullscreen,
      isDisableTapSlidePage,
    };

    this.choices = {
      progressBarWidth,
      paginationVisibility,
      zoomButtonRatio,
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

  private get barWidthItems(): SelectItem[] {
    return [
      {value: "auto", label: "初期値"},
      {value: "none", label: "非表示"},
      {value: "tint", label: "細い"},
      {value: "medium", label: "普通"},
      {value: "bold", label: "太い"},
    ]
  }

  private get uiVisibilityItems(): SelectItem[] {
    return [
      {value: "auto", label: "初期値"},
      {value: "hidden", label: "非表示"},
      {value: "visible", label: "表示"},
    ]
  }

  private get zoomButtonRatioItems(): SelectItem[] {
    return [
      { value: 1.5, label: "1.5倍"},
      { value: 2.0, label: "2.0倍"},
      { value: 2.5, label: "2.5倍"},
      { value: 3.0, label: "3.0倍"},
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

  set progressBarWidth(width: BarWidth) {
    this.data.progressBarWidth = width;
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
    } = this.buttons;
    const {
      paginationVisibility,
      progressBarWidth,
      zoomButtonRatio,
    } = this.choices;

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
        choice: paginationVisibility,
        idx: this.uiVisibilityItems.findIndex(item => item.value === this.paginationVisibility)
      },
      {
        choice: progressBarWidth,
        idx: this.barWidthItems.findIndex(item => item.value === this.progressBarWidth)
      },
      {
        choice: zoomButtonRatio,
        idx: this.zoomButtonRatioItems.findIndex(item => item.value === this.zoomButtonRatio)
      }
    ].forEach(obj => {
      if (obj.idx !== -1) obj.choice.updateCurrentItem(obj.idx, false);
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

    const paginationVisibilityHandler = (item: SelectItem) => {
      if (isUIVisibility(item.value))
      this.paginationVisibility = item.value;
    }

    const progressBarWidthHandler = (item: SelectItem) => {
      if (isBarWidth(item.value)) this.progressBarWidth = item.value;
    }

    const zoomButtonRatioHandler = (item: SelectItem) => {
      const ratio = item.value;
      if (Number.isFinite(ratio)) this.zoomButtonRatio = ratio;
    }

    [
      {
        choice: this.choices.paginationVisibility,
        handler: paginationVisibilityHandler
      },
      {
        choice: this.choices.progressBarWidth,
        handler: progressBarWidthHandler,
      },
      {
        choice: this.choices.zoomButtonRatio,
        handler: zoomButtonRatioHandler
      }
    ].forEach(obj => {
      obj.choice.el.container.addEventListener("SimpleSelectItemEvent", ((e: CustomEvent<SelectItem>) => {
        obj.handler(e.detail);
      }) as EventListener)
    })

    // preference wrapperのクリックイベント
    this.wrapperEl.addEventListener("click", e => {
      // クリックイベントをpreference containerへ伝播させない
      e.stopPropagation();
    })

    // preference containerのクリックイベント
    this.el.addEventListener("click", () => {
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
