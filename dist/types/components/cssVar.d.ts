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
     * css変数として表示可能ページサイズを登録する
     * 厳密なサイズではなく、cssレイアウトに用いるための誤差の多い計算
     * 正確な値はupdatePageRealSize()の方で行う
     */
    updatePageSize(): void;
    /**
     * laymicに登録されたページ最大サイズをcss変数に登録する
     */
    updatePageMaxSize(): void;
    /**
     * プログレスバーの太さ数値をcss変数に登録する
     */
    updateProgressBarWidth(): void;
    /**
     * viewerPadding数値をcss変数に登録する
     */
    updateViewerPadding(): void;
    /**
     * 各スライドの実質サイズをcss変数に登録する
     */
    updatePageRealSize(isDoubleSlideHorizView: boolean): void;
    /**
     * 各スライド実寸サイズ / 最大表示サイズの比率をcss変数に登録する
     * この数値を使えば正確なscaleが行えるようになるはず
     *
     * @param  isDoubleSlideHorizView 2p見開き表示ならtrue
     */
    updatePageScaleRatio(isDoubleSlideHorizView: boolean): void;
    updateJsVh(): void;
    /**
     * cssレイアウトに用いる各ページサイズを返す
     * 正確な値ではないことに注意
     */
    private getPageSize;
    /**
     * pageMaxSizeとpageRealSizeの差異から縮小率を返す
     * @param  isDoubleSlideHorizView 2p見開き表示ならtrue
     * @return                        scaleに用いる縮小表示率
     */
    private getPageScaleRatio;
    /**
     * ページの実寸表示数値を出力する
     * getPageSize()と比較して、厳密な計算を行っていることが特徴
     * @param  isDoubleSlideHorizView 2p見開き表示ならtrue
     * @return                        実寸のページサイズ
     */
    private getPageRealSize;
}
