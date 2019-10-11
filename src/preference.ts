import { ViewerDOMBuilder } from "#/builder";
import { PreferenceData, ViewerDirection, PreferenceButtons } from "#/interfaces";

const PREFERENCE_KEY = "mangaViewer_preferenceData";

export class MangaViewerPreference {
  // preference el
  el: HTMLElement;
  // preference wrapper el
  wrapperEl: HTMLElement;
  buttons: PreferenceButtons;
  // preference save data
  data: PreferenceData = this.loadPreferenceData();
  constructor(builder: ViewerDOMBuilder, className?: string) {
    const containerEl = builder.createDiv();
    containerEl.className = (className) ? className : "mangaViewer_preference";

    const wrapperEl = builder.createDiv();
    wrapperEl.className = "mangaViewer_preferenceWrapper";

    const preferenceBtnClass = "mangaViewer_preferenceButton";
    const isAutoFullscreen = builder.createCheckBoxButton("isAutoFullscreen: ", preferenceBtnClass);

    const viewerDirection = builder.createSelectButton("viewerDirection: ", preferenceBtnClass);

    const isEnableTapSlidePage = builder.createCheckBoxButton("isEnableTapSlidePage: ", preferenceBtnClass);

    [
      isAutoFullscreen,
      viewerDirection,
      isEnableTapSlidePage
    ].forEach(el => wrapperEl.appendChild(el));
    containerEl.appendChild(wrapperEl);

    isAutoFullscreen.addEventListener("click", () => {
      console.log("isAutoFullscreen");
    });


    this.el = containerEl;
    this.wrapperEl = wrapperEl;
    this.buttons = {
      isAutoFullscreen,
      isEnableTapSlidePage,
      viewerDirection
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

  get viewerDirection(): ViewerDirection {
    return this.data.viewerDirection;
  }

  set viewerDirection(direction: ViewerDirection) {
    this.data.viewerDirection = direction;
    this.savePreferenceData();
  }

  private savePreferenceData() {
    localStorage.setItem(PREFERENCE_KEY, JSON.stringify(this.data));
  }

  /**
   * localStorageから設定データを読み込む
   */
  private loadPreferenceData(): PreferenceData {
    const dataStr = localStorage.getItem(PREFERENCE_KEY);
    const data = (dataStr)
      ? JSON.parse(dataStr)
      : {
        isAutoFullscreen: false,
        isEnableTapSlidePage: false,
        viewerDirection: "auto",
      };
    return data;
  }
}
