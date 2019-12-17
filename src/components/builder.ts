import {
  ViewerPages,
  ViewerIcons,
  ViewerUIButtons,
  IconData,
  LaymicClassNames,
  LaymicStateClassNames
} from "../interfaces/index";
import { setRole } from "../utils";

// svg namespace
const SVG_NS = "http://www.w3.org/2000/svg";
// svg xlink namespace
const SVG_XLINK_NS = "http://www.w3.org/1999/xlink";

// mangaViewerで用いるDOMを生成するやつ
export default class DOMBuilder {
  // 使用するアイコンセット
  icons: ViewerIcons = this.defaultMangaViewerIcons;
  readonly classNames = this.defaultLaymicClassNames;
  readonly stateNames = this.defaultLaymicStateClassNames;
  constructor(
    icons?: Partial<ViewerIcons>,
    classNames?: Partial<LaymicClassNames>,
    stateNames?: Partial<LaymicStateClassNames>
  ) {
    if (icons) this.icons = Object.assign(this.icons, icons);
    if (classNames) this.classNames = Object.assign(this.classNames, classNames);
    if (stateNames) this.stateNames = Object.assign(this.stateNames, stateNames);
  }

  private get defaultLaymicClassNames(): LaymicClassNames {
    return {
      root: "laymic_root",
      slider: "laymic_slider",
      // uiボタンクラス名
      uiButton: "laymic_uiButton",
      // 空スライドクラス名
      emptySlide: "laymic_emptySlide",
      pagination: "laymic_pagination",
      controller: {
        controller: "laymic_controller",
        controllerTop: "laymic_controllerTop",
        controllerBottom: "laymic_controllerBottom",
        progressbar: "laymic_progressbar",
      },
      buttons: {
        direction: "laymic_direction",
        fullscreen: "laymic_fullscreen",
        thumbs: "laymic_showThumbs",
        preference: "laymic_showPreference",
        close: "laymic_close",
        help: "laymic_showHelp",
        nextPage: "laymic_paginationNext",
        prevPage: "laymic_paginationPrev",
        zoom: "laymic_zoom",
      },
      svg: {
        icon: "laymic_svgIcon",
        defaultProp: "laymic_svgDefaultProp",
        container: "laymic_svgContainer",
      },
      checkbox: {
        container: "laymic_checkbox",
        label: "laymic_checkboxLabel",
        iconWrapper: "laymic_checkboxIconWrapper",
      },
      select: {
        container: "laymic_select",
        label: "laymic_selectLabel",
        wrapper: "laymic_selectWrapper",
        current: "laymic_selectCurrentItem",
        item: "laymic_selectItem",
        itemWrapper: "laymic_selectItemWrapper"
      },
      thumbs: {
        container: "laymic_thumbs",
        wrapper: "laymic_thumbsWrapper",
        item: "laymic_thumbItem",
        slideThumb: "laymic_slideThumb",
        imgThumb: "laymic_imgThumb",
        lazyload: "laymic_lazyload",
        lazyloading: "laymic_lazyloading",
        lazyloaded: "laymic_lazyloaded",
      },
      preference: {
        container: "laymic_preference",
        wrapper: "laymic_preferenceWrapper",
        notice: "laymic_preferenceNotice",
        button: "laymic_preferenceButton",
        paginationVisibility: "laymic_preferencePaginationVisibility",
        isAutoFullscreen: "laymic_preferenceIsAutoFullscreen",
        zoomButtonRatio: "laymic_preferenceZoomButtonRatio",
        isDisabledTapSlidePage: "laymic_preferenceIsDisabledTapSlidePage",
        isDisabledForceHorizView: "laymic_preferenceIsDisabledForceHorizView",
        isDisabledDoubleTapResetZoom: "laymic_preferenceIsDisabledDoubleTapResetZoom",
      },
      help: {
        container: "laymic_help",
        wrapper: "laymic_helpWrapper",
        vertImg: "laymic_helpVertImg",
        horizImg: "laymic_helpHorizImg",
        innerWrapper: "laymic_helpInnerWrapper",
        innerItem: "laymic_helpInnerItem",
        iconWrapper: "laymic_helpIconWrapper",
        iconLabel: "laymic_helpIconLabel",
        chevronsContainer: "laymic_helpChevrons",
        zoomItem: "laymic_helpZoomItem",
        fullscreenItem: "laymic_helpFullscreenItem",
      },
      zoom: {
        controller: "laymic_zoomController",
        wrapper: "laymic_zoomWrapper",
      }
    }
  }

