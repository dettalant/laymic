import DOMBuilder from "./builder";
import { setAriaExpanded, multiRafSleep } from "../utils";

export default class LaymicHelp {
  private readonly ISDISPLAYED_KEY = "laymic_isHelpDisplayed";
  readonly rootEl: HTMLElement;
  // help el
  readonly el: HTMLElement;
  // help wrapper el
  readonly wrapperEl: HTMLElement;
  readonly builder: DOMBuilder;
  // 表示中か否かを判別するbool
  private _isActive = false;
  // 表示済みか否かを判別するbool
  private _isDisplayed: boolean = this.loadIsDisplayed();

  constructor(builder: DOMBuilder, rootEl: HTMLElement) {
    this.rootEl = rootEl;
    this.builder = builder;
    const helpNames = builder.classNames.help;

    const containerEl = builder.createDiv(helpNames.container);
    setAriaExpanded(containerEl, false);
    containerEl.tabIndex = -1;

    const wrapperEl = builder.createHelpWrapperEl();

    containerEl.appendChild(wrapperEl);

    this.el = containerEl;
    this.wrapperEl = containerEl;

    // 各種イベントをボタンに適用
    this.applyEventListeners();
  }

  /**
   * ヘルプ画面が現在表示中であるかのboolを返す
   * @return ヘルプ画面表示中ならばtrue
   */
  get isActive(): boolean {
    return this._isActive;
  }

  /**
   * ヘルプ表示済みかどうかをlocalStorageから取得する
   * @return 表示済みならばtrue
   */
  private loadIsDisplayed(): boolean {
    let isDisplayed = false;
    const isDisplayedStr = localStorage.getItem(this.ISDISPLAYED_KEY) || "";
    if (isDisplayedStr === "true") isDisplayed = true;

    return isDisplayed;
  }

  /**
   * ヘルプが表示済みかの値を更新する
   * 主に「laymic初回表示がなされて、かつ二回目以降の表示も同じページ読み込みの際に行われた」時に表示済みとするための関数
   *
   * isDisplayedがすでにtrueの場合は処理スキップ
   * falseの場合にのみlocalStorageの値を取得する
   */
  private updateIsDisplayed() {
    if (this.isDisplayed) return;
    this._isDisplayed = this.loadIsDisplayed();
  }

  /**
   * ヘルプが表示済みかのboolを返す
   * @return 表示済みならばtrue
   */
  get isDisplayed() {
    return this._isDisplayed;
  }

  /**
   * ヘルプ表示済みかの値を切り返る
   * @param  bool 新しく指定する値
   */
  set isDisplayed(bool: boolean) {
    this._isDisplayed = bool;
    const boolStr = (bool) ? "true" : "false";
    localStorage.setItem(this.ISDISPLAYED_KEY, boolStr);
  }

  /**
   * ヘルプ画面を表示する
   */
  show() {
    this.rootEl.classList.add(this.builder.stateNames.showHelp);
    setAriaExpanded(this.rootEl, true);
    this._isActive = true;

    // フォーカス移動
    // 二回ほどrafSleepすると良い塩梅になる
    multiRafSleep(2).then(() => {
      this.el.focus();
    })
  }

  /**
   * ヘルプ画面を閉じる
   */
  hide() {
    this.rootEl.classList.remove(this.builder.stateNames.showHelp);
    setAriaExpanded(this.rootEl, false);

    this.isDisplayed = true;
    this._isActive = false;

    // 閉止時にrootElへとフォーカスを移す
    this.rootEl.focus();
  }

  /**
   * localStorageの値を参照して、
   * 全てのlaymicインスタンス共通で一度だけヘルプ表示する
   */
  showOnlyOnce() {
    this.updateIsDisplayed();
    if (!this.isDisplayed) {
      this.show()
    }
  }

  /**
   * ヘルプ画面と関連するイベントリスナーを設定する
   */
  private applyEventListeners() {
    this.el.addEventListener("click", () => {
      this.hide();
    })
  }
}
