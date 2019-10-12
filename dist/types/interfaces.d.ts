export declare type MangaViewerPages = (string | HTMLElement)[];
export interface MangaViewerOptions {
    pageWidth?: number;
    pageHeight?: number;
    isLTR?: boolean;
    isDisableThumbs?: boolean;
    isFirstSlideEmpty?: boolean;
    icons?: MangaViewerIcons;
    vertPageMargin?: number;
    horizPageMargin?: number;
    viewerPadding?: number;
    progressBarWidth?: number;
    viewerDirection?: "vertical" | "horizontal";
    isDisableProgressBar?: boolean;
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
    className: string;
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
    checkboxOuter: IconData;
    checkboxInner: IconData;
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
    progressBarWidth: number;
    thumbItemWidth: number;
    thumbItemGap: number;
    thumbsWrapperPadding: number;
    isMobile: boolean;
}
export declare type UIVisibility = "auto" | "visible" | "hidden";
export interface PreferenceData {
    isAutoFullscreen: boolean;
    isEnableTapSlidePage: boolean;
    progressBarVisibility: UIVisibility;
}
export declare type PreferenceButtons = {
    [P in keyof PreferenceData]: HTMLButtonElement;
};
export interface StateClassNames {
    active: string;
    showPreference: string;
    showThumbs: string;
    fullscreen: string;
    visibleUI: string;
    vertView: string;
    ltr: string;
}
