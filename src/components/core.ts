import { SwiperOptions, CommonEvent as SwiperCommonEvent } from "swiper";
import { Swiper, Keyboard, Pagination, Lazy } from "swiper/js/swiper.esm";
import screenfull from "screenfull";
import {
  calcGCD,
  sleep,
  isLaymicPages,
  rafThrottle,
  excludeHashLocation,
  isMultiTouch,
  orientationChangeHandler,
  orientationChangeFuncs,
} from "../utils";
import DOMBuilder from "./builder";
import LaymicPreference from "./preference";
import LaymicThumbnails from "./thumbs";
import LaymicHelp from "./help";
import LaymicZoom from "./zoom";
import LaymicCSSVariables from "./cssVar";
import LaymicStates from "./states";
import {
  ViewerPages,
  ViewerElements,
  LaymicPages,
  LaymicOptions,
  ViewerStates,
  PageRect,
  PreferenceUpdateEventString
} from "../interfaces/index";

Swiper.use([Keyboard, Pagination, Lazy]);

export default class Laymic {
  // HTMLElementまとめ
  el: ViewerElements;
  // mangaViewer内部で用いるステートまとめ
  state: ViewerStates = new LaymicStates();
  initOptions: LaymicOptions;
  preference: LaymicPreference;
  thumbs: LaymicThumbnails;
  help: LaymicHelp;
  zoom: LaymicZoom;
  cssVar: LaymicCSSVariables;
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
    // isDisabledForceHorizViewだけ先んじて適用
    const preferenceData = this.preference.loadPreferenceData();
    this.state.isDisabledForceHorizView = preferenceData.isDisabledForceHorizView;

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
    this.zoom = new LaymicZoom(builder, rootEl, this.preference);

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
    this.cssVar = new LaymicCSSVariables(this.el, this.state);

    // 各種css変数の更新
    this.cssVar.initCSSVars();

    // 一旦DOMから外していたroot要素を再度放り込む
    document.body.appendChild(this.el.rootEl);

    // 強制2p表示する条件が揃っていれば2p表示で初期化する
    const conf = (this.state.isMobile2pView)
      ? this.swiper2pHorizViewConf
      : this.swiperResponsiveHorizViewConf;

    this.swiper = new Swiper(this.el.swiperEl, conf);

    if (options.viewerDirection === "vertical") this.enableVerticalView(false)

    // 各種イベントの登録
    this.applyEventListeners();

