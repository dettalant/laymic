import { MangaViewerIcons, IconData } from "./interfaces"

export class ViewerHTMLBuilder {
  private viewerId: number;
  private icons: MangaViewerIcons = this.defaultMangaViewerIcons;
  constructor(viewerId: number, icons?: MangaViewerIcons) {
    this.viewerId = viewerId;
    if (icons) this.icons = Object.assign(this.icons, icons);
  }
  get mangaViewerId(): string {
    return "mangaViewer" + this.viewerId;
  }

  get mangaViewerControllerId(): string {
    return "mangaViewerController" + this.viewerId;
  }

  private get defaultMangaViewerIcons(): MangaViewerIcons {
    // material.io: close
    const close = {
      id: "mangaViewer_svgClose",
      viewBox: "0 0 24 24",
      pathDs: [
        "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
      ]
    };

    return {
      close
    }
  }

  createSwiperContainer(id: string, pages: string[], isLTR: boolean): HTMLElement {
    const swiperEl = this.createDiv();
    swiperEl.className = "swiper-container";
    swiperEl.id = id;
    swiperEl.dir = (isLTR) ? "" : "rtl";

    const wrapperEl = this.createDiv();
    wrapperEl.className = "swiper-wrapper";

    for (let p of pages) {
      const divEl = this.createDiv();
      divEl.className = "swiper-slide";

      const imgEl = new Image();
      imgEl.dataset.src = p;
      imgEl.className = "swiper-lazy";

      divEl.appendChild(imgEl);
      wrapperEl.appendChild(divEl);
    }

    swiperEl.appendChild(wrapperEl);
    return swiperEl;
  }

  createViewerController(id: string): HTMLElement {
    const ctrlEl = this.createDiv();
    ctrlEl.className = "mangaViewer_controller";
    ctrlEl.id = id;

    return ctrlEl
  }

  createSVGIcons(): SVGElement {
    const ns = "http://www.w3.org/2000/svg";
    const linkNs = "http://www.w3.org/1999/xlink";

    const svgCtn = document.createElementNS(ns, "svg");
    svgCtn.setAttributeNS(null, "version", "1.1");
    svgCtn.setAttribute("xmlns", ns);
    svgCtn.setAttribute("xmlns:xlink", linkNs);
    svgCtn.setAttribute("class", "mangaViewer_svg_container");

    const defs = document.createElementNS(ns, "defs");

    Object.values(this.icons).forEach(icon => {
      if (!this.isIconData(icon)) {
        return;
      }

      const symbol = document.createElementNS(ns, "symbol");
      symbol.setAttribute("id", icon.id);
      symbol.setAttribute("viewBox", icon.viewBox);

      icon.pathDs.forEach(d => {
        const path = document.createElementNS(ns, "path");
        path.setAttribute("d", d);
        symbol.appendChild(path);
      })

      defs.appendChild(symbol);
    })

    svgCtn.appendChild(defs);
    return svgCtn;
  }

  private createDiv(): HTMLDivElement {
    return document.createElement("div");
  }

  private isIconData(icon: any): icon is IconData {
    return typeof icon.id === "string"
      && typeof icon.viewBox === "string"
      && Array.isArray(icon.pathDs);
  }
}
