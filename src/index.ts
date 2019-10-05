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
  // HTMLElementまとめ
  el: MangaViewerElements;
  // swiper configまとめ
  conf: MangaViewerConfigs;
  // mangaViewer内部で用いるステートまとめ
  state: MangaViewerStates = this.defaultMangaViewerStates;
  // swiper instance
  swiper: Swiper;

  constructor(queryStr: string, pages: string[], options?: MangaViewerOptions) {
    const rootEl = document.querySelector(queryStr);

    if (!(rootEl instanceof HTMLElement)) throw new Error("rootElの取得に失敗");
    if (rootEl.parentNode) rootEl.parentNode.removeChild(rootEl);
    rootEl.style.display = "none";

    const icons = (options && options.icons) ? options.icons : undefined;
    const builder = new ViewerHTMLBuilder(icons);

    if (this.state.viewerId === 0) {
      // 一つのページにつき一度だけの処理
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
      this.setPageSizeFromImgPath(src);
    }

    rootEl.classList.add("mangaViewer_root", "is_ui_visible");
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
    this.viewUpdate();

    const horizPageMargin = (options && options.horizPageMargin)
      ? options.horizPageMargin
      : 0;

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

    const vertPageMargin = (options && options.vertPageMargin)
      ? options.vertPageMargin
      : 10;

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
      on: {
        resize: () => this.viewUpdate(),
        tap: (e) => this.slideClickHandler(e),
      },
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

  /**
   * インスタンスごとに固有のビューワーIDを返す
   * @return ビューワーID文字列
   */
  private get mangaViewerId(): string {
    return "mangaViewer" + this.state.viewerId;
  }

  /**
   * インスタンスごとに固有のビューワーコントローラーIDを返す
   * @return ビューワーコントローラーID文字列
   */
  private get mangaViewerControllerId(): string {
    return "mangaViewerController" + this.state.viewerId;
  }

  /**
   * swiper-containerの要素サイズを返す
   * @return 要素サイズオブジェクト
   */
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

  /**
   * 初期状態のmangaViewerステートオブジェクトを返す
   * @return this.stateの初期値
   */
  private get defaultMangaViewerStates(): MangaViewerStates {
    const {
      innerHeight: ih,
      innerWidth: iw,
    } = window;

    return {
      viewerPadding: 10,
      // デフォルト値としてウィンドウ幅を指定
      swiperRect: {
        l: 0,
        t: 0,
        w: iw,
        h: ih,
      },
      // インスタンスごとに固有のid数字
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

  /**
   * オーバーレイ表示を展開させる
   * @param  isFullscreen trueならば同時に全画面化させる
   */
  public open(isFullscreen: boolean) {
    // display:none状態の場合にそれを解除する
    // 主にページ読み込み後一度目の展開でだけ動く部分
    if (this.el.rootEl.style.display === "none") {
      this.el.rootEl.style.display = "";
    }

    // swiper表示更新
    this.viewUpdate();

    // オーバーレイ要素の表示
    this.showRootEl();

    // オーバーレイ下要素のスクロール停止
    this.disableBodyScroll();

    // 引数がtrueならば全画面化
    if (isFullscreen) {
      this.fullscreenButtonHandler();
    }

    // swiperのfreeModeには
    // 「lazyloadとfreeModeを併用した際初期画像の読み込みが行われない」
    // 不具合があるようなので手動で画像読み込み
    if (this.swiper.activeIndex === 0) {
      this.swiper.lazy.load();
    }
  }

  /**
   * オーバーレイ表示を閉じる
   */
  public close() {
    this.hideRootEl();

    // フルスクリーン状態にあるならそれを解除
    if (document.fullscreenElement) {
      this.fullscreenButtonHandler();
    }

    // オーバーレイ下要素のスクロール再開
    this.enableBodyScroll();
  }

  /**
   * 縦読み表示へと切り替える
   */
  private enableVerticalView() {
    this.state.isVertView = true;
    this.el.rootEl.classList.add("is_vertView");

    // 読み進めたページ数を引き継ぐ
    const conf = Object.assign(this.conf.swiperVertView, {
      initialSlide: this.swiper.activeIndex
    });

    // swiperインスタンスを一旦破棄してからre-init
    this.swiper.destroy(true, true);
    this.swiper = new Swiper(this.el.swiperEl, conf);

    this.viewUpdate();
  }

  /**
   * 横読み表示へと切り替える
   */
  private disableVerticalView() {
    this.state.isVertView = false;
    this.el.rootEl.classList.remove("is_vertView");

    // 読み進めたページ数を引き継ぐ
    const conf = Object.assign(this.conf.swiperHorizView, {
      initialSlide: this.swiper.activeIndex
    })

    // swiperインスタンスを一旦破棄してからre-init
    this.swiper.destroy(true, true);
    this.swiper = new Swiper(this.el.swiperEl, conf);

    this.viewUpdate();
  }

  /**
   * mangaViewer画面をクリックした際のイベントハンドラ
   * 横読み時: 左側クリックで進む、右側クリックで戻る
   * 縦読み時: 下側クリックで進む、上側クリックで戻る
   *
   * TODO: LTR設定に対応させる必要あり
   *
   * @param  e pointer-up event
   */
  private slideClickHandler(e: PointerEvent) {
    const {
      left: l,
      top: t,
      width: w,
      height: h,
    } = this.el.swiperEl.getBoundingClientRect()

    const [x, y] = [e.pageX - l, e.pageY - t]

    let [isNextClick, isPrevClick] = [false, false];

    if (this.state.isVertView) {
      isNextClick = y > h * 0.66;
      isPrevClick = y < h * 0.33;
    } else {
      isNextClick = x < w * 0.33;
      isPrevClick = x > w * 0.66;
    }

    const uiVisibleClass = "is_ui_visible";

    if (isNextClick && !this.swiper.isEnd) {
      // 進めるページがある状態で進む側をクリックした際の処理
      this.swiper.slideNext();
      this.el.rootEl.classList.remove(uiVisibleClass);
    } else if (isPrevClick && !this.swiper.isBeginning) {
      // 戻れるページがある状態で戻る側をクリックした際の処理

      // freeModeでslidePrev()を使うとなんかバグがあるっぽいので
      // 手動計算して動かす
      const idx = (this.swiper.activeIndex !== 0)
        ? this.swiper.activeIndex - 1
        : 0;
      this.swiper.slideTo(idx);

      this.el.rootEl.classList.remove(uiVisibleClass);
    } else {
      this.el.rootEl.classList.toggle(uiVisibleClass);
    }
  }

  /**
   * mangaViewer表示を更新する
   * 主にswiperの表示を更新するための関数
   */
  private viewUpdate() {
    this.state.swiperRect = this.swiperElRect;
    this.cssPageWidthUpdate();

    if (this.swiper) this.swiper.update();
  }

  /**
   * 全画面化ボタンのイベントハンドラ
   *
   * 非全画面状態ならば全画面化させて、
   * 全画面状態であるならそれを解除する
   */
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
      this.swiper.slideTo(this.swiper.activeIndex);

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

  /**
   * css変数として各ページ最大サイズを再登録する
   * cssPageWidthUpdateという関数名だけど
   * pageHeightの値も更新するのはこれいかに
   */
  private cssPageWidthUpdate() {
    const {w: aw, h: ah} = this.state.pageAspect;
    const {offsetWidth: ow, offsetHeight: oh} = this.el.rootEl;
    const paddingNum = this.state.viewerPadding * 2;

    let {w: pageWidth, h: pageHeight} = this.state.pageSize;

    if (!this.state.isVertView && ow < pageWidth * 2
      || ow > pageWidth && oh < pageHeight)
    {
      // 横読み時のサイズ計算
      const h = oh - paddingNum;
      pageWidth = Math.round(h * aw / ah);
      pageHeight = Math.round(pageWidth * ah / aw);
    } else if (oh < pageHeight) {
      // 縦読み時のサイズ計算
      const w = ow - paddingNum;
      pageHeight = Math.round(w * ah / aw);
      pageWidth = Math.round(pageHeight * aw / ah);
    }

    this.el.rootEl.style.setProperty("--page-width", pageWidth + "px");
    this.el.rootEl.style.setProperty("--page-height", pageHeight + "px");
  }

  /**
   * mangaViewerと紐付いたrootElを表示する
   * @return [description]
   */
  private showRootEl() {
    this.el.rootEl.style.opacity = "1";
    this.el.rootEl.style.visibility = "visible";
  }

  /**
   * mangaViewerと紐付いたrootElを非表示にする
   */
  private hideRootEl() {
    this.el.rootEl.style.opacity = "0";
    this.el.rootEl.style.visibility = "hidden";
  }

  /**
   * body要素のスクロールを停止させる
   */
  private disableBodyScroll() {
    document.documentElement.style.overflowY = "hidden";
    document.body.style.overflowY = "hidden";
  }

  /**
   * body要素のスクロールを再開させる
   */
  private enableBodyScroll() {
    document.documentElement.style.overflowY = "";
    document.body.style.overflowY = "";
  }

  /**
   * 入力したpathの画像からpageSizeを設定する
   * @param src 画像path
   */
  private setPageSizeFromImgPath(src: string) {
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
}
