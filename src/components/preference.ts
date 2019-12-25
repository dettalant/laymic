import { SimpleSelectBuilder, SelectItem, SimpleCheckboxBuilder, SimpleCheckbox, SimpleSelect } from "@dettalant/simple_choices";
import DOMBuilder from "./builder";
import {
  PreferenceData,
  PreferenceChoices,
  BarWidth,
  PreferenceUpdateEventString,
  UIVisibility
} from "../interfaces/index";
import {
  isBarWidth,
  isUIVisibility,
  setAriaExpanded,
  setRole,
  multiRafSleep
} from "../utils";

export default class LaymicPreference {
  private readonly PREFERENCE_KEY = "laymic_preferenceData";
  isActive = false;
  rootEl: HTMLElement;
  // preference el
  el: HTMLElement;
  // preference wrapper el
  wrapperEl: HTMLElement;
  choices: PreferenceChoices;
  builder: DOMBuilder;
  // preference save data
  data: PreferenceData = LaymicPreference.defaultPreferenceData;
  constructor(builder: DOMBuilder, rootEl: HTMLElement) {
    this.builder = builder;

    const selectBuilder = new SimpleSelectBuilder(this.builder.classNames.select);
    const icons = this.builder.icons;

    const checkboxBuilder = new SimpleCheckboxBuilder(this.builder.classNames.checkbox, {
      inner: this.builder.createSvgUseElement(icons.checkboxInner),
      outer: this.builder.createSvgUseElement(icons.checkboxOuter),
    });

    const containerEl = builder.createDiv();
    setAriaExpanded(containerEl, false);

    const names = this.builder.classNames.preference;

    containerEl.className = names.container;

    const wrapperEl = builder.createDiv();
    wrapperEl.className = names.wrapper;
    setRole(wrapperEl, "list");
    wrapperEl.tabIndex = -1;

    const isAutoFullscreen = checkboxBuilder.create(
      "ビューワー展開時の自動全画面化",
      false, this.genPreferenceButtonClass(names.isAutoFullscreen)
    );

    const isDisabledTapSlidePage = checkboxBuilder.create(
      "タップでのページ送り無効化",
      false,
      this.genPreferenceButtonClass(names.isDisabledTapSlidePage)
    );

    const isDisabledForceHorizView = checkboxBuilder.create(
      "端末横持ち時の強制2p表示無効化",
      false,
      this.genPreferenceButtonClass(names.isDisabledForceHorizView)
    )

    const isDisabledDoubleTapResetZoom = checkboxBuilder.create(
      "ズーム中ダブルタップでのズーム解除無効化",
      false,
      this.genPreferenceButtonClass(names.isDisabledDoubleTapResetZoom)
    );

    const progressBarWidth = selectBuilder.create(
      "進捗バー表示設定",
      this.barWidthItems,
      this.genPreferenceButtonClass()
    );

    const paginationVisibility = selectBuilder.create(
      "ページ送りボタン表示設定",
      this.uiVisibilityItems,
      this.genPreferenceButtonClass(names.paginationVisibility)
    );

    const zoomButtonRatio = selectBuilder.create(
      "ズームボタン倍率設定",
      this.zoomButtonRatioItems,
      this.genPreferenceButtonClass(names.zoomButtonRatio)
    );

    const noticeEl = builder.createDiv();
    noticeEl.className = names.notice;
    [
      "※1: 自動全画面化設定はビューワー展開ボタンクリック時にのみ用いられます",
      "※2: タップページ送り無効化設定は次回ページ読み込み時に適用されます",
    ].forEach(s => {
      const p = builder.createParagraph();
      p.textContent = s;
      noticeEl.appendChild(p);
    });

    const prefItemEls: HTMLElement[] = [
      // ここでの並び順が表示順に反映される
      progressBarWidth,
      zoomButtonRatio,
      paginationVisibility,
      isAutoFullscreen,
      isDisabledTapSlidePage,
      isDisabledForceHorizView,
      isDisabledDoubleTapResetZoom
    ].map(choice => choice.el.container);
    // 説明文要素を追加
    prefItemEls.push(noticeEl);

    prefItemEls.forEach(el => {
      wrapperEl.appendChild(el);
      setRole(el, "listitem");
    });
    containerEl.appendChild(wrapperEl);

    this.rootEl = rootEl;
    this.el = containerEl;
    this.wrapperEl = wrapperEl;

    this.choices = {
      progressBarWidth,
      paginationVisibility,
      zoomButtonRatio,
      isAutoFullscreen,
      isDisabledTapSlidePage,
      isDisabledForceHorizView,
      isDisabledDoubleTapResetZoom,
    };

    // 各種イベントをボタンに適用
    this.applyEventListeners();
  }

