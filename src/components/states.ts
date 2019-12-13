import { ViewerStates, OrientationString } from "../interfaces/index";
import { viewerCnt, isMobile, getDeviceOrientation } from "../utils";
export default class LaymicStates implements ViewerStates {
  readonly viewerIdx = viewerCnt();
  viewerId = "laymic";
  viewerPadding =  10;
  // デフォルト値としてウィンドウ幅を指定
  rootRect = {
    l: 0,
    t: 0,
    w: window.innerWidth,
    h: window.innerHeight,
  };
  pageSize = {
    w: 720,
    h: 1024
  };
  pageAspect = {
    w: 45,
    h: 64
  }
  ;
  isLTR = false;
  isVertView = false;
  // 空白をつけた左始めがデフォルト設定
  isFirstSlideEmpty = true;
  isAppendEmptySlide = true;
  vertPageMargin = 10;
  horizPageMargin = 0;
  // mediumと同じ数値
  progressBarWidth = 8;
  thumbItemHeight = 128;
  thumbItemWidth = 96;
  thumbItemGap = 16;
  thumbsWrapperPadding = 16;
  isInstantOpen = true;
  bodyScrollTop = 0;
  isActive = false;
  get thresholdWidth(): number {
    return this.pageSize.w
  };

  get isMobile(): boolean {
    return isMobile()
  }

  /**
   * デバイスの向き方向を返す
   * @return 横向き/縦向き/不明のどれか
   */
  get deviceOrientation(): OrientationString {
    return getDeviceOrientation();
  }

  /**
   * 横読み2p表示するか否かの判定を行う
   * @return  2p表示している状態ならばtrue
   */
  get isDoubleSlideHorizView(): boolean {
    return this.isMobile2pView || !this.isVertView && this.isDoubleSlideWidth;
  }

  /**
   * 横読み2p表示する解像度であるか否かの判定を行う
   * @return 2p表示解像度であるならtrue
   */
  get isDoubleSlideWidth(): boolean {
    return this.thresholdWidth <= window.innerWidth
  }

  /**
   * モバイル端末での強制2p見開き表示モードか否かを判定する
   * @return 2p見開き表示条件ならばtrue
   */
  get isMobile2pView(): boolean {
    return this.isMobile && this.deviceOrientation === "landscape";
  }
}
