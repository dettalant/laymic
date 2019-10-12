import { ViewerDOMBuilder } from "#/builder";
import { PreferenceData, ViewerDirection, PreferenceButtons, StateClassNames } from "#/interfaces";
export declare class MangaViewerPreference {
    el: HTMLElement;
    wrapperEl: HTMLElement;
    buttons: PreferenceButtons;
    stateNames: StateClassNames;
    data: PreferenceData;
    constructor(builder: ViewerDOMBuilder, className?: string);
    isAutoFullscreen: boolean;
    isEnableTapSlidePage: boolean;
    viewerDirection: ViewerDirection;
    private readonly defaultPreferenceData;
    private savePreferenceData;
    /**
     * localStorageから設定データを読み込む
     */
    private loadPreferenceData;
    /**
     * 現在のpreference状態をボタン状態に適用する
     * 主に初期化時に用いる関数
     */
    private applyCurrentPreferenceValue;
    private isHTMLElementArray;
    /**
     * 各種ボタンイベントを登録する
     * インスタンス生成時に一度だけ呼び出される
     */
    private applyButtonEventListeners;
}
