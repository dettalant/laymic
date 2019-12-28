import { SwiperOptions, CommonEvent as SwiperCommonEvent } from "swiper";
import { Swiper, Pagination, Lazy } from "swiper/js/swiper.esm";
Swiper.use([Pagination, Lazy]);

import LaymicStates from "./states";
import LaymicPreference from "./preference";
import LaymicZoom from "./zoom";

import {
  ViewerElements,
  SwiperViewType,
} from "../interfaces/index";
import DOMBuilder from "./builder";

import { rafSleep, isMultiTouch } from "../utils";

export default class LaymicSlider {
  // 現在のviewType文字列
  viewType: SwiperViewType = "horizontal2p";
  swiper: Swiper;
  readonly el: ViewerElements;
  readonly state: LaymicStates;
  readonly builder: DOMBuilder;
  readonly preference: LaymicPreference;
  readonly zoom: LaymicZoom;
  private _isViewerUIActive = false;

  constructor(
    el: ViewerElements,
    builder: DOMBuilder,
    states: LaymicStates,
    preference: LaymicPreference,
    zoom: LaymicZoom
  ) {
    this.el = el;
    this.builder = builder;
    this.state = states;
    this.preference = preference;
    this.zoom = zoom;

    // 強制2p表示する条件が揃っていれば2p表示で初期化する
    const conf = (this.state.isDoubleSlideHorizView)
      ? this.swiper2pHorizViewConf
      : this.swiper1pHorizViewConf;

    this.swiper = new Swiper(this.el.swiperEl, conf);
  }

  /**
   * ビューワー操作UIが現在表示されているかのboolを返す
   * @return ビューワー操作UIが表示されているならtrue
   */
  get isViewerUIActive(): boolean {
    return this._isViewerUIActive;
  }

  /**
   * 現在表示中のページ数を表示する
   * @return swiper.activeIndexを返す
   */
  get activeIdx(): number {
    return this.swiper.activeIndex;
  }

