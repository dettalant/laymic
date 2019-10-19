import { MangaViewerPages, MangaViewerStates } from "#/interfaces";
import ViewerDOMBuilder from "#/builder";

export default class MangaViewerThumbnails {
  state: MangaViewerStates
  el: HTMLElement;
  wrapperEl: HTMLElement;
  thumbEls: HTMLElement[];
  constructor(builder: ViewerDOMBuilder, pages: MangaViewerPages, state: MangaViewerStates, className?: string) {
    const thumbsEl = builder.createDiv();
    thumbsEl.className = (className) ? className : "mangaViewer_thumbs";
    // 初期状態では表示しないようにしておく
    thumbsEl.style.display = "none";

    const wrapperEl = builder.createDiv();
    wrapperEl.className = "mangaViewer_thumbsWrapper";
    const thumbEls = [];
    for (let p of pages) {
      let el: HTMLElement;
      if (p instanceof HTMLElement) {
        p.classList.add("mangaViewer_slideThumb")
        el = p;
      } else {
        const img = new Image();
        img.dataset.src = p;
        img.className = "mangaViewer_lazyload mangaViewer_imgThumb";
        el = img;
      }

      el.classList.add("mangaViewer_thumbItem");
      thumbEls.push(el);
      wrapperEl.appendChild(el);
    }

    thumbsEl.appendChild(wrapperEl);

    this.el = thumbsEl;
    this.wrapperEl = wrapperEl;
    this.thumbEls = thumbEls
    this.state = state;

    this.wrapperEl.style.setProperty("--thumb-item-width", this.state.thumbItemWidth + "px");
    this.wrapperEl.style.setProperty("--thumb-item-gap", this.state.thumbItemGap + "px");
    this.wrapperEl.style.setProperty("--thumbs-wrapper-padding", this.state.thumbsWrapperPadding + "px");
  }

  /**
   * 読み込み待ち状態のimg elementを全て読み込む
   * いわゆるlazyload処理
   */
  revealImgs() {
    this.thumbEls.forEach(el => {
      if (!(el instanceof HTMLImageElement)) {
        return;
      }

      const s = el.dataset.src;
      if (s) {
        // 読み込み中はクラス名を変更
        el.classList.replace("mangaViewer_lazyload", "mangaViewer_lazyloading");

        // 読み込みが終わるとクラス名を再変更
        el.addEventListener("load", () => {
          el.classList.replace("mangaViewer_lazyloading", "mangaViewer_lazyloaded");
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
}
