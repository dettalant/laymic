export declare type ViewerPages = (string | Element)[];
export declare type BarWidth = "auto" | "none" | "tint" | "medium" | "bold";
export declare type UIVisibility = "auto" | "visible" | "hidden";
export interface LaymicOptions {
    pageWidth?: number;
    pageHeight?: number;
    isLTR?: boolean;
    isVisiblePagination?: boolean;
    isFirstSlideEmpty?: boolean;
    icons?: ViewerIcons;
    vertPageMargin?: number;
    horizPageMargin?: number;
    viewerPadding?: number;
    progressBarWidth?: BarWidth;
    isInstantOpen?: boolean;
    viewerDirection?: "vertical" | "horizontal";
}
export interface PageSize {
    w: number;
    h: number;
}
export interface PageRect extends PageSize {
    l: number;
    t: number;
}
export interface ViewerElements {
    rootEl: HTMLElement;
    swiperEl: HTMLElement;
    buttons: ViewerUIButtons;
    controllerEl: HTMLElement;
}
export interface IconData {
    id: string;
    className: string;
    viewBox: string;
    pathDs: string[];
}
export interface ViewerIcons {
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
export interface ViewerUIButtons {
    close: HTMLButtonElement;
    fullscreen: HTMLButtonElement;
    preference: HTMLButtonElement;
    thumbs: HTMLButtonElement;
    direction: HTMLButtonElement;
    nextPage: HTMLButtonElement;
    prevPage: HTMLButtonElement;
}
export interface ViewerStates {
    viewerId: number;
    viewerPadding: number;
    pageSize: PageSize;
    pageAspect: PageSize;
    thresholdWidth: number;
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
    isInstantOpen: boolean;
}
export interface PreferenceData {
    isAutoFullscreen: boolean;
    isEnableTapSlidePage: boolean;
    progressBarWidth: BarWidth;
    paginationVisibility: UIVisibility;
}
export declare type PreferenceButtons = {
    [P in keyof PreferenceData]: HTMLButtonElement;
};
export interface StateClassNames {
    active: string;
    hidden: string;
    singleSlide: string;
    showPreference: string;
    showThumbs: string;
    fullscreen: string;
    visibleUI: string;
    visiblePagination: string;
    vertView: string;
    ltr: string;
}
