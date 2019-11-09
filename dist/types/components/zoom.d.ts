import DOMBuilder from "#/components/builder";
import { PageRect } from "#/interfaces";
interface LaymicZoomStates {
    isZoomed: boolean;
    zoomMultiply: number;
    minRatio: number;
    maxRatio: number;
    isSwiped: boolean;
    isMouseDown: boolean;
    pastX: number;
    pastY: number;
    zoomRect: PageRect;
    pastDistance: number;
}
export default class LaymicZoom {
    rootEl: HTMLElement;
    zoomWrapper: HTMLElement;
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
    /**
     * タッチされた二点の座標の中心点から、
     * 正規化された拡大時中心点を返す
     * @param  e TouchEvent
     * @return   [zoomX, zoomY]
     */
    getNormalizedPosBetweenTouches(e: TouchEvent): [number, number];
    /**
     * TODO: この処理がまだガタガタ
     * @return [description]
     */
    getNormalizedCurrentCenter(): [number, number];
    private readonly scaleProperty;
    private readonly translateProperty;
    private touchStartHandler;
    private touchMoveHandler;
    updatePastDistance(e: TouchEvent): void;
    pinchZoom(e: TouchEvent): void;
    private applyEventListeners;
    private updateMousePos;
    updateZoomRect(translateX?: number, translateY?: number): void;
    private getElRect;
    /**
     * 指定された座標に応じてzoomWrapperのtranslateの値を動かす
     * @param  currentX x座標
     * @param  currentY y座標
     */
    private setTranslate;
    /**
     * ズームモードに入る
     */
    enable(zoomMultiply?: number, zoomX?: number, zoomY?: number): void;
    enableZoom(zoomMultiply?: number, zoomX?: number, zoomY?: number): void;
    enableController(): void;
    /**
     * ズームモードから抜ける
     */
    disable(): void;
}
export {};
