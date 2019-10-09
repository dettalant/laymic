import { ViewerDOMBuilder } from "#/builder";
interface PreferenceData {
}
export declare class MangaViewerPreference {
    el: HTMLElement;
    wrapperEl: HTMLElement;
    data: PreferenceData;
    constructor(builder: ViewerDOMBuilder, className?: string);
    /**
     * localStorageから設定データを読み込む
     */
    private loadPreferenceData;
}
export {};
