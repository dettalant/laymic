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
  excludeHashLocation,
  calcWindowVH,
} from "#/utils";
import DOMBuilder from "#/components/builder";
import LaymicPreference from "#/components/preference";
import LaymicThumbnails from "#/components/thumbs";
import LaymicHelp from "#/components/help";
import LaymicZoom from "#/components/zoom";
import {
  ViewerPages,
  ViewerElements,
  LaymicOptions,
  ViewerStates,
  PageRect,
} from "#/interfaces";

Swiper.use([Keyboard, Pagination, Lazy]);

export default class Laymic {
  // HTMLElementまとめ
  el: ViewerElements;
  // mangaViewer内部で用いるステートまとめ
  state: ViewerStates = this.defaultMangaViewerStates;
  initOptions: LaymicOptions;
  preference: LaymicPreference;
  thumbs: LaymicThumbnails;
  help: LaymicHelp;
  zoom: LaymicZoom;
  // swiper instance
  swiper: Swiper;
  builder: DOMBuilder;

  constructor(pages: ViewerPages, options: LaymicOptions = {}) {
    // 初期化引数を保管
    this.initOptions = options;
    const builder = new DOMBuilder(options.icons, options.classNames, options.stateNames);
    const rootEl = builder.createDiv();
    const {stateNames, classNames} = builder;
    this.builder = builder;

    if (this.state.viewerIdx === 0) {
      // 一つのページにつき一度だけの処理
      const svgCtn = builder.createSVGIcons();
      document.body.appendChild(svgCtn);
    }

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

    this.preference = new LaymicPreference(builder, rootEl);

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

    this.thumbs = new LaymicThumbnails(builder, rootEl, pages, this.state);
    this.help = new LaymicHelp(builder, rootEl);
    this.zoom = new LaymicZoom(builder, rootEl);
    // 画像読み込みなどを防ぐため初期状態ではdisplay: noneにしておく
    rootEl.style.display = "none";
    rootEl.classList.add(classNames.root, stateNames.visibleUI);
    if (this.state.isLTR) rootEl.classList.add(stateNames.ltr);
    if (this.state.isMobile) rootEl.classList.add(stateNames.mobile);
    // fullscreen非対応なら全画面ボタンを非表示化する
    if (!screenfull.isEnabled) rootEl.classList.add(stateNames.unsupportedFullscreen);

    const [controllerEl, uiButtons] = builder.createViewerController();
    const swiperEl = builder.createSwiperContainer(
      pages,
      this.state.isLTR,
      this.state.isFirstSlideEmpty
    );

    [
      controllerEl,
      swiperEl,
      this.thumbs.el,
      this.preference.el,
      this.help.el,
    ].forEach(el => rootEl.appendChild(el));
    controllerEl.appendChild(this.zoom.el);

    this.el = {
      rootEl,
      swiperEl,
      controllerEl,
      buttons: uiButtons,
    };
    this.cssProgressBarWidthUpdate();
    this.cssViewerPaddingUpdate();
    this.cssJsVhUpdate();

    // 一旦DOMから外していたroot要素を再度放り込む
    document.body.appendChild(this.el.rootEl);

    this.swiper = new Swiper(this.el.swiperEl, this.mainSwiperHorizViewConf);

    if (options.viewerDirection === "vertical") this.enableVerticalView()

    // 各種イベントの登録
    this.applyEventListeners();

    // location.hashにmangaViewerIdと同値が指定されている場合は
    // 即座に開く
    if (this.state.isInstantOpen && location.hash === "#" + this.state.viewerId) {
      this.open(true);
    }
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
    } = this.el.rootEl.getBoundingClientRect();
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
      // 空白をつけた左始めがデフォルト設定
      isFirstSlideEmpty: true,
      vertPageMargin: 10,
      horizPageMargin: 0,
      // mediumと同じ数値
      progressBarWidth: 8,
      thumbItemHeight: 128,
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
          this.cssJsVhUpdate();
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
        resize: () => {
          this.switchSingleSlideState();
          this.cssJsVhUpdate();
          this.viewUpdate()
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
      preloadImages: false,
      lazy: {
        loadPrevNext: true,
        loadPrevNextAmount: 4,
      },
    }
  }

  /**
   * 横読み2p表示するか否かの判定を行う
   * @return  2p表示する解像度ならばtrue
   */
  private get isDoubleSlideHorizView(): boolean {
    return this.state.thresholdWidth <= window.innerWidth;
  }

  /**
   * 各種イベントの登録
   * インスタンス生成時に一度だけ呼び出されることを想定
   */
  private applyEventListeners() {
    const stateNames = this.builder.stateNames;
    this.el.buttons.help.addEventListener("click", () => {
      this.help.showHelp();
      this.hideViewerUI();
      console.log("activeIdx: ", this.swiper.activeIndex);
    })

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
      this.thumbs.showThumbs();
      this.hideViewerUI();
    })

    // サムネイルのクリックイベント
    // 各サムネイルとswiper各スライドとを紐づける
    this.thumbs.thumbEls.forEach((el, i) => el.addEventListener("click", () => {
      this.thumbs.hideThumbs();
      this.swiper.slideTo(i);
    }));

    const zoomHandler = () => {
      if (this.zoom.isZoomed) {
        // ズーム時
        this.zoom.disable();
      } else {
        // 非ズーム時
        this.zoom.enable();
      }
      this.hideViewerUI();
    }
    // ズームボタンのクリックイベント
    this.el.buttons.zoom.addEventListener("click", zoomHandler)

    // 全画面化ボタンのクリックイベント
    this.el.buttons.fullscreen.addEventListener("click", () => {
      this.fullscreenHandler()
    });

    // 設定ボタンのクリックイベント
    this.el.buttons.preference.addEventListener("click", () => {
      this.preference.showPreference();
      // UIを閉じておく
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

      // ダブルクリック時のイベント
      // el.addEventListener("dblclick", zoomHandler)

      // マウス操作時のイベント
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
        const w = this.preference.getBarWidth(this.preference.progressBarWidth);
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
        const vpClass = stateNames.visiblePagination;

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


    // ページ読み込み後一度目の展開時にのみtrue
    const isInitialOpen = this.el.rootEl.style.display === "none";

    // display:none状態の場合でだけ動く部分
    if (isInitialOpen) {
      this.el.rootEl.style.display = "";
      sleep(5).then(() => {
        // slideが追加された後に処理を行う必要があるため
        // sleepを噛ませて非同期処理とする
        this.switchSingleSlideState();
      })
    };

    // preferenceかinitOptionの値を適用する
    this.preference.applyPreferenceValues();

    // 全画面化条件を満たしているなら全画面化
    if (isFullscreen) {
      // 全画面化ハンドラ内部で呼び出されているので
      // this.viewUpdate()は不要
      this.fullscreenHandler();
    } else {
      // 全画面化しない場合は表示更新のみ行う
      this.viewUpdate();
    }

    // オーバーレイ要素の表示
    this.showRootEl();

    // オーバーレイ下要素のスクロール停止
    this.disableBodyScroll();

    // swiperのfreeModeには
    // 「lazyloadとfreeModeを併用した際初期画像の読み込みが行われない」
    // 不具合があるようなので手動で画像読み込み
    if (this.swiper.activeIndex === 0 && this.swiper.lazy) {
      this.swiper.lazy.load();
    }

    // 履歴を追加せずにhash値を書き換える
    if (this.state.isInstantOpen) {
      const newUrl = excludeHashLocation() + "#" + this.state.viewerId;
      window.location.replace(newUrl);
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
      const newUrl = excludeHashLocation() + "#";
      window.location.replace(newUrl);
    }
  }

  /**
   * 縦読み表示へと切り替える
   */
  private enableVerticalView() {
    const vertView = this.builder.stateNames.vertView;
    this.state.isVertView = true;
    this.el.rootEl.classList.add(vertView);


    const isFirstSlideEmpty = this.state.isFirstSlideEmpty;
    // if (isFirstSlideEmpty) {
    //   this.removeFirstEmptySlide();
    // }
    const activeIdx = this.swiper.activeIndex;

    // 横読み2p表示を行う解像度であり、
    // 一番目に空要素を入れる設定が有効な場合はindex数値を1減らす
    const idx = (isFirstSlideEmpty
      && activeIdx !== 0
      && this.isDoubleSlideHorizView
    )
      ? activeIdx - 1
      : activeIdx

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
    const vertView = this.builder.stateNames.vertView;
    this.state.isVertView = false;
    this.el.rootEl.classList.remove(vertView);

    const isFirstSlideEmpty = this.state.isFirstSlideEmpty;

    // 横読み2p表示を行う解像度であり、
    // 一番目に空要素を入れる設定が有効な場合はindex数値を1減らす
    const activeIdx = this.swiper.activeIndex;
    const idx = (isFirstSlideEmpty && this.isDoubleSlideHorizView)
      ? activeIdx + 1
      : activeIdx;

    // 読み進めたページ数を引き継ぐ
    const conf = Object.assign(this.mainSwiperHorizViewConf, {
      initialSlide: idx
    })

    // swiperインスタンスを一旦破棄してからre-init
    this.swiper.destroy(true, true);
    this.swiper = new Swiper(this.el.swiperEl, conf);
    if (this.swiper.lazy) this.swiper.lazy.load();

    this.viewUpdate();
  }

  /**
   * 画面幅に応じて、横読み時の
   * 「1p表示 <-> 2p表示」を切り替える
   */
  private switchSingleSlideState() {
    const rootEl = this.el.rootEl;
    const state = this.builder.stateNames.singleSlide;
    const isFirstSlideEmpty = this.state.isFirstSlideEmpty;

    if (this.isDoubleSlideHorizView) {
      // 横読み時2p表示
      rootEl.classList.remove(state);

      if (isFirstSlideEmpty && this.swiper) this.prependFirstEmptySlide();
    } else {
      // 横読み時1p表示
      rootEl.classList.add(state);

      if (isFirstSlideEmpty && this.swiper) this.removeFirstEmptySlide();
    }
  }

  /**
   * 1p目空スライドを削除する
   */
  private removeFirstEmptySlide() {
    if (this.swiper.slides.length === 0) return;
    const firstSlide: HTMLElement = this.swiper.slides[0];
    const emptySlide = this.builder.classNames.emptySlide;
    const hasEmptySlide = firstSlide.classList.contains(emptySlide);

    if (hasEmptySlide) {
      // スライドを消す前のindexを取得
      const idx = this.swiper.activeIndex;
      this.swiper.removeSlide(0);

      // 縦読み時のみの処理
      if (this.state.isVertView) {
        // 直感的には妙な処理だけどこれで問題なく動く
        // removeSlide()を行う前のindex数値を入力して
        // 一つずらしている形
        this.swiper.slideTo(idx);
      }

      // swiper側の更新も一応かけておく
      this.swiper.updateSlides();
      this.swiper.updateProgress();
    }

  }

  /**
   * 空スライドを1p目に追加する
   * 重複して追加しないように、空スライドが存在しない場合のみ追加する
   */
  private prependFirstEmptySlide() {
    const firstSlide: HTMLElement | undefined = this.swiper.slides[0];
    if (!firstSlide) return;

    const emptySlide = this.builder.classNames.emptySlide;
    const hasEmptySlide = firstSlide.classList.contains(emptySlide);

    if (!hasEmptySlide) {
      const emptyEl = this.builder.createEmptySlideEl()
      this.swiper.prependSlide(emptyEl);

      // 縦読み時のみの処理
      if (this.state.isVertView) {
        // emptySlideはdisplay:noneを指定しているため
        // 縦読みモードでは計算にいれずともよい
        // そのため追加した要素分1つ後ろにずらしている
        const idx = this.swiper.activeIndex - 1;
        this.swiper.slideTo(idx);
      }

      // swiper側の更新も一応かけておく
      this.swiper.updateSlides();
      this.swiper.updateProgress();
    }
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
    const [x, y] = [e.clientX - l, e.clientY - t];

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
    const active = this.builder.stateNames.active;
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
    const hidden = this.builder.stateNames.hidden;
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

  /**
   * ビューワー操作UIをトグルさせる
   */
  private toggleViewerUI() {
    this.el.rootEl.classList.toggle(this.builder.stateNames.visibleUI);
  }

  /**
   * ビューワー操作UIを非表示化する
   */
  private hideViewerUI() {
    const stateName = this.builder.stateNames.visibleUI;
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
      const fsClass = this.builder.stateNames.fullscreen;
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

  private cssJsVhUpdate() {
    calcWindowVH(this.el.rootEl);
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
}
