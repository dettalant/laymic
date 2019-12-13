import { ViewerPages } from "../interfaces/index";
import { setAriaExpanded, setRole } from "../utils"
import DOMBuilder from "./builder";
import LaymicStates from "./states";

export default class LaymicThumbnails {
  state: LaymicStates;
  builder: DOMBuilder;
  rootEl: HTMLElement;
  el: HTMLElement;
  wrapperEl: HTMLElement;
  thumbEls: Element[];
  constructor(builder: DOMBuilder, rootEl: HTMLElement, pages: ViewerPages, thumbPages: string[], state: LaymicStates) {
    this.builder = builder;
    const thumbsClassNames = this.builder.classNames.thumbs;
    const thumbsEl = builder.createDiv();
    thumbsEl.className = thumbsClassNames.container;
    // 初期状態では表示しないようにしておく
    thumbsEl.style.display = "none";
    setAriaExpanded(thumbsEl, false);

    const wrapperEl = builder.createDiv();
    wrapperEl.className = thumbsClassNames.wrapper;
    setRole(wrapperEl, "list");

    const thumbEls = [];
    const loopLen = pages.length;
    // idxを使いたいので古めかしいforループを使用
    for (let i = 0; i < loopLen; i++) {
      const p = pages[i];
      const t = thumbPages[i] || "";

      let el: Element;
      if (t !== "" || typeof p === "string") {
        let src = "";
        if (t !== "") {
          src = t;
        } else if (typeof p === "string") {
          src = p;
        }

        const img = new Image();
        img.dataset.src = src;
        img.className = `${thumbsClassNames.lazyload} ${thumbsClassNames.imgThumb}`;
        el = img;
      } else {
        // thumbs用にnodeをコピー
        const slideEl = p.cloneNode(true);
        if (!(slideEl instanceof Element)) continue;
        el = slideEl;
        el.classList.add(thumbsClassNames.slideThumb)
      }

      el.classList.add(thumbsClassNames.item);

      if (el instanceof HTMLElement) setRole(el, "listitem");

      thumbEls.push(el);
      wrapperEl.appendChild(el);
    }

    thumbsEl.appendChild(wrapperEl);

    this.el = thumbsEl;
    this.wrapperEl = wrapperEl;
    this.thumbEls = thumbEls
    this.state = state;
    this.rootEl = rootEl;

    [
      {
        label: "--thumb-item-height",
        num: this.state.thumbItemHeight
      },
      {
        label: "--thumb-item-width",
        num: this.state.thumbItemWidth,
      },
      {
        label: "--thumb-item-gap",
        num: this.state.thumbItemGap
      },
      {
        label: "--thumbs-wrapper-padding",
        num: this.state.thumbsWrapperPadding
      }
    ].forEach(obj => this.wrapperEl.style.setProperty(obj.label, obj.num + "px"));

    this.applyEventListeners();
  }

  /**
   * thumbsWrapperElのwidthを計算し、
   * 折り返しが発生しないようなら横幅の値を書き換える
   */
  cssThumbsWrapperWidthUpdate(rootEl: HTMLElement) {
    const {offsetWidth: ow} = rootEl;

    // thumb item offset width
    const tW = this.state.thumbItemWidth;
    // thumbs length
    const tLen = this.wrapperEl.children.length;
    // thumbs grid gap
    const tGaps = this.state.thumbItemGap * (tLen - 1);
    // thumbs wrapper padding
    const tWPadding = this.state.thumbsWrapperPadding * 2;

    const thumbsWrapperWidth = tW * tLen + tGaps + tWPadding;
    const widthStyleStr = (ow * 0.9 > thumbsWrapperWidth)
      ? thumbsWrapperWidth + "px"
      : "";
    this.wrapperEl.style.width = widthStyleStr;
  }

  show() {
    if (this.el.style.display === "none") {
      // ページ読み込み後一度だけ動作する
      this.el.style.display = "";
      this.revealImgs();
    }

    this.rootEl.classList.add(this.builder.stateNames.showThumbs);
    setAriaExpanded(this.rootEl, true);
  }

  hide() {
    this.rootEl.classList.remove(this.builder.stateNames.showThumbs);
    setAriaExpanded(this.rootEl, false);
  }

  /**
   * 読み込み待ち状態のimg elementを全て読み込む
   * いわゆるlazyload処理
   */
  private revealImgs() {
    const {lazyload, lazyloading, lazyloaded} = this.builder.classNames.thumbs;
    this.thumbEls.forEach(el => {
      if (!(el instanceof HTMLImageElement)) {
        return;
      }

      const s = el.dataset.src;
      if (s) {
        // 読み込み中はクラス名を変更
        el.classList.replace(lazyload, lazyloading);

        // 読み込みが終わるとクラス名を再変更
        el.addEventListener("load", () => {
          el.classList.replace(lazyloading, lazyloaded);
        })

        el.src = s;
      }
    })
  }

  /**
   * 各種イベントリスナーの登録
   */
  private applyEventListeners() {
    // サムネイルwrapperクリック時にサムネイル表示が消えないようにする
    this.wrapperEl.addEventListener("click", e => {
      e.stopPropagation();
    });

    // サムネイル表示中オーバーレイ要素でのクリックイベント
    this.el.addEventListener("click", () => {
      this.hide();
    });
  }
}
