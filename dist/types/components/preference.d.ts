import DOMBuilder from "#/components/builder";
import { PreferenceData, BarWidth, PreferenceButtons, StateClassNames, UIVisibility } from "#/interfaces";
export default class Preference {
    private readonly PREFERENCE_KEY;
    rootEl: HTMLElement;
    el: HTMLElement;
    wrapperEl: HTMLElement;
    buttons: PreferenceButtons;
    stateNames: StateClassNames;
    data: PreferenceData;
    constructor(builder: DOMBuilder, rootEl: HTMLElement, className?: string);
    private readonly defaultPreferenceData;
    isAutoFullscreen: boolean;
    isEnableTapSlidePage: boolean;
    progressBarWidth: BarWidth;
    paginationVisibility: UIVisibility;
    private savePreferenceData;
    private dispatchPreferenceUpdateEvent;
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
    private applyEventListeners;
    /**
     * 全てのセレクトボタンを非アクティブ状態にする
     */
    private deactivateSelectButtons;
    /**
     * 入力した要素内部にあるselectItem要素を配列として返す
     * @param  el selectButtonを想定した引数
     * @return    クラス名で抽出したElement配列
     */
    private getSelectItemEls;
}