    // location.hashにmangaViewerIdと同値が指定されている場合は
    // 即座に開く
    if (this.state.isInstantOpen && location.hash === "#" + this.state.viewerId) {
      this.open(true);
    }
  }

  /**
   * rootElの要素サイズを返す
   * @return 要素サイズオブジェクト
   */
  private get rootElRect(): PageRect {
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

  private get swiper2pHorizViewConf(): SwiperOptions {
    return {
      direction: "horizontal",
      speed: 200,
      slidesPerView: 2,
      slidesPerGroup: 2,
      spaceBetween: this.state.horizPageMargin,
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
      freeMode: true,
      freeModeMomentumRatio: 0.36,
      freeModeMomentumVelocityRatio: 1,
      freeModeMinimumVelocity: 0.02,
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

  /**
   * オーバーレイ表示を展開させる
   * @param  isDisabledFullscreen trueならば全画面化処理を無効化する
   */
  open(isDisabledFullscreen: boolean = false) {
    const isFullscreen = !isDisabledFullscreen && this.preference.isAutoFullscreen;

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

    this.attachSwiperEvents();

    // キーボードイベントが停止していたならば再開させる
    if (this.swiper.keyboard && !this.swiper.keyboard.enabled) {
      this.swiper.keyboard.enable();
    }

    // 全画面化条件を満たしているなら全画面化
    if (isFullscreen) {
      // 全画面化ハンドラ内部で呼び出されているので
      // this.viewUpdate()は不要
      this.toggleFullscreen();
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
  close() {
    this.hideRootEl();

    // 非表示時はイベントを受付させない
    this.detachSwiperEvents();

    // 閉じていてもキーボード操作を受け付けてしまう不具合対処
    if (this.swiper.keyboard) {
      this.swiper.keyboard.disable();
    }

    // フルスクリーン状態にあるならそれを解除
    if (document.fullscreenElement) {
      this.toggleFullscreen();
    }

    // オーバーレイ下要素のスクロール再開
    this.enableBodyScroll();

    if (this.state.isInstantOpen
      && location.hash
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
      this.cssVar.updateProgressBarWidth();
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
    } else if (e.detail === "isDisabledTapSlidePage") {
      // タップでのページ送りを停止する設定
      if (this.state.isMobile && this.preference.isDisabledTapSlidePage) {
        // モバイル環境で設定値がtrueの際にのみ動作
        this.disablePagination();
      } else {
        this.enablePagination();
      }
    } else if (e.detail === "isDisabledForceHorizView") {
      // LaymicStateの値を書き換え
      this.state.isDisabledForceHorizView = this.preference.isDisabledForceHorizView;
      this.orientationChange();
    }
  }

  /**
   * 各種イベントの登録
   * インスタンス生成時に一度だけ呼び出されることを想定
   */
  private applyEventListeners() {
    this.el.buttons.help.addEventListener("click", () => {
      this.help.show();
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
      this.thumbs.show();
      this.hideViewerUI();
    })

    // サムネイルのクリックイベント
    // 各サムネイルとswiper各スライドとを紐づける
    this.thumbs.thumbEls.forEach((el, i) => el.addEventListener("click", () => {
      this.thumbs.hide();
      this.swiper.slideTo(i);
    }));

    // ズームボタンのクリックイベント
    this.el.buttons.zoom.addEventListener("click", () => {
      if (this.zoom.isZoomed) {
        // ズーム時
        this.zoom.disable();
      } else {
        // 非ズーム時
        const ratio = this.preference.zoomButtonRatio;
        this.zoom.enable(ratio);
      }
      this.hideViewerUI();
    })

    // 全画面化ボタンのクリックイベント
    this.el.buttons.fullscreen.addEventListener("click", () => {
      this.toggleFullscreen()
    });

    // 設定ボタンのクリックイベント
    this.el.buttons.preference.addEventListener("click", () => {
      this.preference.show();
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
        if (this.state.isMobile && this.preference.isDisabledTapSlidePage) {
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
          const activeIdx = this.swiper.activeIndex;
          const idx = (activeIdx !== 0) ? activeIdx - 1 : 0;
          this.swiper.slideTo(idx);
        }
      }));

      if (this.state.isMobile) {
        el.addEventListener("touchstart", e => {
          this.zoom.updatePastDistance(e);
        });

        el.addEventListener("touchmove", rafThrottle(e => {
          // マルチタッチでない場合と全画面状態でない場合は早期リターン
          if (!isMultiTouch(e)) return;

          // フルスクリーン時は自前でのズームを行い、
          // そうでない際は内部のscale値だけ加算させる
          this.zoom.pinchZoom(e);
        }));

        el.addEventListener("touchend", () => {
          // 自前ズームかデバイス側ズームがなされている場合
          // zoomControllerを表出させる

          if (this.zoom.isZoomed) {
            this.zoom.enableController();
            this.hideViewerUI();
          }
        })
      }

    });

    this.el.rootEl.addEventListener("fullscreenchange", () => this.fullscreenChange());

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
   * async関数なので戻り値のpromiseから「swiper最初期化後の処理」を行える
   *
   * @param  swiperConf     初期化時に指定するswiperOption
   * @param  idx            初期化時に指定するindex数値
   * @param  isViewerOpened ビューワーが開いているか否か
   */
  private async reinitSwiperInstance(swiperConf: SwiperOptions, idx?: number, isViewerOpened: boolean = true) {
    // デフォルトではswiper現在インデックス数値か0を指定する
    let initIdx = (this.swiper) ? this.swiper.activeIndex : 0;
    // 引数idxが入力されていれば上書き
    if (idx) initIdx = idx;

    const conf = Object.assign(swiperConf, {
      initialSlide: initIdx
    });

    // swiperインスタンスを一旦破棄してからre-init
    this.swiper.destroy(true, true);
    this.swiper = new Swiper(this.el.swiperEl, conf);

    // ビューワーが開かれている際にのみ動かす処理
    if (isViewerOpened) {
      // イベントを登録
      this.attachSwiperEvents();
      // 表示調整
      this.viewUpdate();
      // lazyload指定
      if (this.swiper.lazy) this.swiper.lazy.load();
    }
  }

  /**
   * 縦読み表示へと切り替える
   * @param isViewerOpened ビューワーが開かれているか否かの状態を指定。falseならば一部処理を呼び出さない
   */
  private enableVerticalView(isViewerOpened: boolean = true) {
    const vertView = this.builder.stateNames.vertView;

    this.state.isVertView = true;
    this.el.rootEl.classList.add(vertView);

    const isFirstSlideEmpty = this.state.isFirstSlideEmpty;

    // 横読み2p解像度、またはモバイル横表示か否かのbool
    const isDS = this.state.isDoubleSlideWidth || this.state.isMobile2pView;

    const activeIdx = this.swiper.activeIndex;

    this.switchSingleSlideState(false);

    // 横読み2p表示を行う解像度であり、
    // 一番目に空要素を入れる設定が有効な場合はindex数値を1減らす
    const idx = (isDS && isFirstSlideEmpty)
      ? activeIdx - 1
      : activeIdx;

    // 読み進めたページ数を引き継ぎつつ再初期化
    this.reinitSwiperInstance(this.swiperVertViewConf, idx, isViewerOpened).then(() => {
      // そのままだと半端なスクロール状態になるので
      // 再度スクロールをかけておく
      this.swiper.slideTo(idx, 0);
    });

  }

  /**
   * 横読み表示へと切り替える
   */
  private disableVerticalView() {
    const vertView = this.builder.stateNames.vertView;
    this.state.isVertView = false;
    this.el.rootEl.classList.remove(vertView);

    const {
      isFirstSlideEmpty,
      isDoubleSlideHorizView: isDSHV,
      isMobile2pView
    } = this.state;

    // emptySlideを追加する前にactiveIndexを取得しておく
    const activeIdx = this.swiper.activeIndex;

    this.switchSingleSlideState(false);

    // 横読み2p表示を行う状態であり、
    // 一番目に空要素を入れる設定が有効な場合はindex数値を1増やす
    const idx = (isDSHV && isFirstSlideEmpty)
      ? activeIdx + 1
      : activeIdx;

    // 読み進めたページ数を引き継ぎつつ再初期化
    // スマホ横持ち対策を暫定的に行っておく
    const conf = (isMobile2pView)
      ? this.swiper2pHorizViewConf
      : this.swiperResponsiveHorizViewConf;
    this.reinitSwiperInstance(conf, idx).then(() => {
      this.swiper.slideTo(idx, 0);
    });

  }

  /**
   * 画面幅に応じて、横読み時の
   * 「1p表示 <-> 2p表示」を切り替える
   * @param isUpdateSwiper swiper.update()を行うか否か
   */
  private switchSingleSlideState(isUpdateSwiper: boolean = true) {
    // swiperが初期化されていないなら早期リターン
    if (!this.swiper) return;

    const rootEl = this.el.rootEl;
    const stateName = this.builder.stateNames.singleSlide;

    if (this.state.isDoubleSlideHorizView) {
      // 横読み時2p表示
      this.addEmptySlide();

      rootEl.classList.remove(stateName);
    } else {
      // 横読み時1p表示
      this.removeEmptySlide()

      rootEl.classList.add(stateName);
    }

    if (isUpdateSwiper) this.swiper.update();
  }

  /**
   * statesの値に応じて空白スライドを追加する
   * isFirstSlideEmpty有効時: 0番空白スライドを追加
   * isAppendEmptySlide有効時: 最終空白スライドを追加
   */
  private addEmptySlide() {
    const {isFirstSlideEmpty, isAppendEmptySlide } = this.state;
    if (this.swiper.slides.length === 0 || !isFirstSlideEmpty && !isAppendEmptySlide) return;
    const emptySlide = this.builder.classNames.emptySlide;

    let isPrependSlide = false;
    let isAppendSlide = false;

    if (isFirstSlideEmpty) {
      const firstSlide: HTMLElement = this.swiper.slides[0];
      const hasFirstEmptySlide = firstSlide.classList.contains(emptySlide);
      if (!hasFirstEmptySlide) {
        isPrependSlide = true;
      }
    }

    const lastIdx = this.swiper.slides.length - 1;
    if (isAppendEmptySlide) {
      const lastSlide: HTMLElement = this.swiper.slides[lastIdx];
      const hasLastEmptySlide = lastSlide.classList.contains(emptySlide);
      if (!hasLastEmptySlide) {
        isAppendSlide = true;
      };
    }

    let adjustNum = 0;
    const currentIdx = this.swiper.activeIndex;
    const isMove = isPrependSlide || isAppendSlide;

    if (isPrependSlide) {
      this.swiper.prependSlide(this.builder.createEmptySlideEl());

      // NOTE: swiperのbreakpoint切り替えが先に行われて
      //       activeIndexが正確に取得出来ない不具合あり
      if (currentIdx !== 0) adjustNum += 2;
    }

    if (isAppendSlide) {
      // 見開き2p表示を考慮した上で、
      // 最終ページが開かれているなら値を足す
      if (lastIdx - currentIdx < 2) adjustNum += 2;
      this.swiper.appendSlide(this.builder.createEmptySlideEl());
    }

    if (isMove) {
      const idx = currentIdx + adjustNum;
      this.swiper.slideTo(idx);
    }
  }

  /**
   * statesの値に応じて空白スライドを消去する
   * isFirstSlideEmpty有効時: 0番空白スライドを消去
   * isAppendEmptySlide有効時: 最終空白スライドを消去
   */
  private removeEmptySlide() {
    const {isFirstSlideEmpty, isAppendEmptySlide } = this.state;
    if (this.swiper.slides.length === 0 || !isFirstSlideEmpty && !isAppendEmptySlide) return;
    const removeIdxs = [];

    const emptySlide = this.builder.classNames.emptySlide;
    const currentIdx = this.swiper.activeIndex;
    let isMove = false;

    if (isFirstSlideEmpty) {
      const firstSlide: HTMLElement = this.swiper.slides[0];
      const hasFirstEmptySlide = firstSlide.classList.contains(emptySlide);
      if (hasFirstEmptySlide) {
        removeIdxs.push(0);
        isMove = true;
      }
    }

    if (isAppendEmptySlide) {
      const lastIdx = this.swiper.slides.length - 1;
      const lastSlide: HTMLElement = this.swiper.slides[lastIdx];
      const hasLastEmptySlide = lastSlide.classList.contains(emptySlide);
      if (hasLastEmptySlide) {
        removeIdxs.push(lastIdx);
      };
    }

    if (removeIdxs.length > 0) {
      this.swiper.removeSlide(removeIdxs);
    }

    // 0番スライドを削除した際のみ動作
    if (isMove) this.swiper.slideTo(currentIdx - 1);
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
    const {l, t, w, h} = this.state.rootRect;
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
   * swiper各種イベントを無効化する
   */
  private detachSwiperEvents() {
    const detachEvents: SwiperCommonEvent[] = [
      "resize",
      "reachBeginning",
      "slideChange"
    ]
    detachEvents.forEach(evName => this.swiper.off(evName));
  }

  /**
   * swiper各種イベントを有効化する
   */
  private attachSwiperEvents() {
    const attachEvents: {
      name: SwiperCommonEvent,
      handler: Function
    }[] = [
      {
        name: "resize",
        handler: this.swiperResizeHandler
      },
      {
        name: "reachBeginning",
        handler: this.swiperReachBeginningHandler,
      },
      {
        name: "slideChange",
        handler: this.swiperSlideChangeHandler,
      }
    ];

    // イベント受け付けを再開させる
    attachEvents.forEach(ev => this.swiper.on(ev.name, ev.handler.bind(this)));
  }

  /**
   * swiper側リサイズイベントに登録するハンドラ
   * open(), close()のタイミングで切り替えるために分離
   */
  private swiperResizeHandler() {
    if (!this.state.isVertView) this.switchSingleSlideState();
    this.viewUpdate();
  }

  /**
   * swiper側reachBeginningイベントに登録するハンドラ
   */
  private swiperReachBeginningHandler() {
    this.changePaginationVisibility()
  }

  /**
   * swiper側slideChangeイベントに登録するハンドラ
   */
  private swiperSlideChangeHandler() {
    this.hideViewerUI();
    this.changePaginationVisibility();
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

    this.state.rootRect = this.rootElRect;
    if (this.cssVar) {
      // フルスクリーン時にjsVhの再計算をしないと
      // rootElのheight値がズレる
      this.cssVar.updateJsVh();

      this.cssVar.updatePageSize();
      this.cssVar.updatePageScaleRatio();
    }

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
  private toggleFullscreen() {
    // フルスクリーン切り替え後に呼び出される関数
    const postToggleFullscreen = () => {
      this.swiper.slideTo(this.swiper.activeIndex);

      this.viewUpdate();
    }

    if (screenfull.isEnabled) {
      screenfull.toggle(this.el.rootEl)
        // フルスクリーン切り替え後処理
        .then(() => postToggleFullscreen());
    }
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
  }

  /**
   * orientationcange eventに登録する処理
   */
  private orientationChange() {
    const { isVertView, isMobile, isMobile2pView } = this.state;

    // PC、または縦読みモード、
    // または強制2p表示が無効化されている場合は早期リターン
    if (!isMobile || isVertView) return;

    if (isMobile2pView) {
      // 横画面処理
      this.reinitSwiperInstance(this.swiper2pHorizViewConf, undefined, false);
    } else {
      // 縦画面処理
      this.reinitSwiperInstance(this.swiperResponsiveHorizViewConf, undefined, false)
    }

    this.switchSingleSlideState(false);

    // 二度viewUpdate()する必要がないように
    // 手動で適用する
    this.attachSwiperEvents();
    this.viewUpdate();
  }

  /**
   * fullscreenchangeイベントに登録する処理
   * もしscreenfullのapiを通さず全画面状態が解除されても、
   * 最低限の見た目だけは整えるために分離
   */
  private fullscreenChange() {
    const fsClass = this.builder.stateNames.fullscreen;

    if (document.fullscreenElement) {
      // 全画面有効時
      this.el.rootEl.classList.add(fsClass);
    } else {
      // 通常時
      this.el.rootEl.classList.remove(fsClass);
    }
  }
}
