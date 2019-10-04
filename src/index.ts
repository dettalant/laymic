import Swiper, { SwiperOptions } from "swiper";
import screenfull from "screenfull";
import { calcGCD, viewerCnt, sleep, readImage } from "./utils";
import { ViewerHTMLBuilder } from "./builder";
import {
  MangaViewerElements,
  MangaViewerOptions,
  MangaViewerStates,
  MangaViewerConfigs,
  PageRect
} from "./interfaces";

export default class MangaViewer {
  el: MangaViewerElements;
  conf: MangaViewerConfigs;
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

    if (!options || !options.pageHeight || !options.pageWidth) {
      // pageSizeが未設定の場合、一枚目画像の縦横幅からアスペクト比を計算する
      // TODO: しっかりとimg要素に用いられるsrc判別をまた行う
      const src = pages[0];
      readImage(src).then(img => {
        const {width: w, height: h} = img;

        this.state.pageSize = {
          w,
          h
        };

        const gcd = calcGCD(w, h);
        this.state.pageAspect = {
          w: w / gcd,
          h: h / gcd,
        }

        // もしここでエラーが起きても問題ないので握りつぶす
        this.viewUpdate();
      }).catch(e => console.error(e));
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
    // this.viewUpdate();

    const horizPageMargin = (options && options.horizPageMargin)
      ? options.horizPageMargin
      : 0;
    const vertPageMargin = (options && options.vertPageMargin)
      ? options.vertPageMargin
      : 10;

    const swiperHorizView: SwiperOptions = {
      direction: "horizontal",
      speed: 200,
      slidesPerView: 2,
      slidesPerGroup: 2,
      spaceBetween: horizPageMargin,

      on: {
        resize: () => this.viewUpdate(),
        tap: (e) => this.slideClickHandler(e),
      },

      keyboard: true,
      mousewheel: true,
      preloadImages: false,
      lazy: {
        loadPrevNext: true,
        loadPrevNextAmount: 4,
      },
    }

    const swiperVertView: SwiperOptions = {
      direction: "vertical",
      spaceBetween: vertPageMargin,
      speed: 200,
      mousewheel: true,
      keyboard: true,
      freeMode: true,
      freeModeMomentumRatio: 0.36,
      freeModeMomentumVelocityRatio: 1,
      freeModeMinimumVelocity: 0.02,
      on: {},
      preloadImages: false,
      lazy: {
        loadPrevNext: true,
        loadPrevNextAmount: 4,
      },
    }

    this.conf = {
      swiperVertView,
      swiperHorizView,
    }

    this.swiper = new Swiper(this.el.swiperEl, this.conf.swiperHorizView);

    this.el.buttons.theater.addEventListener("pointerup", () => {
      this.el.rootEl.classList.toggle("is_theater");
    });

    this.el.buttons.direction.addEventListener("pointerup", () => {
      if (!this.state.isVertView) {
        this.enableVerticalView()
      } else {
        this.disableVerticalView()
      }
    })

    this.el.buttons.fullscreen.addEventListener("pointerup", () => this.fullscreenButtonHandler());

    this.el.buttons.preference.addEventListener("pointerup", () => {
      console.log("preference button click");
    })

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
      isVertView: false,
    }
  }

  public open(isFullscreen: boolean) {
    // display:none状態の場合にそれを解除する
    if (this.el.rootEl.style.display === "none") {
      this.el.rootEl.style.display = "";
    }

    // swiper表示更新
    this.viewUpdate();

    this.showRootEl();

    // オーバーレイ下要素のスクロール停止
    this.disableBodyScroll();

    if (isFullscreen) {
      this.fullscreenButtonHandler();
    }

    if (this.swiper.activeIndex === 0) {
      this.swiper.lazy.load();
    }
  }

  public close() {
    this.hideRootEl();

    // フルスクリーン状態にあるならそれを解除
    if (document.fullscreenElement) {
      this.fullscreenButtonHandler();
    }

    // オーバーレイ下要素のスクロール再開
    this.enableBodyScroll();
  }

  private enableVerticalView() {
    this.state.isVertView = true;
    this.el.rootEl.classList.add("is_vertView");

    // 読み進めたページ数を引き継ぐ
    const conf = Object.assign(this.conf.swiperVertView, {
      initialSlide: this.swiper.activeIndex
    });

    this.swiper.destroy(true, true);
    this.swiper = new Swiper(this.el.swiperEl, conf);
  }

  private disableVerticalView() {
    this.state.isVertView = false;
    this.el.rootEl.classList.remove("is_vertView");

    // 読み進めたページ数を引き継ぐ
    const conf = Object.assign(this.conf.swiperHorizView, {
      initialSlide: this.swiper.activeIndex
    })

    this.swiper.destroy(true, true);
    this.swiper = new Swiper(this.el.swiperEl, conf);
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

  private viewUpdate() {
    this.state.swiperRect = this.swiperElRect;
    this.cssPageWidthUpdate();

    if (this.swiper) this.swiper.update();
  }

  private fullscreenButtonHandler() {
    // フルスクリーン切り替え後に呼び出される関数
    const postToggleFullscreen = () => {
      const isFullscreen = document.fullscreenElement;
      if (isFullscreen) {
        // 全画面有効時
        this.el.rootEl.classList.add("is_fullscreen");
      } else {
        // 通常時
        this.el.rootEl.classList.remove("is_fullscreen");
      }

      this.viewUpdate();
    }

    if (screenfull.isEnabled) {
      screenfull.toggle(this.el.rootEl)
        // 0.1秒ウェイトを取る
        .then(() => sleep(150))
        // フルスクリーン切り替え後処理
        .then(() => postToggleFullscreen());
    }
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