  private get defaultLaymicStateClassNames(): LaymicStateClassNames {
    return {
      active: "laymic_isActive",
      hidden: "laymic_isHidden",
      reversed: "laymic_isReversed",
      showHelp: "laymic_isShowHelp",
      showThumbs: "laymic_isShowThumbs",
      showPreference: "laymic_isShowPreference",
      singleSlide: "laymic_isSingleSlide",
      vertView: "laymic_isVertView",
      visibleUI: "laymic_isVisibleUI",
      visiblePagination: "laymic_isVisiblePagination",
      fullscreen: "laymic_isFullscreen",
      unsupportedFullscreen: "laymic_isUnsupportedFullscreen",
      ltr: "laymic_isLTR",
      mobile: "laymic_isMobile",
      zoomed: "laymic_isZoomed",
    }
  }

  /**
   * 初期状態でのアイコンセットを返す
   * @return アイコンをひとまとめにしたオブジェクト
   */
  private get defaultMangaViewerIcons(): ViewerIcons {
    // material.io: close
    const close = {
      id: "laymic_svgClose",
      className: "icon_close",
      viewBox: "0 0 24 24",
      pathDs: [
        "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
      ]
    };

    // material.io: fullscreen
    const fullscreen = {
      id: "laymic_svgFullscreen",
      className: "icon_fullscreen",
      viewBox: "0 0 24 24",
      pathDs: [
        "M6 15H4v5h5v-2H6zM4 9h2V6h3V4H4zm14 9h-3v2h5v-5h-2zM15 4v2h3v3h2V4z",
      ]
    }

    // material.io: fullscreen-exit
    const exitFullscreen = {
      id: "laymic_svgExitFullscreen",
      className: "icon_exitFullscreen",
      viewBox: "0 0 24 24",
      pathDs: [
        "M4 17h3v3h2v-5H4zM7 7H4v2h5V4H7zm8 13h2v-3h3v-2h-5zm2-13V4h-2v5h5V7z"
      ]
    }

    const showThumbs = {
      id: "laymic_svgThumbs",
      className: "icon_showThumbs",
      viewBox: "0 0 24 24",
      pathDs: [
        "M4 4c-1.108 0-2 .892-2 2v12c0 1.108.892 2 2 2h16c1.108 0 2-.892 2-2V6c0-1.108-.892-2-2-2H4zm0 2h16v12H4V6zm1 1v4h4V7H5zm5 0v4h4V7h-4zm5 0v4h4V7h-4zM5 13v4h4v-4H5zm5 0v4h4v-4h-4zm5 0v4h4v-4h-4z",
      ]
    };

    // material.io: settings_applications(modified)
    const preference = {
      id: "laymic_svgPreference",
      className: "icon_showPreference",
      viewBox: "0 0 24 24",
      pathDs: [
        "M4.283 14.626l1.6 2.76c.106.173.306.24.492.173l1.986-.8c.414.32.854.586 1.347.786l.293 2.12c.04.186.2.333.4.333h3.2c.2 0 .359-.147.399-.347l.293-2.12c.48-.2.933-.466 1.347-.786l1.986.8c.186.067.386 0 .493-.173l1.6-2.76c.106-.173.053-.386-.094-.52l-1.693-1.319c.04-.253.054-.52.054-.773 0-.267-.027-.52-.054-.786l1.693-1.32c.147-.12.2-.347.094-.52l-1.6-2.76a.408.408 0 00-.493-.173l-1.986.8a5.657 5.657 0 00-1.347-.786L14 4.335a.414.414 0 00-.4-.333h-3.2c-.199 0-.359.147-.399.347l-.293 2.12c-.48.2-.947.452-1.347.772l-1.986-.8a.408.408 0 00-.493.174l-1.6 2.759c-.106.173-.053.387.094.52l1.693 1.32c-.04.266-.067.52-.067.786 0 .267.027.52.053.786l-1.692 1.32a.408.408 0 00-.08.52zM12 9.721A2.287 2.287 0 0114.28 12 2.287 2.287 0 0112 14.28 2.287 2.287 0 019.722 12a2.287 2.287 0 012.28-2.28z"
      ]
    }

    const horizView = {
      id: "laymic_svgHorizView",
      className: "icon_horizView",
      viewBox: "0 0 24 24",
      pathDs: [
        "M4 4c-1.108 0-2 .892-2 2v12c0 1.108.892 2 2 2h16c1.108 0 2-.892 2-2V6c0-1.108-.892-2-2-2H4zm0 2h16v12H4V6zm2 1v10h5V7H6zm7 0v10h5V7h-5z"
      ]
    };

    const vertView = {
      id: "laymic_svgVertView",
      className: "icon_vertView",
      viewBox: "0 0 24 24",
      pathDs: [
        "M4 4c-1.108 0-2 .892-2 2v12c0 1.108.892 2 2 2h16c1.108 0 2-.892 2-2V6c0-1.108-.892-2-2-2H4zm0 2h16v12H4V6zm2 1v4h12V7H6zm0 6v4h12v-4H6z"
      ]
    };

    // material.io: check_box(modified)
    const checkboxInner = {
      id: "laymic_svgCheckboxInner",
      className: "icon_checkboxInner",
      viewBox: "0 0 24 24",
      pathDs: [
        "M17.99 9l-1.41-1.42-6.59 6.59-2.58-2.57-1.42 1.41 4 3.99z"
      ]
    };

    // material.io: check_box(modified)
    const checkboxOuter = {
      id: "laymic_svgCheckboxOuter",
      className: "icon_checkboxOuter",
      viewBox: "0 0 24 24",
      pathDs: [
        "M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
      ]
    };

    // material.io: help(modified)
    const showHelp = {
      id: "laymic_svgShowHelp",
      className: "icon_showHelp",
      viewBox: "0 0 24 24",
      pathDs: [
        "M12 6.4a3.2 3.2 0 00-3.2 3.2h1.6c0-.88.72-1.6 1.6-1.6.88 0 1.6.72 1.6 1.6 0 .44-.176.84-.472 1.128l-.992 1.008A3.22 3.22 0 0011.2 14v.4h1.6c0-1.2.36-1.68.936-2.264l.72-.736a2.545 2.545 0 00.744-1.8A3.2 3.2 0 0012 6.4zm-.8 9.6v1.6h1.6V16z",
        "M12 3a9 9 0 00-9 9 9 9 0 009 9 9 9 0 009-9 9 9 0 00-9-9zm0 1.445A7.555 7.555 0 0119.555 12 7.555 7.555 0 0112 19.555 7.555 7.555 0 014.445 12 7.555 7.555 0 0112 4.445z"
      ]
    }

    // material.io: zoom_in(modified)
    const zoomIn = {
      id: "laymic_svgZoomIn",
      className: "icon_zoomIn",
      viewBox: "0 0 24 24",
      pathDs: [
        "M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z",
        "M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z",
      ]
    }

    // material.io: unfold_more(modified)
    const viewerDirection = {
      id: "laymic_svgViewerDirection",
      className: "icon_viewerDirection",
      viewBox: "0 0 24 24",
      pathDs: [
        "M18.17 12.002l-4.243 4.242 1.41 1.41 5.662-5.652-5.657-5.658-1.41 1.42zm-12.34 0l4.24-4.242-1.41-1.41L3 12.002l5.662 5.662 1.41-1.42z"
      ]
    };

    const touchApp = {
      id: "laymic_svgTouchApp",
      className: "icon_touchApp",
      viewBox: "0 0 24 24",
      pathDs: [
        "M9.156 9.854v-3.56a2.381 2.381 0 014.76 0v3.56a4.27 4.27 0 001.904-3.56 4.279 4.279 0 00-4.284-4.285 4.279 4.279 0 00-4.284 4.284 4.27 4.27 0 001.904 3.561zm9.368 4.408l-4.322-2.152a1.34 1.34 0 00-.514-.104h-.724V6.293c0-.79-.638-1.428-1.428-1.428-.79 0-1.428.638-1.428 1.428V16.52l-3.266-.686c-.076-.01-.143-.029-.228-.029-.295 0-.562.124-.752.315l-.752.761 4.703 4.703c.257.258.619.42 1.009.42h6.464c.714 0 1.267-.524 1.371-1.22l.714-5.017c.01-.066.02-.133.02-.19 0-.59-.362-1.104-.867-1.314z"
      ]
    }

    const chevronLeft = {
      id: "laymic_svgChevronLeft",
      className: "icon_chevronLeft",
      viewBox: "0 0 24 24",
      pathDs: [
        "M18 4.12L10.12 12 18 19.88 15.88 22l-10-10 10-10z"
      ]
    }

    return {
      close,
      fullscreen,
      exitFullscreen,
      showThumbs,
      preference,
      horizView,
      vertView,
      checkboxInner,
      checkboxOuter,
      showHelp,
      zoomIn,
      viewerDirection,
      touchApp,
      chevronLeft
    }
  }

