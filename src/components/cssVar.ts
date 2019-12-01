import { calcWindowVH } from "#/utils";
import {
  ViewerStates,
  ViewerElements,
  PageSize
} from "#/interfaces/index";
export default class LaymicCSSVariables {
  el: ViewerElements;
  state: ViewerStates;
  constructor(el: ViewerElements, state: ViewerStates) {
    this.el = el;
    this.state = state;
  }

  /**
   * laymicインスタンスの初期化時に行うcss変数登録まとめ関数
   */
  initCSSVars() {
    this.pageMaxSizeUpdate();
    this.progressBarWidthUpdate();
    this.viewerPaddingUpdate();
    this.jsVhUpdate();
  }

  /**
   * css変数として表示可能ページ最大サイズを登録する
   */
  pageSizeUpdate() {
    const {w: pageWidth, h: pageHeight} = this.getPageSize();

    this.el.rootEl.style.setProperty("--page-width", pageWidth + "px");
    this.el.rootEl.style.setProperty("--page-height", pageHeight + "px");
  }

  /**
   * laymicに登録されたページ最大サイズをcss変数に登録する
   */
  pageMaxSizeUpdate() {
    const {w: pageW, h: pageH} = this.state.pageSize;
    this.el.rootEl.style.setProperty("--page-max-width", pageW + "px");
    this.el.rootEl.style.setProperty("--page-max-height", pageH + "px");
  }

  /**
   * プログレスバーの太さ数値をcss変数に登録する
   */
  progressBarWidthUpdate() {
    this.el.rootEl.style.setProperty("--progressbar-width", this.state.progressBarWidth + "px");
  }

  /**
   * viewerPadding数値をcss変数に登録する
   */
  viewerPaddingUpdate() {
    this.el.rootEl.style.setProperty("--viewer-padding", this.state.viewerPadding + "px");
  }

  /**
   * 各スライドの実質サイズをcss変数に登録する
   */
  pageRealSizeUpdate(isDoubleSlideHorizView: boolean) {
    const {w, h} = this.getPageRealSize(isDoubleSlideHorizView);

    this.el.rootEl.style.setProperty("--page-real-width", w + "px");
    this.el.rootEl.style.setProperty("--page-real-height", h + "px");
  }

  /**
   * 各スライド実寸サイズ / 最大表示サイズの比率をcss変数に登録する
   * この数値を使えば正確なscaleが行えるようになるはず
   *
   * @param  isDoubleSlideHorizView 2p見開き表示ならtrue
   */
  pageScaleRatioUpdate(isDoubleSlideHorizView: boolean) {
    const ratio = this.getPageScaleRatio(isDoubleSlideHorizView);

    this.el.rootEl.style.setProperty("--page-scale-ratio", ratio.toString());
  }

  jsVhUpdate() {
    calcWindowVH(this.el.rootEl);
  }

  private getPageSize(): PageSize {
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

    return {
      w: pageWidth,
      h: pageHeight
    }
  }

  private getPageScaleRatio(isDoubleSlideHorizView: boolean = false): number {
    const {w: realW, h: realH} = this.getPageRealSize(isDoubleSlideHorizView);
    const {w: pageW, h: pageH} = this.state.pageSize;

    // diagonal line
    const realD = Math.sqrt(realW ** 2 + realH ** 2);
    const pageD = Math.sqrt(pageW ** 2 + pageH ** 2);

    return realD / pageD;
  }

  /**
   * ページの実寸表示数値を出力する
   * @param  isDoubleSlideHorizView 2p見開き表示ならtrue
   * @return                        実寸のページサイズ
   */
  private getPageRealSize(isDoubleSlideHorizView: boolean = false): PageSize {
    const {w: aw, h: ah} = this.state.pageAspect;
    const {clientWidth: cw, clientHeight: ch} = this.el.swiperEl;

    let width = cw / 2;
    let height = width * ah / aw;
    if (this.state.isVertView || !isDoubleSlideHorizView) {
      height = ch;
      width = height * aw / ah;
    }

    return {
      w: width,
      h: height
    }
  }

  // NOTE: 今は使用していないのでコメントアウト
  //
  // pageAspectUpdate() {
  //   const {w: aw, h: ah} = this.state.pageAspect;
  //   this.el.rootEl.style.setProperty("--page-aspect-width", aw.toString());
  //   this.el.rootEl.style.setProperty("--page-aspect-height", ah.toString());
  // }
}
