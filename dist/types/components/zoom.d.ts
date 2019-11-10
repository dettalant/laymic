import DOMBuilder from "#/components/builder";
import { PageRect } from "#/interfaces";
interface LaymicZoomStates {
    isZoomed: boolean;
    zoomRatio: number;
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
    readonly zoomRatio: number;
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
     * @return   [betweenX, betweenY]
     */
    getNormalizedPosBetweenTouches(e: TouchEvent): [number, number];
    /**
     * 画面中央座標を正規化して返す
     * @return [centeringX, centeringY]
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
    enable(zoomRatio?: number, zoomX?: number, zoomY?: number): void;
    enableZoom(zoomRatio?: number, zoomX?: number, zoomY?: number): void;
    enableController(): void;
    /**
     * ズームモードから抜ける
     */
    disable(): void;
}
export {};