  /**
   * swiper-container要素を返す
   * @param  className 要素のclass名として付記される文字列
   * @param  pages     要素が内包することになるimg src配列
   * @param  isLTR     左から右に流れる形式を取るならtrue
   * @return           swiper-container要素
   */
  createSwiperContainer(pages: ViewerPages, isLTR?: boolean, isFirstSlideEmpty?: boolean, isAppendEmptySlide?: boolean): HTMLElement {
    const swiperEl = this.createDiv();
    swiperEl.className = "swiper-container " + this.classNames.slider;
    swiperEl.dir = (isLTR) ? "" : "rtl";

    const wrapperEl = this.createDiv();
    wrapperEl.className = "swiper-wrapper";

    // isFirstSlideEmpty引数がtrueならば
    // 空の要素を一番目に入れる
    if (isFirstSlideEmpty) {
      const emptyEl = this.createEmptySlideEl();
      wrapperEl.appendChild(emptyEl);
    }

    for (let p of pages) {
      const divEl = this.createDiv();
      divEl.className = "swiper-slide";

      if (p instanceof Element) {
        divEl.appendChild(p);
      } else {
        const imgEl = new Image();
        imgEl.dataset.src = p;
        imgEl.className = "swiper-lazy";
        divEl.appendChild(imgEl);
      }

      wrapperEl.appendChild(divEl);
    }

    // isAppendEmptySlide引数がtrueならば
    // 空の要素を最後に入れる
    if (isAppendEmptySlide) {
      const emptyEl = this.createEmptySlideEl();
      wrapperEl.appendChild(emptyEl);
    }

    swiperEl.appendChild(wrapperEl);

    return swiperEl;
  }

