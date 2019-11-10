import DOMBuilder from "#/components/builder";
import { PreferenceData, BarWidth, PreferenceButtons, UIVisibility } from "#/interfaces/index";
export default class LaymicPreference {
    private readonly PREFERENCE_KEY;
    rootEl: HTMLElement;
    el: HTMLElement;
    wrapperEl: HTMLElement;
    buttons: PreferenceButtons;
    builder: DOMBuilder;
    data: PreferenceData;
    constructor(builder: DOMBuilder, rootEl: HTMLElement);
    private readonly defaultPreferenceData;
    isAutoFullscreen: boolean;
    isDisableTapSlidePage: boolean;
    progressBarWidth: BarWidth;
    paginationVisibility: UIVisibility;
    private savePreferenceData;
    private dispatchPreferenceUpdateEvent;
    /**
     * localStorageから設定データを読み込む
     */
    private loadPreferenceData;
    /**
     * preferenceと関係する項目をセットする
     * 主にページ読み込み直後にLaymicクラスから呼び出される
     */
    applyPreferenceValues(): void;
    /**
     * 現在のpreference状態をボタン状態に適用する
     * 主に初期化時に用いる関数
     */
    private overwritePreferenceElValues;
    /**
     * 各種ボタンイベントを登録する
     * インスタンス生成時に一度だけ呼び出される
     */
    private applyEventListeners;
    /**
     * 設定画面を表示する
     */
    showPreference(): void;
    /**
     * 設定画面を非表示とする
     */
    hidePreference(): void;
    /**
     * 全てのセレクトボタンを非アクティブ状態にする
     * 設定画面が閉じられる際に呼び出される
     */
    private deactivateSelectButtons;
    /**
     * 入力した要素内部にあるselectItem要素を配列として返す
     * @param  el selectButtonを想定した引数
     * @return    クラス名で抽出したElement配列
     */
    private getSelectItemEls;
    /**
     * BarWidthの値から進捗バー幅数値を取得する
     * @param  widthStr BarWidth値
     * @return          対応する数値
     */
    getBarWidth(widthStr?: BarWidth): number;
}
