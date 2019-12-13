import DOMBuilder from "./builder";
import { PreferenceData, PreferenceChoices, BarWidth, UIVisibility } from "../interfaces/index";
export default class LaymicPreference {
    private readonly PREFERENCE_KEY;
    rootEl: HTMLElement;
    el: HTMLElement;
    wrapperEl: HTMLElement;
    choices: PreferenceChoices;
    builder: DOMBuilder;
    data: PreferenceData;
    constructor(builder: DOMBuilder, rootEl: HTMLElement);
    isAutoFullscreen: boolean;
    isDisableTapSlidePage: boolean;
    progressBarWidth: BarWidth;
    paginationVisibility: UIVisibility;
    zoomButtonRatio: number;
    private readonly defaultPreferenceData;
    private readonly barWidthItems;
    private readonly uiVisibilityItems;
    private readonly zoomButtonRatioItems;
    /**
     * preferenceと関係する項目をセットする
     * 主にページ読み込み直後にLaymicクラスから呼び出される
     */
    applyPreferenceValues(): void;
    /**
     * 設定画面を表示する
     */
    show(): void;
    /**
     * 設定画面を非表示とする
     */
    hide(): void;
    /**
     * BarWidthの値から進捗バー幅数値を取得する
     * @param  widthStr BarWidth値
     * @return          対応する数値
     */
    getBarWidth(widthStr?: BarWidth): number;
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
    private overwritePreferenceElValues;
    /**
     * 各種ボタンイベントを登録する
     * インスタンス生成時に一度だけ呼び出される
     */
    private applyEventListeners;
}