  /**
   * 漫画ビューワーコントローラー要素を返す
   * @param  id    要素のid名となる文字列
   * @param  isLTR 左から右に流れる形式を取るならtrue
   * @return       [コントローラー要素, コントローラー要素が内包するボタンオブジェクト]
   */
  createViewerController(): [HTMLElement, ViewerUIButtons] {
    const btnClassNames = this.classNames.buttons
    const ctrlClassNames = this.classNames.controller;
    const ctrlEl = this.createDiv();
    ctrlEl.className = ctrlClassNames.controller;
    const progressEl = this.createDiv();
    progressEl.className = "swiper-pagination " + ctrlClassNames.progressbar;

    const ctrlTopEl = this.createDiv();
    ctrlTopEl.className = ctrlClassNames.controllerTop;
    ctrlTopEl.setAttribute("aria-orientation", "horizontal");
    setRole(ctrlTopEl, "menu");

    const direction = this.createButton();
    direction.classList.add(btnClassNames.direction);
    [
      this.createSvgUseElement(this.icons.vertView),
      this.createSvgUseElement(this.icons.horizView),
    ].forEach(icon => direction.appendChild(icon))

    const fullscreen = this.createButton();
    [
      this.createSvgUseElement(this.icons.fullscreen),
      this.createSvgUseElement(this.icons.exitFullscreen),
    ].forEach(icon => fullscreen.appendChild(icon));
    fullscreen.classList.add(btnClassNames.fullscreen);

    const thumbs = this.createButton();
    [
      this.createSvgUseElement(this.icons.showThumbs),
    ].forEach(icon => thumbs.appendChild(icon));
    thumbs.classList.add(btnClassNames.thumbs);

    const preference = this.createButton();
    preference.classList.add(btnClassNames.preference);
    const preferenceIcon = this.createSvgUseElement(this.icons.preference);
    preference.appendChild(preferenceIcon);

    const close = this.createButton();
    close.classList.add(btnClassNames.close);
    const closeIcon = this.createSvgUseElement(this.icons.close);
    close.appendChild(closeIcon);

    const help = this.createButton();
    help.classList.add(btnClassNames.help);
    const helpIcon = this.createSvgUseElement(this.icons.showHelp);
    help.appendChild(helpIcon);

    const zoom = this.createButton();
    zoom.classList.add(btnClassNames.zoom);
    [
      this.createSvgUseElement(this.icons.zoomIn),
    ].forEach(icon => zoom.appendChild(icon));

    [
      preference,
      thumbs,
      help,
    ].forEach(el => el.setAttribute("aria-haspopup", "true"));

    [
      help,
      direction,
      thumbs,
      zoom,
      fullscreen,
      preference,
      close
    ].forEach(btn => {
      setRole(btn, "menuitem");
      ctrlTopEl.appendChild(btn);
    });

    const paginationClass = this.classNames.pagination
    const nextPage = this.createButton(`${paginationClass} ${btnClassNames.nextPage} swiper-button-next`);
    const prevPage = this.createButton(`${paginationClass} ${btnClassNames.prevPage} swiper-button-prev`);

    const uiButtons: ViewerUIButtons = {
      help,
      close,
      thumbs,
      zoom,
      fullscreen,
      preference,
      direction,
      nextPage,
      prevPage
    }

    const ctrlBottomEl = this.createDiv();
    ctrlBottomEl.className = ctrlClassNames.controllerBottom;

    [
      ctrlTopEl,
      ctrlBottomEl,
      progressEl,
      nextPage,
      prevPage,
    ].forEach(el => ctrlEl.appendChild(el));

    return [ctrlEl, uiButtons]
  }

