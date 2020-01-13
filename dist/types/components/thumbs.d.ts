import { ViewerPages } from "../interfaces/index";
import DOMBuilder from "./builder";
import LaymicStates from "./states";
export default class LaymicThumbnails {
    private _isActive;
    readonly state: LaymicStates;
    readonly builder: DOMBuilder;
    readonly rootEl: HTMLElement;
    readonly el: HTMLElement;
    readonly wrapperEl: HTMLElement;
    readonly thumbEls: Element[];
    readonly thumbButtons: HTMLButtonElement[];
    constructor(builder: DOMBuilder, rootEl: HTMLElement, pages: ViewerPages, thumbPages: string[], state: LaymicStates);
    /**
     * サムネイル画面表示中か否かのboolを返す
     * @return サムネイル画面表示中ならばtrue
     */
    readonly isActive: boolean;
    /**
     * thumbsWrapperElのwidthを計算し、
     * 折り返しが発生しないようなら横幅の値を書き換える
     */
    cssThumbsWrapperWidthUpdate(rootEl: HTMLElement): void;
    /**
     * サムネイル画面を表示する
     */
    show(): void;
    /**
     * サムネイル画面を閉じる
     */
    hide(): void;
    /**
     * 読み込み待ち状態のimg elementを全て読み込む
     * いわゆるlazyload処理
     * @return  全画像読み込み完了を受け取れるPromiseオブジェクト
     */
    private revealImgs;
    /**
     * 各種イベントリスナーの登録
     */
    private applyEventListeners;
}
