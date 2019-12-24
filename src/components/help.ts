import DOMBuilder from "./builder";
import { setAriaExpanded } from "../utils";

export default class LaymicHelp {
  private readonly ISDISPLAYED_KEY = "laymic_isHelpDisplayed";
  // 表示済みか否かを判別するbool
  _isDisplayed: boolean = false;
  // 表示中か否かを判別するbool
  isActive = false;
  rootEl: HTMLElement;
  // help el
  el: HTMLElement;
  // help wrapper el
  wrapperEl: HTMLElement;
  readonly builder: DOMBuilder;
  constructor(builder: DOMBuilder, rootEl: HTMLElement) {
    this.rootEl = rootEl;
    this.builder = builder;
    const helpClassNames = builder.classNames.help;

    const containerEl = builder.createDiv();
    containerEl.className = helpClassNames.container;
    setAriaExpanded(containerEl, false);

    const wrapperEl = builder.createHelpWrapperEl();

    containerEl.appendChild(wrapperEl);

    this.el = containerEl;
    this.wrapperEl = containerEl;

    // 各種イベントをボタンに適用
    this.applyEventListeners();

    this.loadIsDisplayedData();
    if (!this.isDisplayed) {
      this.show();
    }
  }

  private loadIsDisplayedData() {
    const isDisplayedStr = localStorage.getItem(this.ISDISPLAYED_KEY) || "";
    if (isDisplayedStr === "true") {
      this._isDisplayed = true;
    }
  }

  private get isDisplayed() {
    return this._isDisplayed;
  }

  private set isHelpDisplayed(bool: boolean) {
    this._isDisplayed = bool;
    localStorage.setItem(this.ISDISPLAYED_KEY, "true");
  }

  show() {
    this.rootEl.classList.add(this.builder.stateNames.showHelp);
    setAriaExpanded(this.rootEl, true);
    this.isActive = true;
  }

  hide() {
    this.rootEl.classList.remove(this.builder.stateNames.showHelp);
    setAriaExpanded(this.rootEl, false);

    this.isHelpDisplayed = true;
    this.isActive = false;
  }

  private applyEventListeners() {
    this.el.addEventListener("click", () => {
      this.hide();
    })
  }
}
