import DOMBuilder from "#/components/builder";
import { vertHelpImg, horizHelpImg } from "#/components/helpImg";

export default class LaymicHelp {
  private readonly ISDISPLAYED_KEY = "laymic_isHelpDisplayed";
  // 表示済みか否かを判別するbool
  _isDisplayed: boolean = false;
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

    const wrapperEl = builder.createDiv();
    wrapperEl.className = helpClassNames.wrapper;

    [
      {
        src: horizHelpImg,
        className: helpClassNames.horizImg
      },
      {
        src: vertHelpImg,
        className: helpClassNames.vertImg
      }
    ].forEach(obj => {
      const img = new Image();
      img.src = obj.src;
      img.className = obj.className;
      wrapperEl.appendChild(img);
    })

    containerEl.appendChild(wrapperEl);

    this.el = containerEl;
    this.wrapperEl = containerEl;

    // 各種イベントをボタンに適用
    this.applyEventListeners();

    this.loadIsDisplayedData();
    if (!this.isDisplayed) {
      this.showHelp();
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

  showHelp() {
    this.rootEl.classList.add(this.builder.stateNames.showHelp);
  }

  hideHelp() {
    this.rootEl.classList.remove(this.builder.stateNames.showHelp);
    this.isHelpDisplayed = true;
  }

  private applyEventListeners() {
    this.el.addEventListener("click", () => {
      this.hideHelp();
    })
  }
}
