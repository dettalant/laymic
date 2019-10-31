import DOMBuilder from "#/components/builder";
import { PageRect } from "#/interfaces";
interface LaymicZoomStates {
    isZoomed: boolean;
    zoomMultiply: number;
    isSwiped: boolean;
    isMouseDown: boolean;
    posX: number;
    posY: number;
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
    readonly scaleProperty: string;
    readonly translateProperty: string;
    updateMousePos(e: MouseEvent): void;
    updateZoomRect(): void;
    getZoomElRect(): PageRect;
    /**
     * マウス操作に応じてrootElのtranslateの値を動かす
     * TODO: まともに機能していないので動くよう直す
     */
    setRootElTranslate(eventX: number, eventY: number): void;
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
