import screenfull from "screenfull";
import {
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
import LaymicSlider from "./slider";
import {
  ViewerPages,
  ViewerElements,
  LaymicPages,
  LaymicOptions,
  PreferenceUpdateEventString
} from "../interfaces/index";

export default class Laymic {
  // HTMLElementまとめ
  el: ViewerElements;
  // mangaViewer内部で用いるステートまとめ
  state: LaymicStates = new LaymicStates();
  initOptions: LaymicOptions;
  preference: LaymicPreference;
  thumbs: LaymicThumbnails;
  help: LaymicHelp;
  zoom: LaymicZoom;
  cssVar: LaymicCSSVariables;
  slider: LaymicSlider;
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

    // 一つのページにつき一度だけの処理
    if (this.state.viewerIdx === 0) {
      // svgコンテナは一度だけ追加する
      const svgCtn = builder.createSVGIcons();
      document.body.appendChild(svgCtn);

      // 向き変更イベント自体は一度のみ登録する
      window.addEventListener("orientationchange", () => orientationChangeHandler());
    }

    if (options.pageWidth && options.pageHeight) {
      // ページサイズ数値が指定されていた場合の処理
      const [pw, ph] = [options.pageWidth, options.pageHeight]
      this.state.setPageSize(pw, ph);
    }

    this.preference = new LaymicPreference(builder, rootEl);
    // NOTE: isDisabledForceHorizViewだけ先んじて適用
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

    // 開始スライドへの空白追加設定の場合はページ数+1で数える
    const pagesLen = (this.state.isFirstSlideEmpty)
    ? pages.length + 1
    : pages.length;
    if (options.isAppendEmptySlide === false || !(pagesLen % 2)) {
      // 最終スライドへの空白追加
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

    // swiper管理クラスの追加
    this.slider = new LaymicSlider(this.el, this.builder, this.state);

    // ビューワー方向の初期値が縦読みの場合はそれを表示
    if (options.viewerDirection === "vertical") this.slider.enableVerticalView(false)

    // 各種イベントの登録
    this.applyEventListeners();

    // location.hashにmangaViewerIdと同値が指定されている場合は
    // 即座に開く
    if (this.state.isInstantOpen && location.hash === "#" + this.state.viewerId) {
      this.open(true);
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
        this.slider.switchSingleSlideState();
      })
    };

    // preferenceかinitOptionの値を適用する
    this.preference.applyPreferenceValues();

    this.slider.attachSwiperEvents();

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
    if (this.state.isVertView && this.slider.activeIdx === 0) {
      this.slider.loadLazyImgs()
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
    this.slider.detachSwiperEvents();

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
      this.slider.orientationChange();
    }
  }

  /**
   * 各種イベントの登録
   * インスタンス生成時に一度だけ呼び出されることを想定
   */
  private applyEventListeners() {
    this.el.buttons.help.addEventListener("click", () => {
      this.help.show();
      this.slider.hideViewerUI();
    })

    // 縦読み/横読み切り替えボタン
    this.el.buttons.direction.addEventListener("click", () => {
      this.slider.toggleVerticalView();
    });

    // サムネイル表示ボタン
    this.el.buttons.thumbs.addEventListener("click", () => {
      this.thumbs.show();
      this.slider.hideViewerUI();
    })

    // サムネイルのクリックイベント
    // 各サムネイルとswiper各スライドとを紐づける
    this.thumbs.thumbEls.forEach((el, i) => el.addEventListener("click", () => {
      this.thumbs.hide();
      this.slider.slideTo(i);
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
      this.slider.hideViewerUI();
    })

    // 全画面化ボタンのクリックイベント
    this.el.buttons.fullscreen.addEventListener("click", () => {
      this.toggleFullscreen()
    });

    // 設定ボタンのクリックイベント
    this.el.buttons.preference.addEventListener("click", () => {
      this.preference.show();
      // UIを閉じておく
      this.slider.hideViewerUI();
    })

    // オーバーレイ終了ボタンのクリックイベント
    this.el.buttons.close.addEventListener("click", () => {
      this.close();
    });

    this.el.buttons.nextPage.addEventListener("click", () => {
      this.slider.slideNext();
    });

    this.el.buttons.prevPage.addEventListener("click", () => {
      this.slider.slidePrev();
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
          this.slider.toggleViewerUI();
        } else {
          this.slider.slideClickHandler(e);
        }
      })

      // マウス操作時のイベント
      el.addEventListener("mousemove", rafThrottle(e => {
        this.slider.slideMouseHoverHandler(e);
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
          this.slider.slideNext();
        } else if (isPrev) {
          // 戻る
          this.slider.slidePrev();
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
            this.slider.hideViewerUI();
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

    this.el.rootEl.addEventListener("LaymicViewUpdate", rafThrottle(() => {
      // "LaymicViewUpdate" eventが発火した際には
      // viewUpdate()関数を呼び出す
      this.viewUpdate();
    }))

    // orientationchangeイベント登録
    orientationChangeFuncs.push(this.slider.orientationChange.bind(this.slider));
  }

  /**
   * mangaViewer表示を更新する
   * 主にswiperの表示を更新するための関数
   */
  private viewUpdate() {
    if (this.el) this.updateRootElRect();

    if (this.cssVar) {
      // フルスクリーン時にjsVhの再計算をしないと
      // rootElのheight値がズレる
      this.cssVar.updateJsVh();

      this.cssVar.updatePageSize();
      this.cssVar.updatePageScaleRatio();
    }

    if (this.thumbs) this.thumbs.cssThumbsWrapperWidthUpdate(this.el.rootEl);

    if (this.zoom) this.zoom.updateZoomRect();

    if (this.slider.swiper) this.slider.swiper.update();
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
      this.slider.slideTo(this.slider.activeIdx);

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

  /**
   * state内のrootElの要素サイズを更新する
   */
  private updateRootElRect() {
    const {
      height: h,
      width: w,
      left: l,
      top: t,
    } = this.el.rootEl.getBoundingClientRect();
    this.state.rootRect = {
      w,
      h,
      l,
      t
    }
  }
}
