import { ViewerStates, OrientationString } from "../interfaces/index";
export default class LaymicStates implements ViewerStates {
    readonly viewerIdx: number;
    viewerId: string;
    viewerPadding: number;
    rootRect: {
        l: number;
        t: number;
        w: number;
        h: number;
    };
    pageSize: {
        w: number;
        h: number;
    };
    pageAspect: {
        w: number;
        h: number;
    };
    isLTR: boolean;
    isVertView: boolean;
    isFirstSlideEmpty: boolean;
    isAppendEmptySlide: boolean;
    vertPageMargin: number;
    horizPageMargin: number;
    progressBarWidth: number;
    thumbItemHeight: number;
    thumbItemWidth: number;
    thumbItemGap: number;
    thumbsWrapperPadding: number;
    isInstantOpen: boolean;
    bodyScrollTop: number;
    isActive: boolean;
    readonly thresholdWidth: number;
    readonly isMobile: boolean;
    /**
     * デバイスの向き方向を返す
     * @return 横向き/縦向き/不明のどれか
     */
    readonly deviceOrientation: OrientationString;
    /**
     * 横読み2p表示するか否かの判定を行う
     * @return  2p表示している状態ならばtrue
     */
    readonly isDoubleSlideHorizView: boolean;
    /**
     * 横読み2p表示する解像度であるか否かの判定を行う
     * @return 2p表示解像度であるならtrue
     */
    readonly isDoubleSlideWidth: boolean;
    /**
     * モバイル端末での強制2p見開き表示モードか否かを判定する
     * @return 2p見開き表示条件ならばtrue
     */
    readonly isMobile2pView: boolean;
}
