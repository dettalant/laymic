import { ViewerDOMBuilder } from "#/builder";
import { PreferenceData, BarWidth, PreferenceButtons, StateClassNames } from "#/interfaces";
export declare class MangaViewerPreference {
    rootEl: HTMLElement;
    el: HTMLElement;
    wrapperEl: HTMLElement;
    buttons: PreferenceButtons;
    stateNames: StateClassNames;
    data: PreferenceData;
    constructor(builder: ViewerDOMBuilder, rootEl: HTMLElement, className?: string);
    isAutoFullscreen: boolean;
    isEnableTapSlidePage: boolean;
    progressBarWidth: BarWidth;
    private readonly defaultPreferenceData;
    private savePreferenceData;
    private dispatchViewerUpdateEvent;
    /**
     * localStorageから設定データを読み込む
     */
    private loadPreferenceData;
    /**
     * 現在のpreference状態をボタン状態に適用する
     * 主に初期化時に用いる関数
     */
    private applyCurrentPreferenceValue;
    /**
     * 各種ボタンイベントを登録する
     * インスタンス生成時に一度だけ呼び出される
     */
    private applyButtonEventListeners;
}
