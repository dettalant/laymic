import {ViewerDOMBuilder} from "#/builder";

interface PreferenceData {

}

export class MangaViewerPreference {
  // preference el
  el: HTMLElement;
  // preference wrapper el
  wrapperEl: HTMLElement;
  // preference save data
  data: PreferenceData = this.loadPreferenceData();
  constructor(builder: ViewerDOMBuilder, className?: string) {
    const containerEl = builder.createDiv();
    containerEl.className = (className) ? className : "mangaViewer_preference";

    const wrapperEl = builder.createDiv();
    wrapperEl.className = "mangaViewer_preferenceWrapper";

    const testTextEl = builder.createDiv();
    testTextEl.textContent = "設定部分制作中";

    wrapperEl.appendChild(testTextEl);
    containerEl.appendChild(wrapperEl);

    this.el = containerEl;
    this.wrapperEl = wrapperEl;
  }

  /**
   * localStorageから設定データを読み込む
   */
  private loadPreferenceData(): PreferenceData {
    return {

    }
  }
}
