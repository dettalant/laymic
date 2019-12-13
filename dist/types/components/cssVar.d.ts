import LaymicStates from "./states";
import { ViewerElements } from "../interfaces/index";
export default class LaymicCSSVariables {
    el: ViewerElements;
    state: LaymicStates;
    constructor(el: ViewerElements, state: LaymicStates);
    /**
     * laymicインスタンスの初期化時に行うcss変数登録まとめ関数
     */
    initCSSVars(): void;
    /**
     * css変数として表示可能ページサイズを登録する
     * 厳密な表示サイズを計算する仕様に変更
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
     * 各スライド実寸サイズ / 最大表示サイズの比率をcss変数に登録する
     * この数値を使えば正確なscaleが行えるようになるはず
     *
     * @param  isDoubleSlideHorizView 2p見開き表示ならtrue
     */
    updatePageScaleRatio(): void;
    updateJsVh(): void;
    /**
     * cssレイアウトに用いる各ページサイズを返す
     * 正確な値ではないことに注意
     */
    /**
     * pageMaxSizeとpageRealSizeの差異から縮小率を返す
     * @return                        scaleに用いる縮小表示率
     */
    private getPageScaleRatio;
    /**
     * ページの実寸表示数値を出力する
     * getPageSize()と比較して、厳密な計算を行っていることが特徴
     * @return                        実寸のページサイズ
     */
    private getPageRealSize;
}