  /**
   * 横読み1p表示にて用いる設定値
   * @return SwiperOptions
   */
  private get swiper1pHorizViewConf(): SwiperOptions {
    return {
      direction: "horizontal",
      speed: 200,
      slidesPerView: 1,
      slidesPerGroup: 1,
      spaceBetween: this.state.horizPageMargin,
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
   * 横読み2p表示にて用いる設定値
   * @return SwiperOptions
   */
  private get swiper2pHorizViewConf(): SwiperOptions {
    const conf = this.swiper1pHorizViewConf;
    const patch: SwiperOptions = {
      slidesPerView: 2,
      slidesPerGroup: 2
    }
    return Object.assign(conf, patch);
  }

  /**
   * 縦読み表示にて用いる設定値
   * @return SwiperOptions
   */
  private get swiperVertViewConf(): SwiperOptions {
    const conf = this.swiper1pHorizViewConf;
    const patch: SwiperOptions = {
      direction: "vertical",
      spaceBetween: this.state.vertPageMargin,
      freeMode: true,
      freeModeMomentumRatio: 0.36,
      freeModeMomentumVelocityRatio: 1,
      freeModeMinimumVelocity: 0.02,
    }
    return Object.assign(conf, patch);
  }

  /**
   * 縦読み/横読み表示のトグル切り替えを行う
   * 同時にビューワーUIを隠し、rootElへとフォーカスを移す
   */
  toggleVerticalView() {
    if (!this.state.isVertView) {
      this.enableVerticalView()
    } else {
      this.disableVerticalView()
    }
    // 縦読み/横読みトグル時にはビューワーUIを隠す
    // 同時にrootElへとフォーカスを移す
    this.hideViewerUI(true);
  }

  /**
   * 縦読み表示へと切り替える
   * @param isViewerOpened ビューワーが開かれているか否かの状態を指定。falseならば一部処理を呼び出さない
   */
  enableVerticalView(isViewerOpened: boolean = true) {
    const vertView = this.builder.stateNames.vertView;

    this.state.isVertView = true;
    this.el.rootEl.classList.add(vertView);

    const isFirstSlideEmpty = this.state.isFirstSlideEmpty;

    // 横読み2p解像度、またはモバイル横表示か否かのbool
    const isDS = this.state.isDoubleSlideWidth || this.state.isMobile2pView;

    const activeIdx = this.swiper.activeIndex;

    // 横読み2p表示を行う解像度であり、
    // 一番目に空要素を入れる設定が有効な場合はindex数値を1減らす
    const idx = (isDS && isFirstSlideEmpty)
      ? activeIdx - 1
      : activeIdx;

    this.switchSingleSlideState(false);

    // 読み進めたページ数を引き継ぎつつ再初期化
    this.reinitSwiperInstance(this.swiperVertViewConf, idx, isViewerOpened)
      // ごく僅かな期間のスリープを行う
      .then(() => rafSleep())
      .then(() => {
        // そのままだと半端なスクロール状態になるので
        // 再度スクロールをかけておく
        this.slideTo(idx, 0);
      });
  }

  /**
   * 横読み表示へと切り替える
   */
  disableVerticalView() {
    const vertView = this.builder.stateNames.vertView;
    this.state.isVertView = false;
    this.el.rootEl.classList.remove(vertView);

    const {
      isFirstSlideEmpty,
      isDoubleSlideHorizView: isDSHV,
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
    const conf = (isDSHV)
      ? this.swiper2pHorizViewConf
      : this.swiper1pHorizViewConf;
    this.reinitSwiperInstance(conf, idx)
      .then(() => rafSleep())
      .then(() => {
        this.swiper.slideTo(idx, 0);
      });
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

    // viewTypeの更新
    this.updateViewType();

    // ビューワーが開かれている際にのみ動かす処理
    if (isViewerOpened) {
      // イベントを登録
      this.attachSwiperEvents();
      // lazyload指定
      this.forceLoadLazyImgs();
      // 表示調整イベント発火
      this.dispatchViewUpdate();
    }
  }

  /**
   * 横読みビューワーでの2p/1p表示切り替えを行う
   */
  private switchHorizViewSize() {
    const {
      isVertView,
      isFirstSlideEmpty,
      isDoubleSlideHorizView: isDSHV
    } = this.state;

    // すでに表示切り替え済みの場合はスキップ
    const isSkip = isDSHV && this.viewType === "horizontal2p" || !isDSHV && this.viewType === "horizontal1p";

    // 縦読みモード、
    // またはスキップ条件を満たしている場合は早期リターン
    if (isVertView || isSkip) return;

    let idx = this.activeIdx;
    if (isDSHV && isFirstSlideEmpty) {
      idx += 1;
    } else if (isFirstSlideEmpty && idx > 0) {
      idx -= 1;
    }

    this.switchSingleSlideState(false);

    const conf = (isDSHV)
      ? this.swiper2pHorizViewConf
      : this.swiper1pHorizViewConf;

    this.reinitSwiperInstance(conf, idx).then(() => {
      this.dispatchViewUpdate();
    });
  }

  /**
   * 画面幅に応じて、横読み時の
   * 「1p表示 <-> 2p表示」を切り替える
   * @param  isUpdateSwiper swiper.update()を行うか否か
   */
  switchSingleSlideState(isUpdateSwiper: boolean = true) {
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
   * mangaViewer画面をクリックした際のイベントハンドラ
   *
   * クリック判定基準についてはgetClickPoint()を参照のこと
   *
   * @param  e MouseEvent
   */
  private slideClickHandler(e: MouseEvent) {
    const [isNextClick, isPrevClick] = this.getClickPoint(e);

    if (isNextClick && !this.swiper.isEnd) {
      // 進めるページがある状態で進む側をクリックした際の処理
      this.slideNext();
      this.hideViewerUI();
    } else if (isPrevClick && !this.swiper.isBeginning) {
      // 戻れるページがある状態で戻る側をクリックした際の処理
      this.slidePrev();
      this.hideViewerUI();
    } else {
      this.toggleViewerUI();
    }
  }

  /**
   * スライダー部分のクリックハンドラ
   * swiperElとcontrollerEl両方にこのハンドラが用いられる
   * @param  e MouseEvent
   */
  sliderClickHandler(e: MouseEvent) {
    if (this.state.isMobile && this.preference.isDisabledTapSlidePage) {
      // モバイルブラウザでのタップページ送り無効化設定時は
      // viewerUIのトグルだけ行う
      this.toggleViewerUI();
    } else {
      this.slideClickHandler(e);
    }
  }

  /**
   * クリックポイント上にマウス座標が重なっていたならマウスホバー処理を行う
   * @param  e MouseEvent
   */
  sliderMouseMoveHandler(e: MouseEvent) {
    const [isNextClick, isPrevClick] = this.getClickPoint(e);
    const {nextPage, prevPage} = this.el.buttons;
    const active = this.builder.stateNames.active;
    const {controllerEl, swiperEl} = this.el;

    /**
     * swiperElとcontrollerElにおける
     * カーソル状態を一括設定する
     * @param  isPointer trueならばポインターが乗っかっている状態とみなす
     */
    const setCursorStyle = (isPointer: boolean) => {
      const cursor = (isPointer) ? "pointer" : "";
      controllerEl.style.cursor = cursor
      swiperEl.style.cursor = cursor;
    }

    let isCursorPointer = true;
    if (isNextClick && !this.swiper.isEnd) {
      // 進めるページがある状態で進む側クリックポイントと重なった際の処理
      nextPage.classList.add(active);
    } else if (isPrevClick && !this.swiper.isBeginning) {
      // 戻れるページがある状態で戻る側クリックポイントと重なった際の処理
      prevPage.classList.add(active);
    } else {
      // どちらでもない場合の処理
      nextPage.classList.remove(active);
      prevPage.classList.remove(active);
      isCursorPointer = false;
    }
    setCursorStyle(isCursorPointer);
  }

  /**
   * スライダー部分でのマウスホイール操作ハンドラ
   * @param  e WheelEvent
   */
  sliderWheelHandler(e: WheelEvent) {
    const mainModeHandler = (e: WheelEvent) => {
      const dx = e.deltaX;
      const dy = e.deltaY;
      const isLTR = this.state.isLTR;
      // 上下ホイール判定
      // || RTL時の左右ホイール判定
      // || LTR時の左右ホイール判定
      const isNext = dy > 0
        || !isLTR && dx < 0
        || isLTR && dx > 0;
      const isPrev = dy < 0
        || !isLTR && dx > 0
        || isLTR && dx < 0;

      if (isNext) {
        // 進む
        this.slideNext();
      } else if (isPrev) {
        // 戻る
        this.slidePrev();
      }
    }

    const zoomModeHandler = (e: WheelEvent) => {
      const dx = e.deltaX;
      const dy = e.deltaY;
      const isShift = e.shiftKey;
      const isLTR = this.state.isLTR;

      const isHorizSpin = dx !== 0;
      const isVertSpin = dy !== 0;
      const isDown = dy > 0;
      const isRight = dx > 0;
      let direction: "up" | "down" | "right" | "left" | "" = "";

      if (isShift) {
        // shift + ホイール時は上下ホイールで左右移動、
        // 左右ホイールで上下移動と
        // あべこべ操作にする
        if (isLTR && isHorizSpin) {
          direction = (isRight)
            ? "down"
            : "up";
        } else if (isHorizSpin) {
          direction = (isRight)
            ? "up"
            : "down";
        }

        if (isLTR && isVertSpin) {
          // LTR時
          direction = (isDown)
            ? "right"
            : "left";
        } else if (isVertSpin) {
          // RTL(通常)時
          direction = (isDown)
            ? "left"
            : "right";
        }
      } else {
        // 通常
        if (isHorizSpin) direction = (isRight)
          ? "right"
          : "left";

        if (isVertSpin) direction = (isDown)
          ? "down"
          : "up";
      }

      switch (direction) {
        case "up":
          this.zoom.scrollUp();
          break;
        case "down":
          this.zoom.scrollDown();
          break;
        case "left":
          this.zoom.scrollLeft();
          break;
        case "right":
          this.zoom.scrollRight();
          break;
      }
    }

    if (this.zoom.isZoomed) {
      zoomModeHandler(e);
    } else {
      mainModeHandler(e);
    }
  }

  /**
   * スライダー部分でのTouchStartハンドラ
   * @param  e TouchEvent
   */
  sliderTouchStartHandler(e: TouchEvent) {
    this.zoom.updatePastDistance(e);
  }

  /**
   * スライダー部分でのTouchMoveハンドラ
   * @param  e TouchEvent
   */
  sliderTouchMoveHandler(e: TouchEvent) {
    // マルチタッチでない場合と全画面状態でない場合は早期リターン
    if (!isMultiTouch(e)) return;

    // フルスクリーン時は自前でのズームを行い、
    // そうでない際は内部のscale値だけ加算させる
    this.zoom.pinchZoom(e);
  }

  /**
   * スライダー部分でのTouchEndハンドラ
   */
  sliderTouchEndHandler() {
    // 自前ズームかデバイス側ズームがなされている場合
    // zoomControllerを表出させる

    if (this.zoom.isZoomed) {
      this.zoom.enableController();
      this.hideViewerUI();
    }
  }

  /**
   * 進捗バー部分でのClickハンドラ
   * @param  e MouseEvent
   */
  progressbarClickHandler(e: MouseEvent) {
    const {isLTR, isVertView} = this.state;
    const max = (isVertView)
      ? window.innerHeight
      : window.innerWidth;
    // クリックされた場所を正規化して取得
    // 縦読み時はe.clientYの値を、
    // 通常横読み時はinnerWidthで反転させたe.clientXを
    // LTR横読み時はe.clientXの値を用いる
    let p = (isVertView)
      ? e.clientY
      : max - e.clientX;
    if (isLTR) p = e.clientX;

    const pageLen = this.swiper.slides.length;
    const idx = Math.floor(p / (max / pageLen));

    this.slideTo(idx);
  }

  /**
   * orientationcange eventに登録する処理
   */
  orientationChange() {
    const { isVertView, isMobile } = this.state;

    // PC、または縦読みモード、
    // または強制2p表示が無効化されている場合は早期リターン
    if (!isMobile || isVertView) return;

    this.switchHorizViewSize();
  }

  slideTo(idx: number, speed?: number) {
    this.swiper.slideTo(idx, speed);
  }

  /**
   * swiper各種イベントを無効化する
   */
  detachSwiperEvents() {
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
  attachSwiperEvents() {
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
   * ビューワー操作UIをトグルさせる
   * @param isMoveFocus trueであればrootElへとフォーカスを移す
   */
  toggleViewerUI(isMoveFocus: boolean = false) {
    if (this.isViewerUIActive) {
      this.hideViewerUI(isMoveFocus);
    } else {
      this.showViewerUI();
    }
  }

  /**
   * ビューワー操作UIを表示する
   */
  showViewerUI() {
    const stateName = this.builder.stateNames.visibleUI;
    this.el.rootEl.classList.add(stateName);
    this._isViewerUIActive = true;
  }

  /**
   * ビューワー操作UIを非表示化する
   * @param isMoveFocus trueであればrootElへとフォーカスを移す
   */
  hideViewerUI(isMoveFocus: boolean = false) {
    const stateName = this.builder.stateNames.visibleUI;
    this.el.rootEl.classList.remove(stateName);
    this._isViewerUIActive = false;

    // isMoveFocusがtrueの際、
    // viewerUIを隠すと同時にrootElへとフォーカスを戻す
    if (isMoveFocus) this.el.rootEl.focus()
  }

  /**
   * swiper内画像をlazyloadする
   */
  loadLazyImgs() {
    if (this.swiper.lazy) {
      this.swiper.lazy.load();
    }
  }

  /**
   * 一つ前のスライドを表示する
   *
   * swiper.slidePrev()には
   * 特定状況下で0番スライドに巻き戻る不具合が
   * 存在するようなので、slideTo()を用いて手動で動かしている
   *
   * @param  speed アニメーション速度
   */
  slidePrev(speed?: number) {
    const idx = this.activeIdx;
    const prevIdx = (idx > 0) ? idx - 1 : 0;
    this.swiper.slideTo(prevIdx, speed);
  }

  /**
   * 一つ次のスライドを表示する
   * @param  speed アニメーション速度
   */
  slideNext(speed?: number) {
    this.swiper.slideNext(speed);
  }

  /**
  * viewType文字列を更新する。
  * 更新タイミングを手動で操作して、viewer状態評価を遅延させる
  */
  private updateViewType() {
    const {isDoubleSlideHorizView: isDSHV, isVertView} = this.state;

    let viewType: SwiperViewType = (isDSHV)
    ? "horizontal2p"
    : "horizontal1p";
    if (isVertView) viewType = "vertical";

    this.viewType = viewType;
  }

  /**
   * viewUpdate()を呼び出すイベントを発火させる
   */
  private dispatchViewUpdate() {
    const ev = new CustomEvent("LaymicViewUpdate");

    this.el.rootEl.dispatchEvent(ev);
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

    if (isPrependSlide) {
      this.swiper.prependSlide(this.builder.createEmptySlideEl());
    }

    if (isAppendSlide) {
      this.swiper.appendSlide(this.builder.createEmptySlideEl());
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

    if (isFirstSlideEmpty) {
      const firstSlide: HTMLElement = this.swiper.slides[0];
      const hasFirstEmptySlide = firstSlide.classList.contains(emptySlide);
      if (hasFirstEmptySlide) removeIdxs.push(0);
    }

    if (isAppendEmptySlide) {
      const lastIdx = this.swiper.slides.length - 1;
      const lastSlide: HTMLElement = this.swiper.slides[lastIdx];
      const hasLastEmptySlide = lastSlide.classList.contains(emptySlide);
      if (hasLastEmptySlide) removeIdxs.push(lastIdx);
    }

    if (removeIdxs.length > 0) {
      this.swiper.removeSlide(removeIdxs);
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
   * swiper側リサイズイベントに登録するハンドラ
   * open(), close()のタイミングで切り替えるために分離
   */
  private swiperResizeHandler() {
    if (!this.state.isVertView) {
      this.switchHorizViewSize();
    }

    this.dispatchViewUpdate();
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
   * 画像読み込み中にswiper.lazy.load()を呼び出した際に
   * 画像読み込み中のまま止まるバグを回避するための関数
   *
   * lazyloading中を示すクラス名を
   * 一旦削除してから読み込み直す
   */
  private forceLoadLazyImgs() {
    if (!this.swiper.lazy) return;

    const loadingClassName = "swiper-lazy-loading"
    const loadingImgs = this.swiper.wrapperEl.getElementsByClassName(loadingClassName);

    Array.from(loadingImgs).forEach(img => img.classList.remove(loadingClassName));

    this.swiper.lazy.load();
  }
}
