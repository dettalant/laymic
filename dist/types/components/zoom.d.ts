import DOMBuilder from "#/components/builder";
import { PageRect } from "#/interfaces";
interface LaymicZoomStates {
    isZoomed: boolean;
    zoomMultiply: number;
    isSwiped: boolean;
    isMouseDown: boolean;
    pastX: number;
    pastY: number;
    zoomRect: PageRect;
}
export default class LaymicZoom {
    rootEl: HTMLElement;
    el: HTMLElement;
    builder: DOMBuilder;
    _isZoomed: boolean;
    state: LaymicZoomStates;
    constructor(builder: DOMBuilder, rootEl: HTMLElement);
    readonly defaultLaymicZoomStates: LaymicZoomStates;
    readonly isZoomed: boolean;
    private readonly scaleProperty;
    private readonly translateProperty;
    private applyEventListeners;
    private updateMousePos;
    private updateZoomRect;
    private getZoomElRect;
    /**
     * 指定された座標に応じてrootElのtranslateの値を動かす
     * @param  currentX x座標
     * @param  currentY y座標
     */
    private setRootElTranslate;
    /**
     * ズームモードに入る
     */
    enable(zoomMultiply?: number): void;
    /**
     * ズームモードから抜ける
     */
    disable(): void;
}
export {};