  /**
   * defaultデータは静的メソッドとして、
   * 外部からも容易に呼び出せるようにしておく
   */
  static get defaultPreferenceData(): PreferenceData {
    return {
      isAutoFullscreen: false,
      isDisabledTapSlidePage: false,
      isDisabledForceHorizView: false,
      isDisabledDoubleTapResetZoom: false,
      progressBarWidth: "auto",
      paginationVisibility: "auto",
      zoomButtonRatio: 1.5,
    }
  }

  get isAutoFullscreen(): boolean {
    return this.data.isAutoFullscreen;
  }

  set isAutoFullscreen(bool: boolean) {
    this.data.isAutoFullscreen = bool;
    this.savePreferenceData();
  }

  get isDisabledTapSlidePage(): boolean {
    return this.data.isDisabledTapSlidePage;
  }

  set isDisabledTapSlidePage(bool: boolean) {
    this.data.isDisabledTapSlidePage = bool;
    this.savePreferenceData();
    this.dispatchPreferenceUpdateEvent("isDisabledTapSlidePage");
  }

  get isDisabledForceHorizView(): boolean {
    return this.data.isDisabledForceHorizView;
  }

  set isDisabledForceHorizView(bool: boolean) {
    this.data.isDisabledForceHorizView = bool;
    this.savePreferenceData();
    this.dispatchPreferenceUpdateEvent("isDisabledForceHorizView");
  }

  get isDisabledDoubleTapResetZoom(): boolean {
    return this.data.isDisabledDoubleTapResetZoom;
  }

