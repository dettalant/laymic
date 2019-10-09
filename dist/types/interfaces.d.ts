export declare type MangaViewerPages = (string | HTMLElement)[];
export interface MangaViewerOptions {
    pageWidth?: number;
    pageHeight?: number;
    isLTR?: boolean;
    isDisableThumbs?: boolean;
    icons?: MangaViewerIcons;
    vertPageMargin?: number;
    horizPageMargin?: number;
    isFirstSlideEmpty?: boolean;
}
export interface PageSize {
    w: number;
    h: number;
}
export interface PageRect extends PageSize {
    l: number;
    t: number;
}
export interface MangaViewerElements {
    rootEl: HTMLElement;
    swiperEl: HTMLElement;
    buttons: MangaViewerUIButtons;
    controllerEl: HTMLElement;
}
export interface IconData {
    id: string;
    viewBox: string;
    pathDs: string[];
}
export interface MangaViewerIcons {
    close: IconData;
    fullscreen: IconData;
    exitFullscreen: IconData;
    preference: IconData;
    showThumbs: IconData;
    vertView: IconData;
    horizView: IconData;
}
export interface MangaViewerUIButtons {
    close: HTMLButtonElement;
    fullscreen: HTMLButtonElement;
    preference: HTMLButtonElement;
    thumbs: HTMLButtonElement;
    direction: HTMLButtonElement;
}
export interface MangaViewerStates {
    viewerId: number;
    viewerPadding: number;
    pageSize: PageSize;
    pageAspect: PageSize;
    swiperRect: PageRect;
    isLTR: boolean;
    isVertView: boolean;
    isFirstSlideEmpty: boolean;
    horizPageMargin: number;
    vertPageMargin: number;
    thumbItemWidth: number;
    thumbItemGap: number;
    thumbsWrapperPadding: number;
    isTouchEvent: boolean;
    isPointerEvent: boolean;
}
