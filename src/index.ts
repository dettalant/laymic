import Swiper from "swiper";
import { calcGCD, viewerCnt } from "./utils";
import {
  MangaViewerElements,
  MangaViewerOptions,
  MangaViewerStates,
  PageRect
} from "./interfaces";

export default class MangaViewer {
  el: MangaViewerElements;
  state: MangaViewerStates;
  swiper: Swiper;

  constructor(queryStr: string, pages: string[], options?: MangaViewerOptions) {
    const rootEl = document.querySelector(queryStr);

    if (!(rootEl instanceof HTMLElement)) throw new Error("rootElの取得に失敗");

    rootEl.classList.add("mangaViewer_root");

    const controllerEl = document.createElement("div");
    controllerEl.className = "swiper-controller";

    const swiperEl = document.createElement("div");
    swiperEl.className = "swiper-container";

    const wrapperEl = document.createElement("div");
    wrapperEl.className = "swiper-wrapper";
    for (let p of pages) {
      const divEl = document.createElement("div");
      divEl.className = "swiper-slide";


      const imgEl = new Image();
      imgEl.dataset.src = p;
      imgEl.className = "swiper-lazy";

      divEl.appendChild(imgEl);
      wrapperEl.appendChild(divEl);
    }

    swiperEl.appendChild(wrapperEl);
    rootEl.appendChild(controllerEl);
    rootEl.appendChild(swiperEl);

    this.el = {
      rootEl,
      swiperEl,
      controllerEl
    }

    if (options) {
      const [pw, ph] = (options.pageWidth && options.pageHeight)
        ? [options.pageWidth, options.pageHeight]
        : [720, 1024];
      const gcd = calcGCD(pw, ph);
      const isLTR = (options.isLTR) ? options.isLTR : false;

      this.state = {
        multiplyNum: 0.9,
        swiperRect: this.swiperElRect,
        viewerId: viewerCnt(),
        pageSize: {
          w: pw,
          h: ph,
        },
        pageAspect: {
          w: pw / gcd,
          h: ph / gcd,
        },
        isLTR,
      }
    } else {
      this.state = this.defaultMangaViewerStates;
    }

    if (this.state.viewerId === 0) {
      // ページにつき一度だけの処理
      this.addSvgIcons();
    }

    this.el.swiperEl.id = this.mangaViewerId;
    this.el.swiperEl.dir = (this.state.isLTR) ? "" : "rtl";
    this.el.controllerEl.id = this.mangaViewerControllerId;

    this.cssPageWidthUpdate();
    this.swiper = new Swiper("#" + this.mangaViewerId, {
      direction: "horizontal",
      loop: false,
      effect: "slide",
      speed: 200,
      slidesPerView: 2,
      slidesPerGroup: 2,
      centeredSlides: false,

      on: {
        resize: () => {
          // swiperElRectの更新
          this.state.swiperRect = this.swiperElRect;
          this.cssPageWidthUpdate()
        },
        tap: (e) => this.slideClickHandler(e),
      },
      keyboard: true,
      mousewheel: true,
      lazy: {
        loadPrevNext: true,
        loadPrevNextAmount: 4,
      },
    });
  }

  private addSvgIcons() {
    const ns = "http://www.w3.org/2000/svg";
    const linkNs = "http://www.w3.org/1999/xlink";
    const icons = [
      {
        id: "mangaViewer_svgClose",
        viewBox: "0 0 24 24",
        pathDs: [
          "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
        ]
      }
    ]

    const svgCtn = document.createElementNS(ns, "svg");
    svgCtn.setAttributeNS(null, "version", "1.1");
    svgCtn.setAttribute("xmlns", ns);
    svgCtn.setAttribute("xmlns:xlink", linkNs);
    svgCtn.setAttribute("class", "mangaViewer_svg_container");

    const defs = document.createElementNS(ns, "defs");

    icons.forEach(icon => {
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
    document.body.appendChild(svgCtn);
  }

  private slideClickHandler(e: PointerEvent) {
    const {
      left: l,
      // top: t,
      width: w,
      // height: h,
    } = this.el.swiperEl.getBoundingClientRect()

    const x = e.pageX - l;

    const [isLeftAreaClick, isRightAreaClick] = [
      x < w * 0.33,
      x > w * 0.66,
    ]

    if (isLeftAreaClick) {
      this.swiper.slideNext();
    } else if (isRightAreaClick) {
      this.swiper.slidePrev();
    } else {
      console.log("中側クリック");
    }

  }

  private cssPageWidthUpdate() {
    const {w: aw, h: ah} = this.state.pageAspect;
    const h = this.el.rootEl.offsetHeight * this.state.multiplyNum;
    const pageWidth = Math.round(h * aw / ah);
    const pageHeight = Math.round(pageWidth * ah / aw);
    this.el.rootEl.style.setProperty("--page-width", pageWidth + "px");
    this.el.rootEl.style.setProperty("--page-height", pageHeight + "px");
  }

  private get mangaViewerId(): string {
    return "mangaViewer" + this.state.viewerId;
  }

  private get mangaViewerControllerId(): string {
    return "mangaViewerController" + this.state.viewerId;
  }

  private get swiperElRect(): PageRect {
    const {
      height: h,
      width: w,
      left: l,
      top: t,
    } = this.el.swiperEl.getBoundingClientRect();
    return {
      w,
      h,
      l,
      t
    }
  }

  private get defaultMangaViewerStates(): MangaViewerStates {
    return {
      multiplyNum: 0.9,
      swiperRect: this.swiperElRect,
      viewerId: viewerCnt(),
      pageSize: {
        w: 720,
        h: 1024
      },
      pageAspect: {
        w: 45,
        h: 64
      },
      isLTR: false,
    }
  }
}
