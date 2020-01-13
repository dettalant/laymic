import DOMBuilder from "./builder";
export default class LaymicHelp {
    private readonly ISDISPLAYED_KEY;
    readonly rootEl: HTMLElement;
    readonly el: HTMLElement;
    readonly wrapperEl: HTMLElement;
    readonly builder: DOMBuilder;
    private _isActive;
    private _isDisplayed;
    constructor(builder: DOMBuilder, rootEl: HTMLElement);
    /**
     * ヘルプ画面が現在表示中であるかのboolを返す
     * @return ヘルプ画面表示中ならばtrue
     */
    readonly isActive: boolean;
    /**
     * ヘルプ表示済みかどうかをlocalStorageから取得する
     * @return 表示済みならばtrue
     */
    private loadIsDisplayed;
    /**
     * ヘルプが表示済みかの値を更新する
     * 主に「laymic初回表示がなされて、かつ二回目以降の表示も同じページ読み込みの際に行われた」時に表示済みとするための関数
     *
     * isDisplayedがすでにtrueの場合は処理スキップ
     * falseの場合にのみlocalStorageの値を取得する
     */
    private updateIsDisplayed;
    /**
     * ヘルプが表示済みかのboolを返す
     * @return 表示済みならばtrue
     */
    /**
    * ヘルプ表示済みかの値を切り返る
    * @param  bool 新しく指定する値
    */
    isDisplayed: boolean;
    /**
     * ヘルプ画面を表示する
     */
    show(): void;
    /**
     * ヘルプ画面を閉じる
     */
    hide(): void;
    /**
     * localStorageの値を参照して、
     * 全てのlaymicインスタンス共通で一度だけヘルプ表示する
     */
    showOnlyOnce(): void;
    /**
     * ヘルプ画面と関連するイベントリスナーを設定する
     */
    private applyEventListeners;
}
