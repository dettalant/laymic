import { MangaViewerIcons, MangaViewerUIButtons } from "./interfaces";
export declare class ViewerHTMLBuilder {
    private readonly viewerId;
    private icons;
    private readonly uiButtonClass;
    constructor(viewerId: number, icons?: MangaViewerIcons);
    readonly mangaViewerId: string;
    readonly mangaViewerControllerId: string;
    private readonly defaultMangaViewerIcons;
    createSwiperContainer(id: string, pages: string[], isLTR: boolean): HTMLElement;
    createViewerController(id: string): [HTMLElement, MangaViewerUIButtons];
    private createSvgUseElement;
    createSVGIcons(): SVGElement;
    private createDiv;
    private createButton;
    private isIconData;
}
