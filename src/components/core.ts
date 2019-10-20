import { SwiperOptions } from "swiper";
import { Swiper, Keyboard, Pagination, Lazy } from "swiper/js/swiper.esm";
import screenfull from "screenfull";
import {
  calcGCD,
  viewerCnt,
  sleep,
  readImage,
  isExistTouchEvent,
  rafThrottle,
} from "#/utils";
import DOMBuilder from "#/components/builder";
import Preference from "#/components/preference";
import Thumbnails from "#/components/thumbs";
import {
  ViewerPages,
  ViewerElements,
  LaymicOptions,
  ViewerStates,
  PageRect,
  StateClassNames,
  BarWidth
} from "#/interfaces";

Swiper.use([Keyboard, Pagination, Lazy]);

export default class Laymic {
  // HTMLElementまとめ
  el: ViewerElements;
  // mangaViewer内部で用いるステートまとめ
  state: ViewerStates = this.defaultMangaViewerStates;
  initOptions: LaymicOptions;
  // ステート変化に用いるクラス名まとめ
  stateNames: StateClassNames;
  preference: Preference;
  thumbs: Thumbnails;
  // swiper instance
  swiper: Swiper;

  constructor(pages: ViewerPages, options: LaymicOptions = {}) {
    const builder = new DOMBuilder(options.icons);
    const rootEl = builder.createDiv();
    this.stateNames = builder.stateNames;

    if (this.state.viewerIdx === 0) {
      // 一つのページにつき一度だけの処理
      const svgCtn = builder.createSVGIcons();
      document.body.appendChild(svgCtn);
    }

    // const parseHtmlElement = (queryStr: string): ViewerPages => {
    //   const baseEl = document.querySelector(queryStr);
    //   if (!baseEl) throw new Error("pages引数のquery stringが不正");
    //
    //   const result = Array.from(baseEl.children).map(el => (el instanceof HTMLImageElement) ? el.dataset.src || el.src : el);
    //   return result;
    // }
    //
    // if (typeof pages === "string") {
    //   pages = parseHtmlElement(pages);
    // }

    if (options.pageWidth && options.pageHeight) {
      const [pw, ph] = [options.pageWidth, options.pageHeight]
      this.setPageSize(pw, ph);
    } else {
      // pageSizeが未設定の場合、一枚目画像の縦横幅からアスペクト比を計算する
      const getBeginningSrc = (pages: ViewerPages): string => {
        let result = "";
        for (let p of pages) {
          if (typeof p === "string") {
            result = p;
            break;
          } else if (p instanceof HTMLImageElement) {
            result = p.dataset.src || p.src;
            break;
          }
        }
        return result;
      }

      const src = getBeginningSrc(pages);
      if (src !== "") {
        // 画像src取得に失敗した場合は処理を行わない
        this.setPageSizeFromImgPath(src);
      }
    }

    this.preference = new Preference(builder, rootEl);

    // 省略表記だとバグが起きそうなので
    // undefinedでないかだけ確認する
    if (options.isLTR !== void 0) this.state.isLTR = options.isLTR;
    if (options.vertPageMargin !== void 0) this.state.vertPageMargin = options.vertPageMargin;
    if (options.horizPageMargin !== void 0) this.state.horizPageMargin = options.horizPageMargin;
    if (options.isFirstSlideEmpty !== void 0) this.state.isFirstSlideEmpty = options.isFirstSlideEmpty;
    if (options.viewerPadding !== void 0) this.state.viewerPadding = options.viewerPadding;
    if (options.isInstantOpen !== void 0) this.state.isInstantOpen = options.isInstantOpen;
    // ここからは省略表記で存在確認
    if (options.viewerId) this.state.viewerId = options.viewerId;
    if (options.isVisiblePagination) rootEl.classList.add(this.stateNames.visiblePagination);

    if (this.preference.progressBarWidth !== "auto") {
      this.state.progressBarWidth = this.getBarWidth(this.preference.progressBarWidth);
    } else if (typeof options.progressBarWidth === "string" && options.progressBarWidth !== "auto") {
      this.state.progressBarWidth = this.getBarWidth(options.progressBarWidth);
    }

    this.thumbs = new Thumbnails(builder, rootEl, pages, this.state);
    // 画像読み込みなどを防ぐため初期状態ではdisplay: noneにしておく
    rootEl.style.display = "none";
    rootEl.classList.add("laymic_root", this.stateNames.visibleUI);
    if (this.state.isLTR) rootEl.classList.add(this.stateNames.ltr);

    const [controllerEl, uiButtons] = builder.createViewerController();
    const swiperEl = builder.createSwiperContainer(
      "laymic_slider",
      pages,
      this.state.isLTR,
      this.state.isFirstSlideEmpty
    );

    [
      controllerEl,
      swiperEl,
      this.thumbs.el,
      this.preference.el
    ].forEach(el => rootEl.appendChild(el));

    this.el = {
      rootEl,
      swiperEl,
      controllerEl,
      buttons: uiButtons,
    };
    this.cssProgressBarWidthUpdate();
    this.cssViewerPaddingUpdate();

    // 一旦DOMから外していたroot要素を再度放り込む
    document.body.appendChild(this.el.rootEl);

    this.swiper = new Swiper(this.el.swiperEl, this.mainSwiperHorizViewConf);

    if (options.viewerDirection === "vertical") this.enableVerticalView()

    // location.hashにmangaViewerIdと同値が指定されている場合は
    // 即座に開く
    if (this.state.isInstantOpen && location.hash === "#" + this.state.viewerId) {
      this.open(true);
    }

    // 各種イベントの停止
    this.applyEventListeners();

    // 初期化引数を保管
    this.initOptions = options;

    // DEBUG: デバッグ用の仮関数
    this.debugFunction();
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
  private get defaultMangaViewerStates(): ViewerStates {
    const {
      innerHeight: ih,
      innerWidth: iw,
    } = window;
    const pageSize = {
      w: 720,
      h: 1024
    };

    const viewerIdx = viewerCnt();

    return {
      viewerPadding: 10,
      // デフォルト値としてウィンドウ幅を指定
      swiperRect: {
        l: 0,
        t: 0,
        w: iw,
        h: ih,
      },
      viewerId: "laymic" + viewerIdx,
      // インスタンスごとに固有のid数字
      viewerIdx,
      pageSize,
      thresholdWidth: pageSize.w,
      pageAspect: {
        w: 45,
        h: 64
      },
      isLTR: false,
      isVertView: false,
      isFirstSlideEmpty: false,
      vertPageMargin: 10,
      horizPageMargin: 0,
      progressBarWidth: this.getBarWidth(),
      thumbItemWidth: 96,
      thumbItemGap: 16,
      thumbsWrapperPadding: 16,
      isMobile: isExistTouchEvent(),
      isInstantOpen: true,
    }
  }
  private get mainSwiperHorizViewConf(): SwiperOptions {
    const breakpoints: { [index: number]: SwiperOptions } = {};
    const thresholdWidth = this.state.thresholdWidth;
    breakpoints[thresholdWidth] = {
      slidesPerView: 2,
      slidesPerGroup: 2,
    };


    this.switchSingleSlideState();

    return {
      direction: "horizontal",
      speed: 200,
      slidesPerView: 1,
      slidesPerGroup: 1,
      spaceBetween: this.state.horizPageMargin,

      on: {
        reachBeginning: () => this.changePaginationVisibility(),
        resize: () => {
          this.switchSingleSlideState();
          this.viewUpdate();
        },
        slideChange: () => {
          this.hideViewerUI();
          this.changePaginationVisibility();
        },
      },
      pagination: {
        el: ".swiper-pagination",
        type: "progressbar",
      },
      keyboard: true,
      preloadImages: false,
      lazy: {
        loadPrevNext: true,
        loadPrevNextAmount: 4,
      },
      breakpoints
    }
  }

  private get mainSwiperVertViewConf(): SwiperOptions {
    return {
      direction: "vertical",
      spaceBetween: this.state.vertPageMargin,
      speed: 200,
      keyboard: true,
      freeMode: true,
      freeModeMomentumRatio: 0.36,
      freeModeMomentumVelocityRatio: 1,
      freeModeMinimumVelocity: 0.02,
      on: {
        reachBeginning: () => this.changePaginationVisibility(),
        resize: () => this.viewUpdate(),
        slideChange: () => {
          this.hideViewerUI();
          this.changePaginationVisibility();
        },
      },
      pagination: {
        el: ".swiper-pagination",
        type: "progressbar",
      },
      preloadImages: false,
      lazy: {
        loadPrevNext: true,
        loadPrevNextAmount: 4,
      },
    }
  }

  /**
   * 各種イベントの登録
   * インスタンス生成時に一度だけ呼び出されることを想定
   */
  private applyEventListeners() {
    // 縦読み/横読み切り替えボタン
    this.el.buttons.direction.addEventListener("click", () => {
      if (!this.state.isVertView) {
        this.enableVerticalView()
      } else {
        this.disableVerticalView()
      }
    });

    // サムネイル表示ボタン
    this.el.buttons.thumbs.addEventListener("click", () => {

      if (this.thumbs.el.style.display === "none") {
        // ページ読み込み後一度だけ動作する
        this.thumbs.el.style.display = "";
        this.thumbs.revealImgs();
      }
      this.el.rootEl.classList.add(this.stateNames.showThumbs);

      this.hideViewerUI();
    })

    // サムネイルのクリックイベント
    // 各サムネイルとswiper各スライドとを紐づける
    this.thumbs.thumbEls.forEach((el, i) => el.addEventListener("click", () => {
      this.swiper.slideTo(i);
      this.el.rootEl.classList.remove(this.stateNames.showThumbs);
    }));

    // 全画面化ボタンのクリックイベント
    this.el.buttons.fullscreen.addEventListener("click", () => {
      this.fullscreenHandler()
    });

    // 設定ボタンのクリックイベント
    this.el.buttons.preference.addEventListener("click", () => {
      this.el.rootEl.classList.toggle(this.stateNames.showPreference);
      // NOTE: 暫定でUIを閉じておく
      this.hideViewerUI();
    })

    // オーバーレイ終了ボタンのクリックイベント
    this.el.buttons.close.addEventListener("click", () => {
      this.close();
    });

    this.el.buttons.nextPage.addEventListener("click", () => {
      this.swiper.slideNext();
    });

    this.el.buttons.prevPage.addEventListener("click", () => {
      this.swiper.slidePrev();
    });

    // swiperElと周囲余白にあたるcontrollerElへの各種イベント登録
    [
      this.el.swiperEl,
      this.el.controllerEl
    ].forEach(el => {
      // クリック時のイベント
      el.addEventListener("click", e => {
        if (!this.state.isMobile
          || this.preference.isEnableTapSlidePage)
        {
          // 非タッチデバイス、
          // またはisEnableTapSlidePageがtrueの場合の処理
          this.slideClickHandler(e);
        } else {
          // タッチデバイスでの処理
          this.toggleViewerUI();
        }
      })

      el.addEventListener("mousemove", rafThrottle(e => {
        this.slideMouseHoverHandler(e);
      }))

      // マウスホイールでのイベント
      // swiper純正のマウスホイール処理は動作がすっとろいので自作
      el.addEventListener("wheel", rafThrottle(e => {
        // 上下ホイール判定
        // || RTL時の左右ホイール判定
        // || LTR時の左右ホイール判定
        const isNext = e.deltaY > 0
        || !this.state.isLTR && e.deltaX < 0
        || this.state.isLTR && e.deltaX > 0;
        const isPrev = e.deltaY < 0
        || !this.state.isLTR && e.deltaX > 0
        || this.state.isLTR && e.deltaX < 0;

        if (isNext) {
          // 進む
          this.swiper.slideNext();
        } else if (isPrev) {
          // 戻る
          this.swiper.slidePrev();
        }
      }));
    });

    // ユーザビリティのため「クリックしても何も起きない」
    // 場所ではイベント伝播を停止させる
    Array.from(this.el.controllerEl.children).forEach(el => el.addEventListener("click", e => e.stopPropagation()));

    // カスタムイベント登録
    this.el.rootEl.addEventListener("LaymicPreferenceUpdate", ((e: CustomEvent<string>) => {
      if (e.detail === "progressBarWidth") {
        // progressBarWidth数値を取得する
        const w = this.getBarWidth(this.preference.progressBarWidth);
        this.state.progressBarWidth = w;
        // 設定した値を画面に適用する
        this.cssProgressBarWidthUpdate();
        this.viewUpdate();
      } else if (e.detail === "paginationVisibility") {
        // ページ送り表示設定
        // pagination visibility
        const pv = this.preference.paginationVisibility;
        // isVisiblePagination
        const isVP = this.initOptions.isVisiblePagination;
        const isVisible = pv === "visible" || pv !== "hidden" && isVP;
        const vpClass = this.stateNames.visiblePagination;

        if (isVisible) {
          this.el.rootEl.classList.add(vpClass);
        } else {
          this.el.rootEl.classList.remove(vpClass);
        }
      } else {
        console.log("manga viewer update event");
      }
    }) as EventListener)
  }

  /**
   * オーバーレイ表示を展開させる
   * @param  isDisableFullscreen trueならば全画面化処理を無効化する
   */
  public open(isDisableFullscreen: boolean = false) {
    const isFullscreen = !isDisableFullscreen && this.preference.isAutoFullscreen;

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
      this.fullscreenHandler();
    }

    // swiperのfreeModeには
    // 「lazyloadとfreeModeを併用した際初期画像の読み込みが行われない」
    // 不具合があるようなので手動で画像読み込み
    if (this.swiper.activeIndex === 0 && this.swiper.lazy) {
      this.swiper.lazy.load();
    }

    // 履歴を追加せずにhash値を書き換える
    if (this.state.isInstantOpen) {
      const newUrl = location.href.split("#")[0] + "#" + this.state.viewerId;
      location.replace(newUrl);
    }
  }

