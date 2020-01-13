import DOMBuilder from "./builder";
import { PreferenceData, PreferenceChoices, BarWidth, UIVisibility } from "../interfaces/index";
export default class LaymicPreference {
    private readonly PREFERENCE_KEY;
    readonly rootEl: HTMLElement;
    readonly el: HTMLElement;
    readonly wrapperEl: HTMLElement;
    readonly choices: PreferenceChoices;
    readonly builder: DOMBuilder;
    private data;
    private _isActive;
    constructor(builder: DOMBuilder, rootEl: HTMLElement);
    /**
     * 設定画面が現在表示中であるかのboolを返す
     * @return 設定画面表示中であるならばtrue
     */
    readonly isActive: boolean;
    /**
     * defaultデータは静的メソッドとして、
     * 外部からも容易に呼び出せるようにしておく
     */
    static readonly defaultPreferenceData: PreferenceData;
    /**
     * ビューワー展開時の自動フルスクリーン化のbool
     * この設定がtrueであっても、ユーザー操作イベント経由でないと
     * 自動全画面化は行われない
     *
     * @return trueなら自動フルスクリーン化
     */
    /**
    * ビューワー展開時の自動フルスクリーン化のbool
    * @param  bool trueなら自動フルスクリーン化
    */
    isAutoFullscreen: boolean;
    /**
     * タップでのページ送りを無効化するかのbool
     * @return trueならばタップでのページ送り無効化
     */
    /**
    * タップでのページ送りを無効化するかのbool
    * 同時にPreferenceUpdateEventを発火させる
    *
    * @param  bool trueならばタップでのページ送り無効化
    */
    isDisabledTapSlidePage: boolean;
    /**
     * モバイル環境横持ち時の強制2p表示を無効化するかのbool
     * @return trueならば強制2p表示無効化
     */
    /**
    * モバイル環境横持ち時の強制2p表示を無効化するかのbool
    * 同時にPreferenceUpdateEventを発火させる
    *
    * @param  bool trueならば強制2p表示無効化
    */
    isDisabledForceHorizView: boolean;
    /**
     * ズーム時ダブルタップでのズーム終了機能を無効化するかのbool
     * @return trueならばダブルタップでのズーム終了を無効化
     */
    /**
    * ズーム時ダブルタップでのズーム終了機能を無効化するかのbool
    * @param  bool trueならばダブルタップでのズーム終了を無効化
    */
    isDisabledDoubleTapResetZoom: boolean;
    /**
     * 進捗バーの太さ値を返す
     * @return BarWidth文字列
     */
    /**
    * 新たな進捗バーの太さ値を設定する
    * 同時にPreferenceUpdateEventを発火させる
    *
    * @param  width BarWidth文字列
    */
    progressBarWidth: BarWidth;
    /**
     * ページ送りボタンの表示設定値を返す
     * @return UIVisibility文字列
     */
    /**
    * 新たなページ送りボタン表示設定値を設定する
    * 同時にPreferenceUpdateEventを発火させる
    *
    * @param  visibility UIVisibility文字列
    */
    paginationVisibility: UIVisibility;
    /**
     * PC版ズームボタン押下時のズーム率を返す
     * @return ズーム率数値
     */
    /**
    * PC版ズームボタン押下時のズーム率を設定する
    * @param  ratio ズーム率数値
    */
    zoomButtonRatio: number;
    /**
     * 設定ボタン要素に指定するクラス名を生成する
     * @param  className preferenceButtonクラスに加えて指定するクラス名
     * @return           ボタンクラス名文字列
     */
    private genPreferenceButtonClass;
    /**
     * BarWidth Itemの内部値と表示ラベル値をまとめたものを返す
     * @return BarWidth Itemをまとめた配列
     */
    private readonly barWidthItems;
    /**
     * UIVisibility Itemの内部値と表示ラベルをまとめたものを返す
     * @return UIVisibility Itemをまとめた配列
     */
    private readonly uiVisibilityItems;
    /**
     * zoomButtonRatioの内部値と表示ラベルをまとめたものを返す
     * @return zoomButtonRatio Itemをまとめた配列
     */
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
    /**
     * 現在の設定値オブジェクトをlocalStorageに保存する
     */
    private savePreferenceData;
    /**
     * LaymicPreferenceUpdateイベントを発火させる
     * このイベントはlaymicの設定値が変更された際に発火するイベントである。
     * @param  detail どの値が変更されたかを通知する文字列
     */
    private dispatchPreferenceUpdateEvent;
    /**
     * localStorageから設定データを読み込む
     */
    loadPreferenceData(): PreferenceData;
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
