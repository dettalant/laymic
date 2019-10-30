import { ViewerPages, ViewerStates } from "#/interfaces";
import DOMBuilder from "#/components/builder";

export default class LaymicThumbnails {
  state: ViewerStates;
  builder: DOMBuilder;
  rootEl: HTMLElement;
  el: HTMLElement;
  wrapperEl: HTMLElement;
  thumbEls: Element[];
  constructor(builder: DOMBuilder, rootEl: HTMLElement, pages: ViewerPages, state: ViewerStates) {
    this.builder = builder;
    const thumbsClassNames = this.builder.classNames.thumbs;
    const thumbsEl = builder.createDiv();
    thumbsEl.className = thumbsClassNames.container;
    // 初期状態では表示しないようにしておく
    thumbsEl.style.display = "none";

    const wrapperEl = builder.createDiv();
    wrapperEl.className = thumbsClassNames.wrapper;

    const thumbEls = [];
    for (const p of pages) {
      let el: Element;
      if (typeof p === "string") {
        const img = new Image();
        img.dataset.src = p;
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

  showThumbs() {
    if (this.el.style.display === "none") {
      // ページ読み込み後一度だけ動作する
      this.el.style.display = "";
      this.revealImgs();
    }

    this.rootEl.classList.add(this.builder.stateNames.showThumbs);
  }

  hideThumbs() {
    this.rootEl.classList.remove(this.builder.stateNames.showThumbs);
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
      this.hideThumbs();
    });
  }
}
