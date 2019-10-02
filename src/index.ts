import Swiper from "swiper";
import { calcGCD, viewerCnt } from "./utils";
import { ViewerHTMLBuilder } from "./builder";
import {
  MangaViewerElements,
  MangaViewerOptions,
  MangaViewerStates,
  PageRect
} from "./interfaces";

export default class MangaViewer {
  el: MangaViewerElements;
  state: MangaViewerStates = this.defaultMangaViewerStates;
  swiper: Swiper;

  constructor(queryStr: string, pages: string[], options?: MangaViewerOptions) {
    const rootEl = document.querySelector(queryStr);

    if (!(rootEl instanceof HTMLElement)) throw new Error("rootElの取得に失敗");
    if (rootEl.parentNode) rootEl.parentNode.removeChild(rootEl);
    rootEl.style.display = "none";

    const builder = new ViewerHTMLBuilder(this.state.viewerId);
    if (this.state.viewerId === 0) {
      // ページにつき一度だけの処理
      const svgCtn = builder.createSVGIcons();
      document.body.appendChild(svgCtn);
    }

    if (options) {
      const [pw, ph] = (options.pageWidth && options.pageHeight)
        ? [options.pageWidth, options.pageHeight]
        : [720, 1024];
      const gcd = calcGCD(pw, ph);

      this.state.pageSize = {
        w: pw,
        h: ph
      };
      this.state.pageAspect = {
        w: pw / gcd,
        h: ph / gcd,
      }
      this.state.isLTR = (options.isLTR) ? options.isLTR : false;
    }

    rootEl.classList.add("mangaViewer_root");
    const [controllerEl, uiButtons] = builder.createViewerController(this.mangaViewerControllerId);
    const swiperEl = builder.createSwiperContainer(this.mangaViewerId, pages, this.state.isLTR);
    rootEl.appendChild(controllerEl);
    rootEl.appendChild(swiperEl);

    this.el = {
      rootEl,
      swiperEl,
      controllerEl,
      buttons: uiButtons,
    }

    this.close();

    // 一旦DOMから外していたroot要素を再度放り込む
    document.body.appendChild(this.el.rootEl);

    // サイズ設定の初期化
    this.windowResizeHandler();
    this.swiper = new Swiper(this.el.swiperEl, {
      direction: "horizontal",
      loop: false,
      effect: "slide",
      speed: 200,
      slidesPerView: 2,
      slidesPerGroup: 2,
      centeredSlides: false,

      on: {
        resize: () => this.windowResizeHandler(),
        tap: (e) => this.slideClickHandler(e),
      },
      keyboard: true,
      mousewheel: true,
      lazy: {
        loadPrevNext: true,
        loadPrevNextAmount: 4,
      },
    });

    this.el.buttons.close.addEventListener("pointerup", () => {
      this.close();
    });
  }

  private get mangaViewerId(): string {
    return "mangaViewer" + this.state.viewerId;
  }

  private get mangaViewerControllerId(): string {
    return "mangaViewerController" + this.state.viewerId;
  }

  public open() {
    // display:none状態の場合にそれを解除する
    if (this.el.rootEl.style.display === "none") {
      this.el.rootEl.style.display = "";
    }

    // swiper表示更新
    this.windowResizeHandler();
    this.swiper.update();

    this.showRootEl();

    // オーバーレイ下要素のスクロール停止
    this.disableBodyScroll();
  }

  public close() {
    this.hideRootEl();

    // オーバーレイ下要素のスクロール再開
    this.enableBodyScroll();
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
    const {
      innerHeight: ih,
      innerWidth: iw,
    } = window;

    return {
      viewerHeightPer: 0.9,
      // デフォルト値としてウィンドウ幅を指定
      swiperRect: {
        l: 0,
        t: 0,
        w: iw,
        h: ih,
      },
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

  private windowResizeHandler() {
    // swiperElRectの更新
    this.state.swiperRect = this.swiperElRect;
    this.cssPageWidthUpdate()
  }

  private cssPageWidthUpdate() {
    const {w: aw, h: ah} = this.state.pageAspect;
    const h = this.el.rootEl.offsetHeight * this.state.viewerHeightPer;
    const pageWidth = Math.round(h * aw / ah);
    const pageHeight = Math.round(pageWidth * ah / aw);
    this.el.rootEl.style.setProperty("--page-width", pageWidth + "px");
    this.el.rootEl.style.setProperty("--page-height", pageHeight + "px");
  }

  private showRootEl() {
    this.el.rootEl.style.opacity = "1";
    this.el.rootEl.style.visibility = "visible";
  }

  private hideRootEl() {
    this.el.rootEl.style.opacity = "0";
    this.el.rootEl.style.visibility = "hidden";
  }

  private disableBodyScroll() {
    document.documentElement.style.overflowY = "hidden";
    document.body.style.overflowY = "hidden";
  }

  private enableBodyScroll() {
    document.documentElement.style.overflowY = "";
    document.body.style.overflowY = "";
  }
}
