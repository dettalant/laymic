import { ViewerPages, ViewerStates } from "#/interfaces/index";
import DOMBuilder from "#/components/builder";
export default class LaymicThumbnails {
    state: ViewerStates;
    builder: DOMBuilder;
    rootEl: HTMLElement;
    el: HTMLElement;
    wrapperEl: HTMLElement;
    thumbEls: Element[];
    constructor(builder: DOMBuilder, rootEl: HTMLElement, pages: ViewerPages, thumbPages: string[], state: ViewerStates);
    /**
     * thumbsWrapperElのwidthを計算し、
     * 折り返しが発生しないようなら横幅の値を書き換える
     */
    cssThumbsWrapperWidthUpdate(rootEl: HTMLElement): void;
    show(): void;
    hide(): void;
    /**
     * 読み込み待ち状態のimg elementを全て読み込む
     * いわゆるlazyload処理
     */
    private revealImgs;
    /**
     * 各種イベントリスナーの登録
     */
    private applyEventListeners;
}
