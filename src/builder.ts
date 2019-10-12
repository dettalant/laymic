import {
  MangaViewerIcons,
  MangaViewerUIButtons,
  IconData,
  StateClassNames
} from "#/interfaces";

// svg namespace
const SVG_NS = "http://www.w3.org/2000/svg";
// svg xlink namespace
const SVG_XLINK_NS = "http://www.w3.org/1999/xlink";

// mangaViewerで用いるDOMを生成するやつ
export class ViewerDOMBuilder {
  // 使用するアイコンセット
  private icons: MangaViewerIcons = this.defaultMangaViewerIcons;
  // uiボタンクラス名
  private readonly uiButtonClass = "mangaViewer_uiButton";
  readonly stateNames = this.defaultStateClassNames;
  constructor(icons?: MangaViewerIcons) {
    if (icons) this.icons = Object.assign(this.icons, icons);
  }

  private get defaultStateClassNames(): StateClassNames {
    return {
      active: "is_active",
      showThumbs: "is_showThumbs",
      showPreference: "is_showPreference",
      vertView: "is_vertView",
      visibleUI: "is_visibleUI",
      fullscreen: "is_fullscreen",
      ltr: "is_ltr",
    }
  }

  /**
   * 初期状態でのアイコンセットを返す
   * @return アイコンをひとまとめにしたオブジェクト
   */
  private get defaultMangaViewerIcons(): MangaViewerIcons {
    // material.io: close
    const close = {
      id: "mangaViewer_svgClose",
      className: "icon_close",
      viewBox: "0 0 24 24",
      pathDs: [
        "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
      ]
    };

    // material.io: fullscreen
    const fullscreen = {
      id: "mangaViewer_svgFullscreen",
      className: "icon_fullscreen",
      viewBox: "0 0 24 24",
      pathDs: [
        "M6 15H4v5h5v-2H6zM4 9h2V6h3V4H4zm14 9h-3v2h5v-5h-2zM15 4v2h3v3h2V4z",
      ]
    }

    // material.io: fullscreen-exit
    const exitFullscreen = {
      id: "mangaViewer_svgExitFullscreen",
      className: "icon_exitFullscreen",
      viewBox: "0 0 24 24",
      pathDs: [
        "M4 17h3v3h2v-5H4zM7 7H4v2h5V4H7zm8 13h2v-3h3v-2h-5zm2-13V4h-2v5h5V7z"
      ]
    }

    const showThumbs = {
      id: "mangaViewer_svgThumbs",
      className: "icon_showThumbs",
      viewBox: "0 0 24 24",
      pathDs: [
        "M4 4c-1.108 0-2 .892-2 2v12c0 1.108.892 2 2 2h16c1.108 0 2-.892 2-2V6c0-1.108-.892-2-2-2H4zm0 2h16v12H4V6zm1 1v4h4V7H5zm5 0v4h4V7h-4zm5 0v4h4V7h-4zM5 13v4h4v-4H5zm5 0v4h4v-4h-4zm5 0v4h4v-4h-4z",
      ]
    };

    // material.io: settings_applications(modified)
    const preference = {
      id: "mangaViewer_svgPreference",
      className: "icon_showPreference",
      viewBox: "0 0 24 24",
      pathDs: [
        "M4.283 14.626l1.6 2.76c.106.173.306.24.492.173l1.986-.8c.414.32.854.586 1.347.786l.293 2.12c.04.186.2.333.4.333h3.2c.2 0 .359-.147.399-.347l.293-2.12c.48-.2.933-.466 1.347-.786l1.986.8c.186.067.386 0 .493-.173l1.6-2.76c.106-.173.053-.386-.094-.52l-1.693-1.319c.04-.253.054-.52.054-.773 0-.267-.027-.52-.054-.786l1.693-1.32c.147-.12.2-.347.094-.52l-1.6-2.76a.408.408 0 00-.493-.173l-1.986.8a5.657 5.657 0 00-1.347-.786L14 4.335a.414.414 0 00-.4-.333h-3.2c-.199 0-.359.147-.399.347l-.293 2.12c-.48.2-.947.452-1.347.772l-1.986-.8a.408.408 0 00-.493.174l-1.6 2.759c-.106.173-.053.387.094.52l1.693 1.32c-.04.266-.067.52-.067.786 0 .267.027.52.053.786l-1.692 1.32a.408.408 0 00-.08.52zM12 9.721A2.287 2.287 0 0114.28 12 2.287 2.287 0 0112 14.28 2.287 2.287 0 019.722 12a2.287 2.287 0 012.28-2.28z"
      ]
    }

    const horizView = {
      id: "mangaViewer_svgHorizView",
      className: "icon_horizView",
      viewBox: "0 0 24 24",
      pathDs: [
        "M4 4c-1.108 0-2 .892-2 2v12c0 1.108.892 2 2 2h16c1.108 0 2-.892 2-2V6c0-1.108-.892-2-2-2H4zm0 2h16v12H4V6zm2 1v10h5V7H6zm7 0v10h5V7h-5z"
      ]
    };

    const vertView = {
      id: "mangaViewer_svgVertView",
      className: "icon_vertView",
      viewBox: "0 0 24 24",
      pathDs: [
        "M4 4c-1.108 0-2 .892-2 2v12c0 1.108.892 2 2 2h16c1.108 0 2-.892 2-2V6c0-1.108-.892-2-2-2H4zm0 2h16v12H4V6zm2 1v4h12V7H6zm0 6v4h12v-4H6z"
      ]
    };

    // material.io: check_box(modified)
    const checkboxInner = {
      id: "mangaViewer_svgCheckBoxInner",
      className: "icon_checkBoxInner",
      viewBox: "0 0 24 24",
      pathDs: [
        "M17.99 9l-1.41-1.42-6.59 6.59-2.58-2.57-1.42 1.41 4 3.99z"
      ]
    };

    // material.io: check_box(modified)
    const checkboxOuter = {
      id: "mangaViewer_svgCheckBoxOuter",
      className: "icon_checkBoxOuter",
      viewBox: "0 0 24 24",
      pathDs: [
        "M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
      ]
    };

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
    }
  }

  /**
   * swiper-container要素を返す
   * @param  id        要素のid名となる文字列
   * @param  className 要素のclass名として付記される文字列
   * @param  pages     要素が内包することになるimg src配列
   * @param  isLTR     左から右に流れる形式を取るならtrue
   * @return           swiper-container要素
   */
  createSwiperContainer(id: string, className: string,  pages: (string | HTMLElement)[], isLTR?: boolean, isFirstSlideEmpty?: boolean): HTMLElement {
    const swiperEl = this.createDiv();
    swiperEl.className = "swiper-container " + className;
    swiperEl.id = id;
    swiperEl.dir = (isLTR) ? "" : "rtl";

    const wrapperEl = this.createDiv();
    wrapperEl.className = "swiper-wrapper";

    // isFirstSlideEmpty引数がtrueならば
    // 空の要素を一番目に入れる
    if (isFirstSlideEmpty) {
      const emptyEl = this.createDiv();
      emptyEl.className = "swiper-slide mangaViewer_emptySlide";
      wrapperEl.appendChild(emptyEl);
    }

    for (let p of pages) {
      const divEl = this.createDiv();
      divEl.className = "swiper-slide";

      if (p instanceof HTMLElement) {
        divEl.appendChild(p);
      } else {
        const imgEl = new Image();
        imgEl.dataset.src = p;
        imgEl.className = "swiper-lazy";
        divEl.appendChild(imgEl);
      }

      wrapperEl.appendChild(divEl);
    }

    swiperEl.appendChild(wrapperEl);
    return swiperEl;
  }

  /**
   * 漫画ビューワーコントローラー要素を返す
   * @param  id 要素のid名となる文字列
   * @return    [コントローラー要素, コントローラー要素が内包するボタンオブジェクト]
   */
  createViewerController(id: string): [HTMLElement, MangaViewerUIButtons] {
    const ctrlEl = this.createDiv();
    ctrlEl.className = "mangaViewer_controller";
    ctrlEl.id = id;

    const progressEl = this.createDiv();
    progressEl.className = "swiper-pagination mangaViewer_progressbar";

    const ctrlTopEl = this.createDiv();
    ctrlTopEl.className = "mangaViewer_controller_top";

    const directionBtn = this.createButton();
    directionBtn.classList.add("mangaViewer_direction");
    [
      this.createSvgUseElement(this.icons.vertView),
      this.createSvgUseElement(this.icons.horizView),
    ].forEach(icon => directionBtn.appendChild(icon))

    const fullscreenBtn = this.createButton();
    [
      this.createSvgUseElement(this.icons.fullscreen),
      this.createSvgUseElement(this.icons.exitFullscreen),
    ].forEach(icon => fullscreenBtn.appendChild(icon));
    fullscreenBtn.classList.add("mangaViewer_fullscreen");

    const thumbsBtn = this.createButton();
    [
      this.createSvgUseElement(this.icons.showThumbs),
    ].forEach(icon => thumbsBtn.appendChild(icon));
    thumbsBtn.classList.add("mangaViewer_showThumbs");

    const preferenceBtn = this.createButton();
    preferenceBtn.classList.add("mangaViewer_showPreference");
    const preferenceIcon = this.createSvgUseElement(this.icons.preference);
    preferenceBtn.appendChild(preferenceIcon);

    const closeBtn = this.createButton();
    closeBtn.classList.add("mangaViewer_close");
    const closeIcon = this.createSvgUseElement(this.icons.close);
    closeBtn.appendChild(closeIcon);

    [
      directionBtn,
      thumbsBtn,
      fullscreenBtn,
      preferenceBtn,
      closeBtn
    ].forEach(btn => ctrlTopEl.appendChild(btn));

    const uiButtons: MangaViewerUIButtons = {
      close: closeBtn,
      thumbs: thumbsBtn,
      fullscreen: fullscreenBtn,
      preference: preferenceBtn,
      direction: directionBtn,
    }

    const ctrlBottomEl = this.createDiv();
    ctrlBottomEl.className = "mangaViewer_controller_bottom";

    [
      ctrlTopEl,
      ctrlBottomEl,
      progressEl,
    ].forEach(el => ctrlEl.appendChild(el));

    return [ctrlEl, uiButtons]
  }

  /**
   * use要素を内包したSVGElementを返す
   * @param  linkId    xlink:hrefに指定するid名
   * @param  className 返す要素に追加するクラス名
   * @return           SVGElement
   */
  private createSvgUseElement(icon: IconData): SVGElement {
    const svgEl = document.createElementNS(SVG_NS, "svg");
    svgEl.setAttribute("class", "svg_icon " + icon.className);
    svgEl.setAttribute("role", "img");

    const useEl = document.createElementNS(SVG_NS, "use");
    useEl.setAttribute("class", "svg_default_prop");
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
    svgCtn.setAttribute("class", "mangaViewer_svg_container");

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
  createButton(className: string = this.uiButtonClass): HTMLButtonElement {
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

  createCheckBoxButton(label: string, className: string = ""): HTMLButtonElement {
    const btn = this.createButton("mangaViewer_checkbox " + className);
    const labelEl = this.createSpan();
    labelEl.className = "mangaViewer_checkboxLabel";
    labelEl.textContent = label;

    const wrapperEl = this.createDiv();
    wrapperEl.className = "mangaViewer_iconWrapper";

    [
      this.createSvgUseElement(this.icons.checkboxOuter),
      this.createSvgUseElement(this.icons.checkboxInner),
    ].forEach(el => wrapperEl.appendChild(el));

    [
      labelEl,
      wrapperEl,
    ].forEach(el => btn.appendChild(el));

    btn.addEventListener("click", () => btn.classList.toggle(this.stateNames.active));
    return btn;
  }

  createSelectButton(label: string, values: string[], className: string = ""): HTMLButtonElement {
    const btn = this.createButton("mangaViewer_select " + className);

    const labelEl = this.createSpan();
    labelEl.className = "mangaViewer_selectLabel";
    labelEl.textContent = label;

    const wrapperEl = this.createDiv();
    wrapperEl.className = "mangaViewer_selectWrapper";

    values.forEach((item, i) => {
      const el = this.createDiv();
      el.className = "mangaViewer_selectItem mangaViewer_selectItem" + i;
      el.textContent = item;
      el.dataset.itemIdx = i.toString();
      wrapperEl.appendChild(el);
    });

    [
      labelEl,
      wrapperEl,
    ].forEach(el => btn.appendChild(el));

    btn.addEventListener("click", () => {
      btn.classList.toggle(this.stateNames.active);
    })

    btn.addEventListener("blur", () => {
      btn.classList.remove(this.stateNames.active);
    })

    return btn;
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