  createZoomWrapper(): HTMLElement {
    const zoomWrapper = this.createDiv();
    zoomWrapper.className = this.classNames.zoom.wrapper;
    return zoomWrapper;
  }

  /**
   * use要素を内包したSVGElementを返す
   * @param  linkId    xlink:hrefに指定するid名
   * @param  className 返す要素に追加するクラス名
   * @return           SVGElement
   */
  createSvgUseElement(icon: IconData): SVGElement {
    const svgClassNames = this.classNames.svg;
    const svgEl = document.createElementNS(SVG_NS, "svg");
    svgEl.setAttribute("class", `${svgClassNames.icon} ${icon.className}`);
    svgEl.setAttribute("role", "img");

    const useEl = document.createElementNS(SVG_NS, "use");
    useEl.setAttribute("class", svgClassNames.defaultProp);
    useEl.setAttributeNS(SVG_XLINK_NS, "xlink:href", "#" + icon.id);
    svgEl.appendChild(useEl);

    return svgEl;
  }

  /**
   * 漫画ビューワーが用いるアイコンを返す
   * use要素を用いたsvg引用呼び出しを使うための前処理
   * @return 漫画ビューワーが使うアイコンを詰め込んだsvg要素
   */
  createSVGIcons(): SVGElement {
    const svgCtn = document.createElementNS(SVG_NS, "svg");
    svgCtn.setAttributeNS(null, "version", "1.1");
    svgCtn.setAttribute("xmlns", SVG_NS);
    svgCtn.setAttribute("xmlns:xlink", SVG_XLINK_NS);
    svgCtn.setAttribute("class", this.classNames.svg.container);

    const defs = document.createElementNS(SVG_NS, "defs");

    Object.values(this.icons).forEach(icon => {
      if (!this.isIconData(icon)) {
        return;
      }

      const symbol = document.createElementNS(SVG_NS, "symbol");
      symbol.setAttribute("id", icon.id);
      symbol.setAttribute("viewBox", icon.viewBox);

      icon.pathDs.forEach(d => {
        const path = document.createElementNS(SVG_NS, "path");
        path.setAttribute("d", d);
        symbol.appendChild(path);
      })

      defs.appendChild(symbol);
    })

    svgCtn.appendChild(defs);

    // 画面上に表示させないためのスタイル定義
    svgCtn.style.height = "1px";
    svgCtn.style.width = "1px";
    svgCtn.style.position = "absolute";
    svgCtn.style.left = "-9px";

    return svgCtn;
  }