  set isDisabledDoubleTapResetZoom(bool: boolean) {
    this.data.isDisabledDoubleTapResetZoom = bool;
    this.savePreferenceData();
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

  private genPreferenceButtonClass(className: string = ""): string {
    let btnClassName = this.builder.classNames.preference.button;
    if (className) btnClassName += " " + className;
    return btnClassName;
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
    if (oldData.isDisabledTapSlidePage !== this.data.isDisabledTapSlidePage) dispatchs.push("isDisabledTapSlidePage");
    if (oldData.isDisabledForceHorizView !== this.data.isDisabledForceHorizView) dispatchs.push("isDisabledForceHorizView");

    dispatchs.forEach(s => this.dispatchPreferenceUpdateEvent(s));

    // 読み込んだpreference値を各ボタン状態に適用
    this.overwritePreferenceElValues();
  }

  /**
   * 設定画面を表示する
   */
  show() {
    this.rootEl.classList.add(this.builder.stateNames.showPreference);
    setAriaExpanded(this.rootEl, true);
    this.isActive = true;

    // 二回ほどrafSleepしてフォーカス移動タイミングをずらす
    // 小手先技コードなので、デバイスによっては上手く動かないかも
    multiRafSleep(2).then(() => {
      this.wrapperEl.focus();
    })
  }

  /**
   * 設定画面を非表示とする
   */
  hide() {
    this.rootEl.classList.remove(this.builder.stateNames.showPreference);
    setAriaExpanded(this.rootEl, false);
    this.isActive = false;

    // 設定画面を閉じる際にrootElへとフォーカスを移す
    this.rootEl.focus(); 
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
  loadPreferenceData(): PreferenceData {
    const dataStr = localStorage.getItem(this.PREFERENCE_KEY);

    let data = LaymicPreference.defaultPreferenceData;

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
   * 現在のpreference状態をボタン状態に適用する
   * 主に初期化時に用いる関数
   */
  private overwritePreferenceElValues() {
    const {
      paginationVisibility,
      progressBarWidth,
      zoomButtonRatio,
      isAutoFullscreen,
      isDisabledTapSlidePage,
      isDisabledForceHorizView,
      isDisabledDoubleTapResetZoom,
    } = this.choices;

    const checkboxs: {
      choice: SimpleCheckbox,
      bool: boolean,
    }[] = [
      {
        choice: isAutoFullscreen,
        bool: this.isAutoFullscreen
      },
      {
        choice: isDisabledTapSlidePage,
        bool: this.isDisabledTapSlidePage
      },
      {
        choice: isDisabledForceHorizView,
        bool: this.isDisabledForceHorizView
      },
      {
        choice: isDisabledDoubleTapResetZoom,
        bool: this.isDisabledDoubleTapResetZoom
      }
    ];

    checkboxs.forEach(obj => obj.choice.setChecked(obj.bool, false));

    const selects: {
      choice: SimpleSelect,
      idx: number,
    }[] = [
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
    ];

    selects.forEach(obj => {
      if (obj.idx !== -1) obj.choice.updateCurrentItem(obj.idx, false);
    })
  }

  /**
   * 各種ボタンイベントを登録する
   * インスタンス生成時に一度だけ呼び出される
   */
  private applyEventListeners() {
    const {
      paginationVisibility,
      progressBarWidth,
      zoomButtonRatio,
      isAutoFullscreen,
      isDisabledTapSlidePage,
      isDisabledForceHorizView,
      isDisabledDoubleTapResetZoom,
    } = this.choices;

    const isAutoFullscreenHandler = (bool: boolean) => this.isAutoFullscreen = bool;

    const isDisabledTapSlidePageHandler = (bool: boolean) => this.isDisabledTapSlidePage = bool;

    const isDisabledForceHorizViewHandler = (bool: boolean) => this.isDisabledForceHorizView = bool;

    const isDisabledDoubleTapResetZoomHandler = (bool: boolean) => this.isDisabledDoubleTapResetZoom = bool;

    const checkboxHandlers: {
      choice: SimpleCheckbox
      handler: Function
    }[] = [
      {
        choice: isAutoFullscreen,
        handler: isAutoFullscreenHandler
      },
      {
        choice: isDisabledTapSlidePage,
        handler: isDisabledTapSlidePageHandler
      },
      {
        choice: isDisabledForceHorizView,
        handler: isDisabledForceHorizViewHandler
      },
      {
        choice: isDisabledDoubleTapResetZoom,
        handler: isDisabledDoubleTapResetZoomHandler
      }
    ];

    checkboxHandlers.forEach(obj => {
      obj.choice.el.container.addEventListener("SimpleCheckboxEvent", ((e: CustomEvent<boolean>) => {
        obj.handler(e.detail);
      }) as EventListener)
    })

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

    const selectHandlers: {
      choice: SimpleSelect,
      handler: Function,
    }[] = [
      {
        choice: paginationVisibility,
        handler: paginationVisibilityHandler
      },
      {
        choice: progressBarWidth,
        handler: progressBarWidthHandler
      },
      {
        choice: zoomButtonRatio,
        handler: zoomButtonRatioHandler
      }
    ];

    selectHandlers.forEach(obj => {
      obj.choice.el.container.addEventListener("SimpleSelectEvent", ((e: CustomEvent<SelectItem>) => {
        obj.handler(e.detail);
      }) as EventListener)
    });

    // preference wrapperのクリックイベント
    this.wrapperEl.addEventListener("click", e => {
      // クリックイベントをpreference containerへ伝播させない
      e.stopPropagation();
    });

    // preference containerのクリックイベント
    this.el.addEventListener("click", () => {
      this.hide();
    });
  }
}
