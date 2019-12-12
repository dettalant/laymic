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
    this.updatePageMaxSize();
    this.updateProgressBarWidth();
    this.updateViewerPadding();
    this.updateJsVh();
  }

  /**
   * css変数として表示可能ページサイズを登録する
   * 厳密なサイズではなく、cssレイアウトに用いるための誤差の多い計算
   * 正確な値はupdatePageRealSize()の方で行う
   */
  updatePageSize() {
    const {w: pageWidth, h: pageHeight} = this.getPageSize();

    this.el.rootEl.style.setProperty("--page-width", pageWidth + "px");
    this.el.rootEl.style.setProperty("--page-height", pageHeight + "px");
  }

  /**
   * laymicに登録されたページ最大サイズをcss変数に登録する
   */
  updatePageMaxSize() {
    const {w: pageW, h: pageH} = this.state.pageSize;
    this.el.rootEl.style.setProperty("--page-max-width", pageW + "px");
    this.el.rootEl.style.setProperty("--page-max-height", pageH + "px");
  }

  /**
   * プログレスバーの太さ数値をcss変数に登録する
   */
  updateProgressBarWidth() {
    this.el.rootEl.style.setProperty("--progressbar-width", this.state.progressBarWidth + "px");
  }

  /**
   * viewerPadding数値をcss変数に登録する
   */
  updateViewerPadding() {
    this.el.rootEl.style.setProperty("--viewer-padding", this.state.viewerPadding + "px");
  }

  /**
   * 各スライドの実質サイズをcss変数に登録する
   */
  updatePageRealSize(isDoubleSlideHorizView: boolean) {
    const {w, h} = this.getPageRealSize(isDoubleSlideHorizView);

    console.log(this.state.viewerIdx, this.el.rootEl.clientWidth, this.el.rootEl.clientHeight, w, h);

    this.el.rootEl.style.setProperty("--page-real-width", w + "px");
    this.el.rootEl.style.setProperty("--page-real-height", h + "px");
  }

  /**
   * 各スライド実寸サイズ / 最大表示サイズの比率をcss変数に登録する
   * この数値を使えば正確なscaleが行えるようになるはず
   *
   * @param  isDoubleSlideHorizView 2p見開き表示ならtrue
   */
  updatePageScaleRatio(isDoubleSlideHorizView: boolean) {
    const ratio = this.getPageScaleRatio(isDoubleSlideHorizView);

    this.el.rootEl.style.setProperty("--page-scale-ratio", ratio.toString());
  }

  updateJsVh() {
    calcWindowVH(this.el.rootEl);
  }

  /**
   * cssレイアウトに用いる各ページサイズを返す
   * 正確な値ではないことに注意
   */
  private getPageSize(): PageSize {
    const {w: aw, h: ah} = this.state.pageAspect;
    const {offsetWidth: ow, offsetHeight: oh} = this.el.rootEl;
    const {progressBarWidth: pbw, viewerPadding: vp, isVertView} = this.state;

    const paddingNum = vp * 2;
    // 最大サイズ
    const [mw, mh] = (!isVertView)
      ? [ow - paddingNum, oh - (pbw + paddingNum)]
      : [ow - (pbw + paddingNum), oh - paddingNum];

    let {w: pageWidth, h: pageHeight} = this.state.pageSize;

    // 横読み時にはプログレスバー幅を差し引いた縦幅を計算に使い、
    // 縦読み時はプログレスバー幅を差し引いた横幅を計算に使う
    if (!this.state.isVertView && ow < pageWidth * 2
      || mw > pageWidth && oh < pageHeight)
    {
      // 横読み時または縦読み時で横幅が狭い場合でのサイズ計算
      pageWidth = Math.round(mh * aw / ah);
      pageHeight = Math.round(pageWidth * ah / aw);
    } else if (oh < pageHeight) {
      // 縦読み時で縦幅が狭い場合のサイズ計算
      pageHeight = Math.round(mw * ah / aw);
      pageWidth = Math.round(pageHeight * aw / ah);
    }

    return {
      w: pageWidth,
      h: pageHeight
    }
  }

  /**
   * pageMaxSizeとpageRealSizeの差異から縮小率を返す
   * @param  isDoubleSlideHorizView 2p見開き表示ならtrue
   * @return                        scaleに用いる縮小表示率
   */
  private getPageScaleRatio(isDoubleSlideHorizView: boolean = false): number {
    const {w: realW, h: realH} = this.getPageRealSize(isDoubleSlideHorizView);
    const {w: pageW, h: pageH} = this.state.pageSize;

    // アスペクト比固定の縮小表示を想定しているため
    // 対角線上の長さを取ってから比較する
    const realD = Math.sqrt(realW ** 2 + realH ** 2);
    const pageD = Math.sqrt(pageW ** 2 + pageH ** 2);

    // 最大1に収まるようclampしておく
    return Math.min(realD / pageD, 1);
  }

  /**
   * ページの実寸表示数値を出力する
   * getPageSize()と比較して、厳密な計算を行っていることが特徴
   * @param  isDoubleSlideHorizView 2p見開き表示ならtrue
   * @return                        実寸のページサイズ
   */
  private getPageRealSize(isDoubleSlideHorizView: boolean = false): PageSize {
    const {w: aw, h: ah} = this.state.pageAspect;
    const {offsetWidth: ow, offsetHeight: oh} = this.el.rootEl;
    const {progressBarWidth: pbw, viewerPadding: vp, isVertView} = this.state;

    const paddingNum = vp * 2;

    // 正確な表示幅サイズ
    const [mw, mh] = (!isVertView)
      ? [ow - paddingNum, oh - (pbw + paddingNum)]
      : [ow - (pbw + paddingNum), oh - paddingNum];

    let {w: width, h: height} = this.state.pageSize;

    // 横読み2p表示で縮小の必要性がない場合
    const isDoubleSlideMaxSize = isDoubleSlideHorizView && width * 2 < mw && height < mh;
    // 1p表示で縮小の必要性が無い場合
    const isSingleSlideMaxSize = !isDoubleSlideHorizView && width < mw && height < mh;

    if (isDoubleSlideMaxSize || isSingleSlideMaxSize) {
      // 縮小の必要性が無い場合は計算処理を行わずスキップ
      // do nothing
    } else if (!isVertView && isDoubleSlideHorizView) {
      // 横読み2p
      // 横幅の半分基準か縦幅基準で値が小さい方を採用
      width = Math.min(mw / 2, mh * aw / ah);
      height = width * ah / aw;
    } else if (mw < width) {
      // 横幅が狭い際の縦読み & 横読み1p
      height = mw * ah / aw;
      width = height * aw / ah;
    } else {
      // 横幅が広い際の縦読み & 横読み1p
      width = mh * aw / ah;
      height = width * ah / aw;
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
