export interface MangaViewerOptions {
    pageWidth?: number;
    pageHeight?: number;
    isLTR?: boolean;
    isLightbox?: boolean;
    icons?: MangaViewerIcons;
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
    theater: IconData;
    exitTheater: IconData;
}
export interface MangaViewerUIButtons {
    close: HTMLButtonElement;
    fullscreen: HTMLButtonElement;
    theater: HTMLButtonElement;
}
export interface MangaViewerStates {
    viewerId: number;
    viewerHeightPer: number;
    pageSize: PageSize;
    pageAspect: PageSize;
    swiperRect: PageRect;
    isLTR: boolean;
}
