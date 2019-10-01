import Swiper from "swiper";
import { MangaViewerElements, MangaViewerOptions, MangaViewerStates } from "./interfaces";
export default class MangaViewer {
    el: MangaViewerElements;
    state: MangaViewerStates;
    swiper: Swiper;
    constructor(queryStr: string, pages: string[], options?: MangaViewerOptions);
    private readonly mangaViewerId;
    private readonly mangaViewerControllerId;
    private readonly swiperElRect;
    private readonly defaultMangaViewerStates;
    private slideClickHandler;
    private windowResizeHandler;
    private cssPageWidthUpdate;
}
