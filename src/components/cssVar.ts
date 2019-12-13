import { calcWindowVH } from "../utils";
import LaymicStates from "./states";
import {
  ViewerElements,
  PageSize
} from "#/interfaces/index";
export default class LaymicCSSVariables {
  el: ViewerElements;
  state: LaymicStates;
  constructor(el: ViewerElements, state: LaymicStates) {
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
   * 厳密な表示サイズを計算する仕様に変更
   */
  updatePageSize() {
    const {w: width, h: height} = this.getPageRealSize();

    this.el.rootEl.style.setProperty("--page-width", width + "px");
    this.el.rootEl.style.setProperty("--page-height", height + "px");
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
   * 各スライド実寸サイズ / 最大表示サイズの比率をcss変数に登録する
   * この数値を使えば正確なscaleが行えるようになるはず
   *
   * @param  isDoubleSlideHorizView 2p見開き表示ならtrue
   */
  updatePageScaleRatio() {
    const ratio = this.getPageScaleRatio();

    this.el.rootEl.style.setProperty("--page-scale-ratio", ratio.toString());
  }

  updateJsVh() {
    calcWindowVH(this.el.rootEl);
  }

  /**
   * cssレイアウトに用いる各ページサイズを返す
   * 正確な値ではないことに注意
   */
  // private getPageSize(): PageSize {
  //   const {w: aw, h: ah} = this.state.pageAspect;
  //   const {offsetWidth: ow, offsetHeight: oh} = this.el.rootEl;
  //   const {progressBarWidth: pbw, viewerPadding: vp, isVertView} = this.state;
  //
  //   const paddingNum = vp * 2;
  //   // 最大サイズ
  //   const [mw, mh] = (!isVertView)
  //     ? [ow - paddingNum, oh - (pbw + paddingNum)]
  //     : [ow - (pbw + paddingNum), oh - paddingNum];
  //
  //   let {w: pageWidth, h: pageHeight} = this.state.pageSize;
  //
  //   // 横読み時にはプログレスバー幅を差し引いた縦幅を計算に使い、
  //   // 縦読み時はプログレスバー幅を差し引いた横幅を計算に使う
  //   if (!this.state.isVertView && mw < pageWidth * 2
  //     || mw > pageWidth && mh < pageHeight)
  //   {
  //     // 横読み時または縦読み時で横幅が狭い場合でのサイズ計算
  //     pageWidth = Math.round(mh * aw / ah);
  //     pageHeight = Math.round(pageWidth * ah / aw);
  //   } else if (mh < pageHeight) {
  //     // 縦読み時で縦幅が狭い場合のサイズ計算
  //     pageHeight = Math.round(mw * ah / aw);
  //     pageWidth = Math.round(pageHeight * aw / ah);
  //   }
  //
  //   return {
  //     w: pageWidth,
  //     h: pageHeight
  //   }
  // }

  /**
   * pageMaxSizeとpageRealSizeの差異から縮小率を返す
   * @return                        scaleに用いる縮小表示率
   */
  private getPageScaleRatio(): number {
    const {w: realW, h: realH} = this.getPageRealSize();
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
   * @return                        実寸のページサイズ
   */
  private getPageRealSize(): PageSize {
    const {w: aw, h: ah} = this.state.pageAspect;
    const {offsetWidth: ow, offsetHeight: oh} = this.el.rootEl;
    const {
      progressBarWidth: pbw,
      viewerPadding: vp,
      isVertView,
      isDoubleSlideHorizView
    } = this.state;

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
    } else {
      // 縦読み & 横読み1p
      // 横幅値か縦幅基準計算値の小さい方を採用
      width = Math.min(mw, mh * aw / ah);
      height = width * ah / aw;
    }

    return {
      w: width,
      h: height
    }
  }
}
