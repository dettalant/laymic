import DOMBuilder from "#/components/builder";
export default class LaymicZoom {
    rootEl: HTMLElement;
    el: HTMLElement;
    builder: DOMBuilder;
    _isZoomed: boolean;
    state: {
        isZoomed: boolean;
        zoomMultiply: number;
    };
    constructor(builder: DOMBuilder, rootEl: HTMLElement);
    readonly isZoomed: boolean;
    /**
     * ズームモードに入る
     */
    enable(zoomMultiply?: number): void;
    /**
     * ズームモードから抜ける
     */
    disable(): void;
}