  /**
   * オーバーレイ表示を閉じる
   */
  public close(isHashChange: boolean = true) {
    this.hideRootEl();

    // フルスクリーン状態にあるならそれを解除
    if (document.fullscreenElement) {
      this.fullscreenHandler();
    }

    // オーバーレイ下要素のスクロール再開
    this.enableBodyScroll();

    if (this.state.isInstantOpen
      && location.hash
      && isHashChange
    ) {
      // 履歴を残さずhashを削除する
      location.replace(location.href.split("#")[0]);
    }
  }
  private switchSingleSlideState() {
    const rootEl = this.el.rootEl;
    const state = this.stateNames.singleSlide;
    if (this.state.thresholdWidth <= window.innerWidth) {
      rootEl.classList.remove(state);
    } else {
      rootEl.classList.add(state);
    }
  }

  /**
   * 縦読み表示へと切り替える
   */
  private enableVerticalView() {
    this.state.isVertView = true;
    this.el.rootEl.classList.add(this.stateNames.vertView);

    // 一番目に空要素を入れる設定の場合はindex数値を1増やす
    const activeIdx = this.swiper.activeIndex;
    const idx = (this.state.isFirstSlideEmpty && activeIdx !== 0)
      ? activeIdx - 1
      : activeIdx;

    // 読み進めたページ数を引き継ぐ
    const conf = Object.assign(this.mainSwiperVertViewConf, {
      initialSlide: idx
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
    this.el.rootEl.classList.remove(this.stateNames.vertView);

    // 一番目に空要素を入れる設定の場合はindex数値を1増やす
    const activeIdx = this.swiper.activeIndex;
    const idx = (this.state.isFirstSlideEmpty)
      ? activeIdx + 1
      : activeIdx;

    // 読み進めたページ数を引き継ぐ
    const conf = Object.assign(this.mainSwiperHorizViewConf, {
      initialSlide: idx
    })

    // swiperインスタンスを一旦破棄してからre-init
    this.swiper.destroy(true, true);
    this.swiper = new Swiper(this.el.swiperEl, conf);

    this.viewUpdate();
  }
  /**
   * 入力したMouseEventが
   * mangaViewer画面のクリックポイントに重なっているかを返す
   *
   * 横読み時   : 左側クリックで進む、右側クリックで戻る
   * 横読みLTR時: 右側クリックで進む、左側クリックで戻る
   * 縦読み時   : 下側クリックで進む、上側クリックで戻る
   *
   * @param  e mouse event
   * @return   [次に進むクリックポイントに重なっているか, 前に戻るクリックポイントに重なっているか]
   */
  private getClickPoint(e: MouseEvent): [boolean, boolean] {
    const {l, t, w, h} = this.state.swiperRect;
    const [x, y] = [e.pageX - l, e.pageY - t];

    let [isNextClick, isPrevClick] = [false, false];

    if (this.state.isVertView) {
      // 縦読み時処理
      isNextClick = y > h * 0.80;
      isPrevClick = y < h * 0.20;
    } else if (this.state.isLTR) {
      // 横読みLTR時処理
      isNextClick = x > w * 0.80;
      isPrevClick = x < w * 0.20;
    } else {
      // 通常横読み時処理
      isNextClick = x < w * 0.20;
      isPrevClick = x > w * 0.80;
    }

    return [isNextClick, isPrevClick];
  }

  /**
   * mangaViewer画面をクリックした際のイベントハンドラ
   *
   * クリック判定基準についてはgetClickPoint()を参照のこと
   *
   * @param  e  mouse event
   */
  private slideClickHandler(e: MouseEvent) {
    const [isNextClick, isPrevClick] = this.getClickPoint(e);

    if (isNextClick && !this.swiper.isEnd) {
      // 進めるページがある状態で進む側をクリックした際の処理
      this.swiper.slideNext();
      this.hideViewerUI();
    } else if (isPrevClick && !this.swiper.isBeginning) {
      // 戻れるページがある状態で戻る側をクリックした際の処理

      // freeModeでslidePrev()を使うとなんかバグがあるっぽいので
      // 手動計算して動かす
      const idx = (this.swiper.activeIndex !== 0)
        ? this.swiper.activeIndex - 1
        : 0;
      this.swiper.slideTo(idx);

      this.hideViewerUI();
    } else {
      this.toggleViewerUI();
    }
  }

  /**
   * クリックポイント上にマウス座標が重なっていたならマウスホバー処理を行う
   * @param  e  mouse event
   */
  private slideMouseHoverHandler(e: MouseEvent) {
    const [isNextClick, isPrevClick] = this.getClickPoint(e);
    const {nextPage, prevPage} = this.el.buttons;
    const active = this.stateNames.active;
    const {controllerEl, swiperEl} = this.el;

    const setCursorStyle = (isPointer: boolean) => {
      const cursor = (isPointer) ? "pointer" : "";
      controllerEl.style.cursor = cursor
      swiperEl.style.cursor = cursor;
    }

    if (isNextClick && !this.swiper.isEnd) {
      // 進めるページがある状態で進む側クリックポイントと重なった際の処理
      nextPage.classList.add(active);
      setCursorStyle(true);
    } else if (isPrevClick && !this.swiper.isBeginning) {
      // 戻れるページがある状態で戻る側クリックポイントと重なった際の処理
      prevPage.classList.add(active);
      setCursorStyle(true);
    } else {
      // どちらでもない場合の処理
      nextPage.classList.remove(active);
      prevPage.classList.remove(active);
      setCursorStyle(false);
    }
  }

  private changePaginationVisibility() {
    const hidden = this.stateNames.hidden;
    const {prevPage, nextPage} = this.el.buttons;
    const {isBeginning, isEnd} = this.swiper;

    if (isBeginning) {
      prevPage.classList.add(hidden)
    } else {
      prevPage.classList.remove(hidden);
    }

    if (isEnd) {
      nextPage.classList.add(hidden);
    } else {
      nextPage.classList.remove(hidden);
    }
  }

  private toggleViewerUI() {
    this.el.rootEl.classList.toggle(this.stateNames.visibleUI);
  }

  private hideViewerUI() {
    const stateName = this.stateNames.visibleUI;
    if (this.el.rootEl.classList.contains(stateName)) {
      this.el.rootEl.classList.remove(stateName);
    }
  }

  /**
   * mangaViewer表示を更新する
   * 主にswiperの表示を更新するための関数
   */
  private viewUpdate() {
    this.state.swiperRect = this.swiperElRect;
    this.cssPageWidthUpdate();
    if (this.thumbs && this.el) this.thumbs.cssThumbsWrapperWidthUpdate(this.el.rootEl);
    if (this.swiper) this.swiper.update();
  }

  /**
   * 全画面化ボタンのイベントハンドラ
   *
   * 非全画面状態ならば全画面化させて、
   * 全画面状態であるならそれを解除する
   */
  private fullscreenHandler() {
    // フルスクリーン切り替え後に呼び出される関数
    const postToggleFullscreen = () => {
      const isFullscreen = document.fullscreenElement;
      const fsClass = this.stateNames.fullscreen;
      if (isFullscreen) {
        // 全画面有効時
        this.el.rootEl.classList.add(fsClass);
      } else {
        // 通常時
        this.el.rootEl.classList.remove(fsClass);
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
    // deduct progressbar size from rootElSize
    const [dw, dh] = [
      ow - this.state.progressBarWidth,
      oh - this.state.progressBarWidth
    ];
    const paddingNum = this.state.viewerPadding * 2;

    let {w: pageWidth, h: pageHeight} = this.state.pageSize;

    // 横読み時にはプログレスバー幅を差し引いた縦幅を計算に使い、
    // 縦読み時はプログレスバー幅を差し引いた横幅を計算に使う
    if (!this.state.isVertView && ow < pageWidth * 2
      || dw > pageWidth && oh < pageHeight)
    {
      // 横読み時または縦読み時で横幅が狭い場合でのサイズ計算
      const h = dh - paddingNum;
      pageWidth = Math.round(h * aw / ah);
      pageHeight = Math.round(pageWidth * ah / aw);
    } else if (oh < pageHeight) {
      // 縦読み時で縦幅が狭い場合のサイズ計算
      const w = dw - paddingNum;
      pageHeight = Math.round(w * ah / aw);
      pageWidth = Math.round(pageHeight * aw / ah);
    }

    this.el.rootEl.style.setProperty("--page-width", pageWidth + "px");
    this.el.rootEl.style.setProperty("--page-height", pageHeight + "px");
  }

  private cssProgressBarWidthUpdate() {
    this.el.rootEl.style.setProperty("--progressbar-width", this.state.progressBarWidth + "px");
  }

  private cssViewerPaddingUpdate() {
    this.el.rootEl.style.setProperty("--viewer-padding", this.state.viewerPadding + "px");
  }

  /**
   * mangaViewerと紐付いたrootElを表示する
   */
  private showRootEl() {
    this.el.rootEl.style.opacity = "1";
    this.el.rootEl.style.visibility = "visible";
  }

  /**
   * mangaViewerと紐付いたrootElを非表示にする
   */
  private hideRootEl() {
    this.el.rootEl.style.opacity = "";
    this.el.rootEl.style.visibility = "";
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
   * pageSizeと関連する部分を一挙に設定する
   * @param  width  新たなページ横幅
   * @param  height 新たなページ縦幅
   */
  private setPageSize(width: number, height: number) {
    this.state.pageSize = {
      w: width,
      h: height,
    }

    const gcd = calcGCD(width, height);

    this.state.pageAspect = {
      w: width / gcd,
      h: height / gcd,
    }

    this.state.thresholdWidth = width;
  }

  /**
   * 入力したpathの画像からpageSizeを設定する
   * @param src 画像path
   */
  private setPageSizeFromImgPath(src: string) {
    readImage(src).then(img => {
      const {width: w, height: h} = img;

      this.setPageSize(w, h);

      // もしここでエラーが起きても問題ないので握りつぶす
      this.viewUpdate();
    }).catch(e => console.error(e));
  }

  /**
   * BarWidthの値から進捗バー幅数値を取得する
   * @param  widthStr BarWidth値
   * @return          対応する数値
   */
  private getBarWidth(widthStr: BarWidth = "auto") {
    let width = 8;
    if (widthStr === "none") {
      width = 0;
    } else if (widthStr === "tint") {
      width = 4;
    } else if (widthStr === "bold")  {
      width = 12;
    }

    return width;
  }

  private debugFunction() {
    // thresholdWidth
    const tw = this.state.thresholdWidth;
    // window.innerWidth
    const iw = window.innerWidth;

    const div = document.createElement("div");
    [
      "　",
      "-----デバッグ用ここから-----",
      `tw: ${tw}, iw: ${iw}`,
      "　"
    ].forEach(s => {
      const p = document.createElement("p");
      p.textContent = s;
      div.appendChild(p);
    });

    this.preference.wrapperEl.appendChild(div);
  }
}
