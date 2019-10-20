import { ViewerPages, ViewerStates, StateClassNames } from "#/interfaces";
import DOMBuilder from "#/components/builder";
export default class Thumbnails {
    state: ViewerStates;
    stateNames: StateClassNames;
    rootEl: HTMLElement;
    el: HTMLElement;
    wrapperEl: HTMLElement;
    thumbEls: HTMLElement[];
    constructor(builder: DOMBuilder, rootEl: HTMLElement, pages: ViewerPages, state: ViewerStates, className?: string);
    /**
     * 読み込み待ち状態のimg elementを全て読み込む
     * いわゆるlazyload処理
     */
    revealImgs(): void;
    /**
     * thumbsWrapperElのwidthを計算し、
     * 折り返しが発生しないようなら横幅の値を書き換える
     */
    cssThumbsWrapperWidthUpdate(rootEl: HTMLElement): void;
    /**
     * 各種イベントリスナーの登録
     */
    private applyEventListeners;
}