import { MangaViewerIcons, MangaViewerUIButtons, IconData } from "./interfaces"

const SVG_NS = "http://www.w3.org/2000/svg";
const SVG_XLINK_NS = "http://www.w3.org/1999/xlink";

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

  createViewerController(id: string): [HTMLElement, MangaViewerUIButtons] {
    const ctrlEl = this.createDiv();
    ctrlEl.className = "mangaViewer_controller";
    ctrlEl.id = id;

    const ctrlTopEl = this.createDiv();
    ctrlTopEl.className = "mangaViewer_controller_top";

    const closeBtn = this.createButton();
    closeBtn.className = "mangaViewer_ui_button mangaViewer_close";
    const closeIcon = this.createSvgUseElement(this.icons.close.id, "icon_close");
    closeBtn.appendChild(closeIcon);
    ctrlTopEl.appendChild(closeBtn);

    const ctrlBottomEl = this.createDiv();
    ctrlBottomEl.className = "mangaViewer_controller_bottom";

    ctrlEl.appendChild(ctrlTopEl);
    ctrlEl.appendChild(ctrlBottomEl);

    const uiButtons: MangaViewerUIButtons = {
      close: closeBtn
    }

    return [ctrlEl, uiButtons]
  }

  private createSvgUseElement(linkId: string, className: string): SVGElement {
    const svgEl = document.createElementNS(SVG_NS, "svg");
    svgEl.setAttribute("class", `svg_icon ${className}`);
    svgEl.setAttribute("role", "img");

    const useEl = document.createElementNS(SVG_NS, "use");
    useEl.setAttribute("class", "svg_default_prop");
    useEl.setAttributeNS(SVG_XLINK_NS, "xlink:href", "#" + linkId);
    svgEl.appendChild(useEl);

    return svgEl;
  }

  createSVGIcons(): SVGElement {
    const svgCtn = document.createElementNS(SVG_NS, "svg");
    svgCtn.setAttributeNS(null, "version", "1.1");
    svgCtn.setAttribute("xmlns", SVG_NS);
    svgCtn.setAttribute("xmlns:xlink", SVG_XLINK_NS);
    svgCtn.setAttribute("class", "mangaViewer_svg_container");

    const defs = document.createElementNS(SVG_NS, "defs");

    Object.values(this.icons).forEach(icon => {
      if (!this.isIconData(icon)) {
        return;
      }

      const symbol = document.createElementNS(SVG_NS, "symbol");
      symbol.setAttribute("id", icon.id);
      symbol.setAttribute("viewBox", icon.viewBox);

      icon.pathDs.forEach(d => {
        const path = document.createElementNS(SVG_NS, "path");
        path.setAttribute("d", d);
        symbol.appendChild(path);
      })

      defs.appendChild(symbol);
    })

    svgCtn.appendChild(defs);

    // 画面上に表示させないためのスタイル定義
    svgCtn.style.height = "1px";
    svgCtn.style.width = "1px";
    svgCtn.style.position = "absolute";
    svgCtn.style.left = "-9px";

    return svgCtn;
  }

  private createDiv(): HTMLDivElement {
    return document.createElement("div");
  }

  private createButton(): HTMLButtonElement {
    const btn = document.createElement("button");
    btn.type = "button";
    return btn;
  }

  private isIconData(icon: any): icon is IconData {
    return typeof icon.id === "string"
      && typeof icon.viewBox === "string"
      && Array.isArray(icon.pathDs);
  }
}
