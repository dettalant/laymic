import { ViewerDOMBuilder } from "#/builder";
import { PreferenceData, ViewerDirection, PreferenceButtons } from "#/interfaces";
export declare class MangaViewerPreference {
    el: HTMLElement;
    wrapperEl: HTMLElement;
    buttons: PreferenceButtons;
    data: PreferenceData;
    constructor(builder: ViewerDOMBuilder, className?: string);
    isAutoFullscreen: boolean;
    isEnableTapSlidePage: boolean;
    viewerDirection: ViewerDirection;
    private savePreferenceData;
    /**
     * localStorageから設定データを読み込む
     */
    private loadPreferenceData;
}
