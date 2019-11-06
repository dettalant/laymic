import DOMBuilder from "#/components/builder";
import { PageRect } from "#/interfaces";
interface LaymicZoomStates {
    isZoomed: boolean;
    zoomMultiply: number;
    isSwiped: boolean;
    isMouseDown: boolean;
    pastX: number;
    pastY: number;
    baseRect: PageRect;
    zoomRect: PageRect;
    pinchBaseDistance: number;
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
    /**
     * タッチされた二点間の距離を返す
     * reference: https://github.com/nolimits4web/swiper/blob/master/src/components/zoom/zoom.js
     * @return 二点間の距離
     */
    getDistanceBetweenTouches(e: TouchEvent): number;
    getNormalizePosBetweenTouches(e: TouchEvent): [number, number];
    private readonly scaleProperty;
    private readonly translateProperty;
    private applyEventListeners;
    private updateMousePos;
    updateZoomRect(translateX: number, translateY: number): void;
    updateBaseRect(): void;
    private getElRect;
    /**
     * 指定された座標に応じてrootElのtranslateの値を動かす
     * @param  currentX x座標
     * @param  currentY y座標
     */
    private setRootElTranslate;
    /**
     * ズームモードに入る
     */
    enable(zoomMultiply?: number, zoomX?: number, zoomY?: number): void;
    /**
     * ズームモードから抜ける
     */
    disable(): void;
}
export {};
