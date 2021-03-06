import DOMBuilder from "./builder";
import { LaymicZoomStates } from "../interfaces/index";
import LaymicPreference from "./preference";
export default class LaymicZoom {
    readonly rootEl: HTMLElement;
    readonly wrapper: HTMLElement;
    readonly controller: HTMLElement;
    readonly builder: DOMBuilder;
    readonly preference: LaymicPreference;
    readonly state: LaymicZoomStates;
    constructor(builder: DOMBuilder, rootEl: HTMLElement, preference: LaymicPreference);
    /**
     * LaymicZoomStatesのデフォルト値を返す
     * @return LaymicZoomStatesデフォルト値
     */
    static readonly defaultLaymicZoomStates: LaymicZoomStates;
    /**
     * 現在ズームがなされているかを返す
     *
     * 真面目な処理だと操作感があまり良くなかったので
     * ズーム状態のしきい値を動かすインチキを行っている。
     *
     * @return ズーム状態であるならtrue
     */
    readonly isZoomed: boolean;
    /**
     * 現在のzoomRatioの値を返す
     * @return zoomRatioの値
     */
    readonly zoomRatio: number;
    /**
     * フルスクリーン状態であるかを返す
     * @return フルスクリーン状態であるならtrue
     */
    private readonly isFullscreen;
    /**
     * ピンチズーム処理を行う
     * @param  e タッチイベント
     */
    pinchZoom(e: TouchEvent): void;
    /**
     * zoomRectの値を更新する
     * translateXとtranslateYの値を入力していれば自前で計算し、
     * そうでないなら`getControllerRect()`を呼び出す
     *
     * @param  translateX 新たなleft座標
     * @param  translateY 新たなtop座標
     */
    updateZoomRect(translateX?: number, translateY?: number): void;
    /**
     * 過去の二点タッチ距離を更新する
     * pastDistanceは計算に用いるので、適時更新する必要がある
     *
     * @param  e TouchEvent
     */
    updatePastDistance(e: TouchEvent): void;
    /**
     * ズームモードに入る
     * @param  zoomRatio ズーム倍率
     * @param  zoomX     正規化されたズーム時中央横座標
     * @param  zoomY     正規化されたズーム時中央縦座標
     */
    enable(zoomRatio?: number, zoomX?: number, zoomY?: number): void;
    /**
     * 拡大縮小処理を行う
     * 引数を省略した場合は中央寄せでズームする
     * @param  zoomRatio ズーム倍率。関連設定値を参照する
     * @param  zoomX     正規化されたズーム時中央横座標
     * @param  zoomY     正規化されたズーム時中央縦座標
     */
    enableZoom(zoomRatio?: number, zoomX?: number, zoomY?: number): void;
    /**
     * ズーム時操作要素を前面に出す
     */
    enableController(): void;
    /**
     * ズームモードから抜ける
     */
    disable(): void;
    /**
     * ズーム中に上へとスクロール可能かどうかのboolを返す
     * @return 上へとスクロール可能ならtrue
     */
    readonly isScrollableUp: boolean;
    /**
     * ズーム中に下へとスクロール可能かどうかのboolを返す
     * @return 下へとスクロール可能ならtrue
     */
    readonly isScrollableDown: boolean;
    /**
     * ズーム中に左へとスクロール可能かどうかのboolを返す
     * @return 左へとスクロール可能ならtrue
     */
    readonly isScrollableLeft: boolean;
    /**
     * ズーム中に右へとスクロール可能かどうかのboolを返す
     * @return 右へとスクロール可能ならtrue
     */
    readonly isScrollableRight: boolean;
    /**
     * ズーム中に上へとスクロールさせる
     * @param  isPageScroll trueならばページ縦幅に応じてスクロール
     */
    scrollUp(isPageScroll?: boolean): void;
    /**
     * ズーム中に下へとスクロールさせる
     * @param  isPageScroll trueならばページ縦幅に応じてスクロール
     */
    scrollDown(isPageScroll?: boolean): void;
    /**
     * ズーム中に左へとスクロールさせる
     * @param  isPageScroll trueならばページ横幅に応じてスクロール
     */
    scrollLeft(isPageScroll?: boolean): void;
    /**
     * ズーム中に右へとスクロールさせる
     * @param  isPageScroll trueならばページ横幅に応じてスクロール
     */
    scrollRight(isPageScroll?: boolean): void;
    private scroll;
    /**
     * タッチされた二点間の距離を返す
     * reference: https://github.com/nolimits4web/swiper/blob/master/src/components/zoom/zoom.js
     *
     * @return 二点間の距離
     */
    private getDistanceBetweenTouches;
    /**
     * タッチされた二点の座標の中心点から、
     * 正規化された拡大時中心点を返す
     *
     * @param  e TouchEvent
     * @return   [betweenX, betweenY]
     */
    private getNormalizedPosBetweenTouches;
    /**
     * 画面中央座標を正規化して返す
     * @return [centeringX, centeringY]
     */
    private getNormalizedCurrentCenter;
    /**
     * css transformの値を設定する
     * ズームが行われていない際、また非フルスクリーン時は
     * cssへのtransform追加を行わない
     */
    private setTransformProperty;
    /**
     * touchstartに対して登録する処理まとめ
     * @param  e TouchEvent
     */
    private touchStartHandler;
    /**
     * touchmoveイベントに対して登録する処理まとめ
     * @param  e TouchEvent
     */
    private touchMoveHandler;
    /**
     * もろもろのEventListenerを登録する
     * インスタンス生成時に一度だけ呼ばれることを想定
     */
    private applyEventListeners;
    /**
     * 過去の座標値を更新する
     * @param  x 新しいx座標
     * @param  y 新しいy座標
     */
    private updatePastPos;
    /**
     * controller要素のサイズを取得する
     * @return PageRectの形式に整えられたサイズ値
     */
    private getControllerRect;
    /**
     * 指定された座標に応じてwrapperのtranslateの値を動かす
     * @param  currentX x座標
     * @param  currentY y座標
     */
    private setTranslate;
}
