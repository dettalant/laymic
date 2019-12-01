import { ViewerStates, ViewerElements } from "#/interfaces/index";
export default class LaymicCSSVariables {
    el: ViewerElements;
    state: ViewerStates;
    constructor(el: ViewerElements, state: ViewerStates);
    /**
     * laymicインスタンスの初期化時に行うcss変数登録まとめ関数
     */
    initCSSVars(): void;
    /**
     * css変数として表示可能ページ最大サイズを登録する
     */
    pageSizeUpdate(): void;
    /**
     * laymicに登録されたページ最大サイズをcss変数に登録する
     */
    pageMaxSizeUpdate(): void;
    /**
     * プログレスバーの太さ数値をcss変数に登録する
     */
    progressBarWidthUpdate(): void;
    /**
     * viewerPadding数値をcss変数に登録する
     */
    viewerPaddingUpdate(): void;
    /**
     * 各スライドの実質サイズをcss変数に登録する
     */
    pageRealSizeUpdate(isDoubleSlideHorizView: boolean): void;
    /**
     * 各スライド実寸サイズ / 最大表示サイズの比率をcss変数に登録する
     * この数値を使えば正確なscaleが行えるようになるはず
     *
     * @param  isDoubleSlideHorizView 2p見開き表示ならtrue
     */
    pageScaleRatioUpdate(isDoubleSlideHorizView: boolean): void;
    jsVhUpdate(): void;
    private getPageSize;
    private getPageScaleRatio;
    /**
     * ページの実寸表示数値を出力する
     * @param  isDoubleSlideHorizView 2p見開き表示ならtrue
     * @return                        実寸のページサイズ
     */
    private getPageRealSize;
}
