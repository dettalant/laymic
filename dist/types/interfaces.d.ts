export declare type ViewerPages = (string | Element)[];
export declare type BarWidth = "auto" | "none" | "tint" | "medium" | "bold";
export declare type UIVisibility = "auto" | "visible" | "hidden";
export interface LaymicOptions {
    pageWidth?: number;
    pageHeight?: number;
    isLTR?: boolean;
    isVisiblePagination?: boolean;
    isFirstSlideEmpty?: boolean;
    icons?: Partial<ViewerIcons>;
    classNames?: Partial<LaymicClassNames>;
    stateNames?: Partial<LaymicStateClassNames>;
    vertPageMargin?: number;
    horizPageMargin?: number;
    viewerPadding?: number;
    progressBarWidth?: BarWidth;
    isInstantOpen?: boolean;
    viewerDirection?: "vertical" | "horizontal";
    viewerId?: string;
}
export interface LaymicApplicatorOptions {
    templateSelector: string;
    openerSelector: string;
    defaultViewerId: string;
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
    showHelp: IconData;
    zoomIn: IconData;
}
export interface ViewerUIButtons {
    help: HTMLButtonElement;
    close: HTMLButtonElement;
    fullscreen: HTMLButtonElement;
    preference: HTMLButtonElement;
    thumbs: HTMLButtonElement;
    direction: HTMLButtonElement;
    nextPage: HTMLButtonElement;
    prevPage: HTMLButtonElement;
    zoom: HTMLButtonElement;
}
export interface ViewerStates {
    viewerId: string;
    viewerIdx: number;
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
    thumbItemHeight: number;
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
export declare type PreferenceButtons = Record<keyof PreferenceData, HTMLButtonElement>;
export interface LaymicStateClassNames {
    active: string;
    hidden: string;
    singleSlide: string;
    showPreference: string;
    showThumbs: string;
    showHelp: string;
    fullscreen: string;
    unsupportedFullscreen: string;
    visibleUI: string;
    visiblePagination: string;
    vertView: string;
    ltr: string;
    mobile: string;
    zoomed: string;
}
export declare type LaymicUIButtonClassNames = Record<keyof ViewerUIButtons, string>;
export interface LaymicSVGClassNames {
    container: string;
    icon: string;
    defaultProp: string;
}
export interface LaymicControllerClassNames {
    controller: string;
    controllerTop: string;
    controllerBottom: string;
    progressbar: string;
}
export interface LaymicCheckboxClassNames {
    container: string;
    label: string;
    iconWrapper: string;
}
export interface LaymicSelectClassNames {
    container: string;
    label: string;
    wrapper: string;
    item: string;
}
export interface LaymicThumbsClassNames {
    container: string;
    wrapper: string;
    item: string;
    imgThumb: string;
    slideThumb: string;
    lazyload: string;
    lazyloading: string;
    lazyloaded: string;
}
export interface LaymicPreferenceClassNames {
    container: string;
    wrapper: string;
    button: string;
    paginationVisibility: string;
    isAutoFullscreen: string;
}
export interface LaymicHelpClassNames {
    container: string;
    wrapper: string;
    vertImg: string;
    horizImg: string;
}
export interface LaymicClassNames {
    root: string;
    slider: string;
    emptySlide: string;
    uiButton: string;
    pagination: string;
    controller: LaymicControllerClassNames;
    buttons: LaymicUIButtonClassNames;
    svg: LaymicSVGClassNames;
    checkbox: LaymicCheckboxClassNames;
    select: LaymicSelectClassNames;
    thumbs: LaymicThumbsClassNames;
    preference: LaymicPreferenceClassNames;
    help: LaymicHelpClassNames;
}
