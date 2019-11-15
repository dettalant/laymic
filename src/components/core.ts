import { SwiperOptions } from "swiper";
import { Swiper, Keyboard, Pagination, Lazy } from "swiper/js/swiper.esm";
import screenfull from "screenfull";
import {
  calcGCD,
  viewerCnt,
  sleep,
  isExistTouchEvent,
  isLaymicPages,
  rafThrottle,
  excludeHashLocation,
  calcWindowVH,
  isMultiTouch,
  passiveFalseOption,
  orientationChangeHandler,
  orientationChangeFuncs,
  getDeviceOrientation,
} from "#/utils";
import DOMBuilder from "#/components/builder";
import LaymicPreference from "#/components/preference";
import LaymicThumbnails from "#/components/thumbs";
import LaymicHelp from "#/components/help";
import LaymicZoom from "#/components/zoom";
import {
  ViewerPages,
  ViewerElements,
  LaymicPages,
  LaymicOptions,
  ViewerStates,
  PageRect,
  PreferenceUpdateEventString
} from "#/interfaces/index";

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

  constructor(laymicPages: LaymicPages | ViewerPages, options: LaymicOptions = {}) {
    // 初期化引数を保管
    this.initOptions = options;
    const builder = new DOMBuilder(options.icons, options.classNames, options.stateNames);
    const rootEl = builder.createDiv();
    const {stateNames, classNames} = builder;
    this.builder = builder;

    const [pages, thumbPages] = (isLaymicPages(laymicPages))
      ? [laymicPages.pages, laymicPages.thumbs || []]
      : [laymicPages, []];

    if (this.state.viewerIdx === 0) {
      // 一つのページにつき一度だけの処理
      const svgCtn = builder.createSVGIcons();
      document.body.appendChild(svgCtn);

      // 向き変更イベント自体は一度のみ登録する
      window.addEventListener("orientationchange", () => orientationChangeHandler());
    }

    if (options.pageWidth && options.pageHeight) {
      // ページサイズ数値が指定されていた場合の処理
      const [pw, ph] = [options.pageWidth, options.pageHeight]
      this.setPageSize(pw, ph);
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

    const pagesLen = (this.state.isFirstSlideEmpty)
    ? pages.length + 1
    : pages.length;
    if (options.isAppendEmptySlide === false || !(pagesLen % 2)) {
      // 強制的にオフ設定がなされているか
      // 合計ページ数が偶数の場合はスライドを追加しない
      this.state.isAppendEmptySlide = false;
    }

    this.thumbs = new LaymicThumbnails(builder, rootEl, pages, thumbPages, this.state);
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
      this.state.isFirstSlideEmpty,
      this.state.isAppendEmptySlide
    );

    [
      controllerEl,
      swiperEl,
      this.thumbs.el,
      this.preference.el,
      this.help.el,
    ].forEach(el => this.zoom.wrapper.appendChild(el));
    rootEl.appendChild(this.zoom.wrapper)
    controllerEl.appendChild(this.zoom.controller);

    this.el = {
      rootEl,
      swiperEl,
      controllerEl,
      buttons: uiButtons,
    };
    // 各種css変数の更新
    this.cssProgressBarWidthUpdate();
    this.cssViewerPaddingUpdate();
    this.cssJsVhUpdate();

    // 一旦DOMから外していたroot要素を再度放り込む
    document.body.appendChild(this.el.rootEl);

    const conf = (this.isMobile2pView)
      ? this.swiper2pHorizViewConf
      : this.swiperResponsiveHorizViewConf;
    this.swiper = new Swiper(this.el.swiperEl, conf);

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
      viewerId: "laymic",
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
      // 全ページ数が奇数でいて見開き2p表示の場合
      // 最終ページとして空白ページを追加する
      isAppendEmptySlide: true,
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
      bodyScrollTop: 0,
      isActive: false,
      deviceOrientation: getDeviceOrientation(),
    }
  }

  private get swiper2pHorizViewConf(): SwiperOptions {
    return {
      direction: "horizontal",
      speed: 200,
      slidesPerView: 2,
      slidesPerGroup: 2,
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
    }
  }

  private get swiperResponsiveHorizViewConf(): SwiperOptions {
    const breakpoints: { [index: number]: SwiperOptions } = {};
    const thresholdWidth = this.state.thresholdWidth;
    breakpoints[thresholdWidth] = {
      slidesPerView: 2,
      slidesPerGroup: 2,
    };

    const conf = this.swiper2pHorizViewConf;
    conf.slidesPerView = 1;
    conf.slidesPerGroup = 1;
    conf.breakpoints = breakpoints;
    return conf;
  }

  private get swiperVertViewConf(): SwiperOptions {
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
    return this.isMobile2pView || this.state.thresholdWidth <= window.innerWidth;
  }

  /**
   * モバイル端末での強制2p見開き表示モードか否かを判定する
   * @return 2p見開き表示条件ならばtrue
   */
  private get isMobile2pView(): boolean {
    return this.state.isMobile && this.state.deviceOrientation === "landscape";
  }

  /**
   * オーバーレイ表示を展開させる
   * @param  isDisableFullscreen trueならば全画面化処理を無効化する
   */
  open(isDisableFullscreen: boolean = false) {
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
    if (this.state.isVertView && this.swiper.activeIndex === 0 && this.swiper.lazy) {
      this.swiper.lazy.load();
    }

    // 履歴を追加せずにhash値を書き換える
    if (this.state.isInstantOpen) {
      const newUrl = excludeHashLocation() + "#" + this.state.viewerId;
      window.location.replace(newUrl);
    }

    // アクティブ状態に変更
    this.state.isActive = true;
  }

  /**
   * オーバーレイ表示を閉じる
   */
  close(isHashChange: boolean = true) {
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

    // 非アクティブ状態に変更
    this.state.isActive = false;
  }

  private laymicPreferenceUpdateHandler(e: CustomEvent<PreferenceUpdateEventString>) {
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
      const vpClass = this.builder.stateNames.visiblePagination;

      if (isVisible) {
        this.el.rootEl.classList.add(vpClass);
      } else {
        this.el.rootEl.classList.remove(vpClass);
      }
    } else if (e.detail === "isDisableTapSlidePage") {
      if (this.state.isMobile && this.preference.isDisableTapSlidePage) {
        // モバイル環境で設定値がtrueの際にのみ動作
        this.disablePagination();
      } else {
        this.enablePagination();
      }
    } else {
      console.log("manga viewer update event");
    }
  }

  /**
   * 各種イベントの登録
   * インスタンス生成時に一度だけ呼び出されることを想定
   */
  private applyEventListeners() {
    this.el.buttons.help.addEventListener("click", () => {
      this.help.showHelp();
      this.hideViewerUI();
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
        if (this.state.isMobile && this.preference.isDisableTapSlidePage) {
          // モバイルブラウザでのタップページ送り無効化設定時は
          // viewerUIのトグルだけ行う
          this.toggleViewerUI();
        } else {
          this.slideClickHandler(e);
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

      if (this.state.isMobile) {
        el.addEventListener("touchstart", e => {
          this.zoom.updatePastDistance(e);
        });

        el.addEventListener("touchmove", rafThrottle(e => {
          // マルチタッチでない場合と全画面状態でない場合は早期リターン
          if (!isMultiTouch(e)) return;

          e.preventDefault();
          this.zoom.pinchZoom(e);
        }), passiveFalseOption);

        el.addEventListener("touchend", () => {
          if (this.zoom.isZoomed) {
            this.zoom.enableController();
            this.hideViewerUI();
          }
        })
      }

    });

    // ユーザビリティのため「クリックしても何も起きない」
    // 場所ではイベント伝播を停止させる
    Array.from(this.el.controllerEl.children).forEach(el => el.addEventListener("click", e => e.stopPropagation()));

    // カスタムイベント登録
    this.el.rootEl.addEventListener("LaymicPreferenceUpdate", ((e: CustomEvent<PreferenceUpdateEventString>) => this.laymicPreferenceUpdateHandler(e)) as EventListener)

    // orientationchangeイベント登録
    orientationChangeFuncs.push(this.orientationChange.bind(this));
  }

  /**
   * swiper instanceを再初期化する
   * @param  swiperConf 初期化時に指定するswiperOption
   * @param  idx        初期化時に指定するindex数値
   */
  private reinitSwiperInstance(swiperConf: SwiperOptions, idx: number = 0) {
    const conf = Object.assign(swiperConf, {
      initialSlide: idx
    });

    // swiperインスタンスを一旦破棄してからre-init
    this.swiper.destroy(true, true);
    this.swiper = new Swiper(this.el.swiperEl, conf);

    this.viewUpdate();

    if (this.swiper.lazy) this.swiper.lazy.load();
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

      // 読み進めたページ数を引き継ぎつつ再初期化
    this.reinitSwiperInstance(this.swiperVertViewConf, idx);
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

    // 読み進めたページ数を引き継ぎつつ再初期化
    this.reinitSwiperInstance(this.swiperResponsiveHorizViewConf, idx);
  }

  /**
   * 画面幅に応じて、横読み時の
   * 「1p表示 <-> 2p表示」を切り替える
   */
  private switchSingleSlideState() {
    // swiperが初期化されていないなら早期リターン
    if (!this.swiper) return;

    const rootEl = this.el.rootEl;
    const state = this.builder.stateNames.singleSlide;
    const isFirstSlideEmpty = this.state.isFirstSlideEmpty;
    const isAppendEmptySlide = this.state.isAppendEmptySlide;

    if (this.isDoubleSlideHorizView) {
      // 横読み時2p表示

      if (isFirstSlideEmpty) this.prependFirstEmptySlide();
      if (isAppendEmptySlide) this.appendLastEmptySlide();

      rootEl.classList.remove(state);
    } else {
      // 横読み時1p表示

      if (isFirstSlideEmpty) this.removeFirstEmptySlide();
      if (isAppendEmptySlide) this.removeLastEmptySlide();
      rootEl.classList.add(state);
    }

    this.swiper.update();
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

      // this.swiper.updateSlides();
      // this.swiper.updateProgress();
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
      const emptyEl = this.builder.createEmptySlideEl();
      this.swiper.prependSlide(emptyEl);

      // 縦読み時のみの処理
      if (this.state.isVertView) {
        // emptySlideはdisplay:noneを指定しているため
        // 縦読みモードでは計算にいれずともよい
        // そのため追加した要素分1つ後ろにずらしている
        const idx = this.swiper.activeIndex - 1;
        this.swiper.slideTo(idx);
      }

      // this.swiper.updateSlides();
      // this.swiper.updateProgress();
    }
  }

  /**
   * 最終p空白スライドを削除する
   */
  private removeLastEmptySlide() {
    if (this.swiper.slides.length === 0) return;
    const lastIdx = this.swiper.slides.length - 1;
    const lastSlide: HTMLElement = this.swiper.slides[lastIdx];
    const emptySlide = this.builder.classNames.emptySlide;
    const hasEmptySlide = lastSlide.classList.contains(emptySlide);

    if (hasEmptySlide) {
      this.swiper.removeSlide(lastIdx);
    }

    // this.swiper.updateSlides();
    // this.swiper.updateProgress();
  }

  /**
   * 最終pに空白スライドを追加する
   */
  private appendLastEmptySlide() {
    if (this.swiper.slides.length === 0) return;
    const lastIdx = this.swiper.slides.length - 1;
    const lastSlide: HTMLElement = this.swiper.slides[lastIdx];
    const emptySlide = this.builder.classNames.emptySlide;
    const hasEmptySlide = lastSlide.classList.contains(emptySlide);

    if (!hasEmptySlide) {
      const emptyEl = this.builder.createEmptySlideEl();
      this.swiper.appendSlide(emptyEl);

      const isMove = this.swiper.activeIndex !== 0;
      if (!this.state.isVertView && isMove) {
        const idx = this.swiper.activeIndex + 2;
        this.swiper.slideTo(idx);
      }

      // this.swiper.updateSlides();
      // this.swiper.updateProgress();
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

    /**
     * swiperElとcontrollerElにおける
     * カーソル状態を一括設定する
     * @param isPointer trueならばポインターが乗っかっている状態とみなす
     */
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

  /**
   * ページ送りボタンの表示/非表示設定を切り替えるハンドラ
   *
   * disablePagination()で強制非表示化がなされている場合は
   * どうあがいても非表示となる
   */
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
    if (!this.el) {
      console.error("this.elが定義前に呼び出された");
      return;
    }

    this.state.swiperRect = this.swiperElRect;
    this.cssPageSizeUpdate();
    this.cssPageRealSizeUpdate();

    if (this.thumbs) this.thumbs.cssThumbsWrapperWidthUpdate(this.el.rootEl);

    if (this.zoom) this.zoom.updateZoomRect();

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
      if (!screenfull.isEnabled) return;

      const fsClass = this.builder.stateNames.fullscreen;
      if (screenfull.isFullscreen) {
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
   * css変数として表示可能ページ最大サイズを登録する
   */
  private cssPageSizeUpdate() {
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

  /**
   * プログレスバーの太さ数値をcss変数に登録する
   */
  private cssProgressBarWidthUpdate() {
    this.el.rootEl.style.setProperty("--progressbar-width", this.state.progressBarWidth + "px");
  }

  /**
   * viewerPadding数値をcss変数に登録する
   */
  private cssViewerPaddingUpdate() {
    this.el.rootEl.style.setProperty("--viewer-padding", this.state.viewerPadding + "px");
  }

  /**
   * 各スライドの実質サイズをcss変数に登録する
   */
  private cssPageRealSizeUpdate() {
    const {w: aw, h: ah} = this.state.pageAspect;
    const {clientWidth: cw, clientHeight: ch} = this.el.swiperEl;

    let width = cw / 2;
    let height = width * ah / aw;
    if (this.state.isVertView || !this.isDoubleSlideHorizView) {
      height = ch;
      width = height * aw / ah;
    }

    this.el.rootEl.style.setProperty("--page-real-width", width + "px");
    this.el.rootEl.style.setProperty("--page-real-height", height + "px");
  }

  // NOTE: 今は使用していないのでコメントアウト
  //
  // private cssPageAspectUpdate() {
  //   const {w: aw, h: ah} = this.state.pageAspect;
  //   this.el.rootEl.style.setProperty("--page-aspect-width", aw.toString());
  //   this.el.rootEl.style.setProperty("--page-aspect-height", ah.toString());
  // }

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
    const docEl = document.documentElement;
    this.state.bodyScrollTop = docEl.scrollTop;

    docEl.style.overflowY = "hidden";
    document.body.style.overflowY = "hidden";
  }

  /**
   * body要素のスクロールを再開させる
   */
  private enableBodyScroll() {
    const docEl = document.documentElement;

    docEl.style.overflowY = "";
    document.body.style.overflowY = "";
    sleep(1).then(() => {
      // 次のプロセスへと移してから
      // スクロール状況を復帰させる
      docEl.scrollTop = this.state.bodyScrollTop;
    })
  }

  /**
   * ページ送りボタンを強制的非表示化する
   * ステート状態をいじるのはバグの元なので直書きで非表示化する
   */
  private disablePagination() {
    const { prevPage, nextPage } = this.el.buttons;
    prevPage.style.display = "none";
    nextPage.style.display = "none";
  }

  /**
   * ページ送りボタン強制的非表示化を解除する
   * 直書きでのstyle付与を無くす
   */
  private enablePagination() {
    const { prevPage, nextPage } = this.el.buttons;
    prevPage.style.display = "";
    nextPage.style.display = "";
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
   * orientationcange eventに登録する処理
   */
  private orientationChange() {
    const orientation = getDeviceOrientation();
    this.state.deviceOrientation = orientation;

    // PC、または縦読みモードの際は早期リターン
    if (!this.state.isMobile || this.state.isVertView) return;

    const idx = (this.swiper) ? this.swiper.activeIndex : 0;
    if (orientation === "landscape") {
      // 横画面処理
      this.reinitSwiperInstance(this.swiper2pHorizViewConf, idx);
    } else {
      // 縦画面処理
      this.reinitSwiperInstance(this.swiperResponsiveHorizViewConf, idx)
    }
    this.switchSingleSlideState();
  }

  // private forceLazyImgLoad() {
  //   if (!this.swiper.lazy) return;
  //
  //   const loadingClassName = "swiper-lazy-loading"
  //   const loadingImgs = this.swiper.wrapperEl.getElementsByClassName(loadingClassName);
  //
  //   Array.from(loadingImgs).forEach(img => img.classList.remove(loadingClassName));
  //
  //   this.swiper.lazy.load();
  // }
}
