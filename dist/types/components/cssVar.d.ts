import { ViewerStates, ViewerElements } from "#/interfaces/index";
export default class LaymicCSSVariables {
    el: ViewerElements;
    state: ViewerStates;
    constructor(el: ViewerElements, state: ViewerStates);
    /**
     * css変数として表示可能ページ最大サイズを登録する
     */
    pageSizeUpdate(): void;
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
    jsVhUpdate(): void;
}