  /**
   * 空のdiv要素を返す
   * @return div要素
   */
  createDiv(): HTMLDivElement {
    return document.createElement("div");
  }

  /**
   * 空のbutton要素を返す
   * @return button要素
   */
  createButton(className: string = this.classNames.uiButton): HTMLButtonElement {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = className;
    return btn;
  }

  createSpan(): HTMLSpanElement {
    return document.createElement("span");
  }

  createParagraph(): HTMLParagraphElement {
    return document.createElement("p");
  }

  createEmptySlideEl(): HTMLElement {
    const emptyEl = this.createDiv();
    emptyEl.className = "swiper-slide " + this.classNames.emptySlide;
    return emptyEl;
  }

  /**
   * ヘルプとして表示する部分を出力する
   * @return helpWrapperとして用いられるHTMLElement
   */
  createHelpWrapperEl(): HTMLElement {
    const helpClassNames = this.classNames.help;
    const wrapperEl = this.createDiv();
    wrapperEl.className = helpClassNames.wrapper;

    const innerWrapperEl = this.createHelpInnerWrapperEl();

    const touchAppIcon = this.createSvgUseElement(this.icons.touchApp);

    const chevronsContainer = this.createDiv();
    chevronsContainer.className = helpClassNames.chevronsContainer;
    const iconChevron = this.icons.chevronLeft;
    // 右向き矢印は一度生成してから反転クラス名を付与する
    const chevronRight = this.createSvgUseElement(iconChevron);
    chevronRight.classList.add(this.stateNames.reversed);

    [
      this.createSvgUseElement(iconChevron),
      chevronRight
    ].forEach(el => chevronsContainer.appendChild(el));

    [
      chevronsContainer,
      innerWrapperEl,
      touchAppIcon,
    ].forEach(el => wrapperEl.appendChild(el));

    return wrapperEl;
  }

  /**
   * ヘルプ内のアイコン説明部分を出力する
   * @return アイコン説明を散りばめたHTMLElement
   */
  private createHelpInnerWrapperEl(): HTMLElement {
    const helpClassNames = this.classNames.help;
    const innerWrapper = this.createDiv();
    innerWrapper.className = helpClassNames.innerWrapper;
    setRole(innerWrapper, "list");

    [
      {
        icons: [this.icons.close],
        label: "閉じる"
      },
      {
        icons: [this.icons.preference],
        label: "設定"
      },
      {
        icons: [this.icons.fullscreen, this.icons.exitFullscreen],
        label: "全画面切り替え",
        className: helpClassNames.fullscreenItem,
      },
      {
        icons: [this.icons.zoomIn],
        label: "拡大表示",
        className: helpClassNames.zoomItem,
      },
      {
        icons: [this.icons.showThumbs],
        label: "サムネイル"
      },
      {
        icons: [this.icons.vertView, this.icons.horizView],
        label: "縦読み/横読み"
      },
      {
        icons: [this.icons.showHelp],
        label: "ヘルプ"
      },
      {
        icons: [this.icons.viewerDirection],
        label: "ページ送り"
      },
      {
        icons: [this.icons.touchApp],
        label: "機能呼び出し"
      }
    ].forEach(obj => {
      const item = this.createDiv();
      item.className = helpClassNames.innerItem;
      setRole(item, "listitem");

      if (obj.className) item.classList.add(obj.className);

      const iconWrapper = this.createDiv();
      iconWrapper.className = helpClassNames.iconWrapper;

      obj.icons.forEach(icon => iconWrapper.appendChild(this.createSvgUseElement(icon)))

      const label = this.createSpan();
      label.textContent = obj.label;
      label.className = helpClassNames.iconLabel;

      [iconWrapper, label].forEach(el => item.appendChild(el));

      innerWrapper.appendChild(item);
    })

    return innerWrapper;
  }

  /**
   * IconData形式のオブジェクトであるかを判別する
   * type guard用の関数
   * @param  icon 型診断を行う対象
   * @return      IconDataであるならtrue
   */
  private isIconData(icon: any): icon is IconData {
    return typeof icon.id === "string"
      && typeof icon.viewBox === "string"
      && Array.isArray(icon.pathDs);
  }
}
