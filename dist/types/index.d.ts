import Swiper from "swiper";
import { MangaViewerElements, MangaViewerOptions, MangaViewerStates, MangaViewerConfigs } from "./interfaces";
export default class MangaViewer {
    el: MangaViewerElements;
    conf: MangaViewerConfigs;
    state: MangaViewerStates;
    swiper: Swiper;
    constructor(queryStr: string, pages: string[], options?: MangaViewerOptions);
    private readonly mangaViewerId;
    private readonly mangaViewerControllerId;
    private readonly swiperElRect;
    private readonly defaultMangaViewerStates;
    open(isFullscreen: boolean): void;
    close(): void;
    private enableVerticalView;
    private disableVerticalView;
    private slideClickHandler;
    private viewUpdate;
    private fullscreenButtonHandler;
    private cssPageWidthUpdate;
    private showRootEl;
    private hideRootEl;
    private disableBodyScroll;
    private enableBodyScroll;
    private setPageSizeFromImgPath;
}
