import Swiper, { SwiperOptions } from "swiper";
import screenfull from "screenfull";
import { calcGCD, viewerCnt, sleep, readImage, isExistTouchEvent, isExistPointerEvent } from "./utils";
import { ViewerDOMBuilder } from "./builder";
import {
  MangaViewerPages,
  MangaViewerElements,
  MangaViewerOptions,
  MangaViewerStates,
  PageRect
} from "./interfaces";

export default class MangaViewer {
  // HTMLElementまとめ
  el: MangaViewerElements;
  // mangaViewer内部で用いるステートまとめ
  state: MangaViewerStates = this.defaultMangaViewerStates;
  // swiper instance
  swiper: Swiper;

  constructor(queryStr: string, pages: MangaViewerPages | string, options: MangaViewerOptions = {}) {
    const rootEl = document.querySelector(queryStr);

    if (!(rootEl instanceof HTMLElement)) throw new Error("rootElの取得に失敗");
    if (rootEl.parentNode) rootEl.parentNode.removeChild(rootEl);
    rootEl.style.display = "none";

    const builder = new ViewerDOMBuilder(options.icons);

    if (this.state.viewerId === 0) {
      // 一つのページにつき一度だけの処理
      const svgCtn = builder.createSVGIcons();
      document.body.appendChild(svgCtn);
    }

    const parseHtmlElement = (queryStr: string): (string | HTMLElement)[] => {
      const baseEl = document.querySelector(queryStr);
      if (!baseEl) throw new Error("pages引数のquery stringが不正");

      const result = Array.from(baseEl.children).map(el => (el instanceof HTMLImageElement) ? el.dataset.src || el.src : el as HTMLElement);
      return result;
    }

    if (typeof pages === "string") {
      pages = parseHtmlElement(pages);
    }

    if (options.pageWidth && options.pageHeight) {
      const [pw, ph] = [options.pageWidth, options.pageHeight]
      const gcd = calcGCD(pw, ph);

      this.state.pageSize = {
        w: pw,
        h: ph
      };
      this.state.pageAspect = {
        w: pw / gcd,
        h: ph / gcd,
      }
    } else {
      // pageSizeが未設定の場合、一枚目画像の縦横幅からアスペクト比を計算する
      const getBeginningSrc = (pages: (string | HTMLElement)[]): string => {
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
      this.setPageSizeFromImgPath(src);
    }

    // 省略表記だとバグが起きそうなので
    // undefinedでないかだけ確認する
    if (options.isLTR !== void 0) this.state.isLTR = options.isLTR;
    if (options.vertPageMargin !== void 0) this.state.vertPageMargin = options.vertPageMargin;
    if (options.horizPageMargin !== void 0) this.state.horizPageMargin = options.horizPageMargin;
    if (options.isFirstSlideEmpty !== void 0) this.state.isFirstSlideEmpty = options.isFirstSlideEmpty;

    rootEl.classList.add("mangaViewer_root", "is_ui_visible");
    rootEl.style.setProperty("--viewer-padding", this.state.viewerPadding + "px");

    const [controllerEl, uiButtons] = builder.createViewerController(this.mangaViewerControllerId);
    const swiperEl = builder.createSwiperContainer(
      this.mangaViewerId,
      "mangaViewer_mainGallery",
      pages,
      this.state.isLTR,
      this.state.isFirstSlideEmpty
    );
    const [thumbsEl, thumbsWrapperEl] = builder.createThumbnailsEl("mangaViewer_thumbs", pages);
    thumbsWrapperEl.style.setProperty("--thumb-item-width", this.state.thumbItemWidth + "px");
    thumbsWrapperEl.style.setProperty("--thumb-item-gap", this.state.thumbItemGap + "px");
    thumbsWrapperEl.style.setProperty("--thumbs-wrapper-padding", this.state.thumbsWrapperPadding + "px");

    const [preferenceEl, preferenceWrapperEl] = builder.createPreferenceEl("mangaViewer_preference");

    [
      controllerEl,
      swiperEl,
      thumbsEl,
      preferenceEl
    ].forEach(el => rootEl.appendChild(el));

    this.el = {
      rootEl,
      swiperEl,
      thumbsEl,
      thumbsWrapperEl,
      preferenceEl,
      preferenceWrapperEl,
      controllerEl,
      buttons: uiButtons,
    }

    this.close();

    // 一旦DOMから外していたroot要素を再度放り込む
    document.body.appendChild(this.el.rootEl);

    // サイズ設定の初期化
    this.viewUpdate();

    this.swiper = new Swiper(this.el.swiperEl, this.mainSwiperHorizViewConf);

    // 各種イベント登録

    // タッチ操作可能なデバイスではスキップする処理
    if (!this.state.isTouchEvent) {
      // 画面端のswiperElでない余白部分にもクリック判定をつける
      this.el.controllerEl.addEventListener(this.deviceClickEvent, (e) => this.slideClickHandler(e));

      // UIクリック時にcontrollerElへとクリックイベントが伝播しないようにする
      Array.from(this.el.controllerEl.children).forEach(el => el.addEventListener(this.deviceClickEvent, (e) => e.stopPropagation()));
    }

    // 縦読み/横読み切り替えボタン
    this.el.buttons.direction.addEventListener(this.deviceClickEvent, () => {
      if (!this.state.isVertView) {
        this.enableVerticalView()
      } else {
        this.disableVerticalView()
      }
    });

    // サムネイル表示ボタン
    this.el.buttons.thumbs.addEventListener(this.deviceClickEvent, () => {
      const revealImgs = (el: HTMLElement) => {
        const imgs = el.getElementsByClassName("mangaViewer_lazyload");
        Array.from(imgs).forEach(el => {

          if (!(el instanceof HTMLImageElement)) {
            return;
          }

          const s = el.dataset.src;
          if (s) {
            el.classList.remove("mangaViewer_lazyload");
            el.classList.add("mangaViewer_lazyloading");
            el.addEventListener("load", () => {
              el.classList.remove("mangaViewer_lazyloading");
              el.classList.add("mangaViewer_lazyloaded");
            })

            el.src = s;
          }
        })
      }

      if (this.el.thumbsEl.style.display === "none") {
        // ページ読み込み後一度だけ動作する
        this.el.thumbsEl.style.display = "";
        revealImgs(this.el.thumbsEl);
      }
      this.el.rootEl.classList.add("is_showThumbs");

      this.hideViewerUI();
    })

    // サムネイル表示中オーバーレイ要素でのクリックイベント
    this.el.thumbsEl.addEventListener(this.deviceClickEvent, () => {
      this.el.rootEl.classList.remove("is_showThumbs");
    })

    // サムネイル表示中のサムネイル格納コンテナのクリックイベント
    this.el.thumbsWrapperEl.addEventListener(this.deviceClickEvent, (e) => {
      // ユーザビリティのためオーバーレイでも画像でもない部分をクリックした際に
      // 何も起きないようにする
      e.stopPropagation();
    });

    // サムネイルのクリックイベント
    // 各サムネイルとswiper各スライドとを紐づける
    Array.from(this.el.thumbsWrapperEl.children).forEach((el, i) => el.addEventListener(this.deviceClickEvent, () => {
      this.swiper.slideTo(i);
      this.el.rootEl.classList.remove("is_showThumbs");
    }));

    this.el.preferenceEl.addEventListener(this.deviceClickEvent, () => {
      this.el.rootEl.classList.remove("is_showPreference");
    })

    // 全画面化ボタンのクリックイベント
    this.el.buttons.fullscreen.addEventListener(this.deviceClickEvent, () => this.fullscreenHandler());

    // 設定ボタンのクリックイベント
    this.el.buttons.preference.addEventListener(this.deviceClickEvent, () => {
      this.el.rootEl.classList.toggle("is_showPreference");
      // NOTE: 暫定でUIを閉じておく
      this.hideViewerUI();
    })

    // オーバーレイ終了ボタンのクリックイベント
    this.el.buttons.close.addEventListener(this.deviceClickEvent, () => {
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
      isFirstSlideEmpty: false,
      vertPageMargin: 10,
      horizPageMargin: 0,
      thumbItemWidth: 96,
      thumbItemGap: 16,
      thumbsWrapperPadding: 16,
      isTouchEvent: isExistTouchEvent(),
      isPointerEvent: isExistPointerEvent(),
    }
  }
  private get mainSwiperHorizViewConf(): SwiperOptions {
    return {
      direction: "horizontal",
      speed: 200,
      slidesPerView: 2,
      slidesPerGroup: 2,
      spaceBetween: this.state.horizPageMargin,

      on: {
        resize: () => this.viewUpdate(),
        sliderMove: () => this.hideViewerUI(),
        tap: (e) => !this.state.isTouchEvent && this.slideClickHandler(e),
      },

      keyboard: true,
      mousewheel: true,
      preloadImages: false,
      lazy: {
        loadPrevNext: true,
        loadPrevNextAmount: 4,
      },
    }
  }

  private get mainSwiperVertViewConf(): SwiperOptions {
    return {
      direction: "vertical",
      spaceBetween: this.state.vertPageMargin,
      speed: 200,
      mousewheel: true,
      keyboard: true,
      freeMode: true,
      freeModeMomentumRatio: 0.36,
      freeModeMomentumVelocityRatio: 1,
      freeModeMinimumVelocity: 0.02,
      on: {
        resize: () => this.viewUpdate(),
        sliderMove: () => this.hideViewerUI(),
        tap: (e) => !this.state.isTouchEvent && this.slideClickHandler(e),
      },
      preloadImages: false,
      lazy: {
        loadPrevNext: true,
        loadPrevNextAmount: 4,
      },
    }
  }

  private get deviceClickEvent(): "pointerup" | "click" {
    return (this.state.isPointerEvent) ? "pointerup" : "click"
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
      this.fullscreenHandler();
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
      this.fullscreenHandler();
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
    this.el.rootEl.classList.remove("is_vertView");

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
   * mangaViewer画面をクリックした際のイベントハンドラ
   *
   * 横読み時   : 左側クリックで進む、右側クリックで戻る
   * 横読みLTR時: 右側クリックで進む、左側クリックで戻る
   * 縦読み時   : 下側クリックで進む、上側クリックで戻る
   *
   * @param  e pointer-up event
   */
  private slideClickHandler(e: PointerEvent | MouseEvent) {
    const {
      left: l,
      top: t,
      width: w,
      height: h,
    } = this.el.swiperEl.getBoundingClientRect()

    const [x, y] = [e.pageX - l, e.pageY - t]

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

  private hideViewerUI() {
    this.el.rootEl.classList.remove("is_ui_visible");
  }

  /**
   * mangaViewer表示を更新する
   * 主にswiperの表示を更新するための関数
   */
  private viewUpdate() {
    this.state.swiperRect = this.swiperElRect;
    this.cssPageWidthUpdate();
    this.cssThumbsWrapperWidthUpdate();

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
   * thumbsWrapperElのwidthを計算し、
   * 折り返しが発生しないようなら横幅の値を書き換える
   *
   * TODO: 今はいろいろと数値設定を直書きにしてるので、これらを変数から活用できるようにしたい
   */
  private cssThumbsWrapperWidthUpdate() {
    const {offsetWidth: ow} = this.el.rootEl;
    // thumb item offset width
    const tW = this.state.thumbItemWidth;
    // thumbs length
    const tLen = this.el.thumbsWrapperEl.children.length;
    // thumbs grid gap
    const tGaps = this.state.thumbItemGap * (tLen - 1);
    // thumbs wrapper padding
    const tWPadding = this.state.thumbsWrapperPadding * 2;

    const thumbsWrapperWidth = tW * tLen + tGaps + tWPadding;
    const widthStyleStr = (ow * 0.9 > thumbsWrapperWidth)
      ? thumbsWrapperWidth + "px"
      : "";
    this.el.thumbsWrapperEl.style.width = widthStyleStr;
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
