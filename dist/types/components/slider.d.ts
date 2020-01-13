import { Swiper } from "swiper/js/swiper.esm";
import LaymicStates from "./states";
import LaymicPreference from "./preference";
import LaymicZoom from "./zoom";
import { ViewerElements, SwiperViewType } from "../interfaces/index";
import DOMBuilder from "./builder";
export default class LaymicSlider {
    viewType: SwiperViewType;
    swiper: Swiper;
    readonly el: ViewerElements;
    readonly state: LaymicStates;
    readonly builder: DOMBuilder;
    readonly preference: LaymicPreference;
    readonly zoom: LaymicZoom;
    private _isViewerUIActive;
    constructor(el: ViewerElements, builder: DOMBuilder, states: LaymicStates, preference: LaymicPreference, zoom: LaymicZoom);
    /**
     * ビューワー操作UIが現在表示されているかのboolを返す
     * @return ビューワー操作UIが表示されているならtrue
     */
    readonly isViewerUIActive: boolean;
    /**
     * 現在表示中のページ数を表示する
     * @return swiper.activeIndexを返す
     */
    readonly activeIdx: number;
    /**
     * 横読み1p表示にて用いる設定値
     * @return SwiperOptions
     */
    private readonly swiper1pHorizViewConf;
    /**
     * 横読み2p表示にて用いる設定値
     * @return SwiperOptions
     */
    private readonly swiper2pHorizViewConf;
    /**
     * 縦読み表示にて用いる設定値
     * @return SwiperOptions
     */
    private readonly swiperVertViewConf;
    /**
     * 縦読み/横読み表示のトグル切り替えを行う
     * 同時にビューワーUIを隠し、rootElへとフォーカスを移す
     */
    toggleVerticalView(): void;
    /**
     * 縦読み表示へと切り替える
     * @param isViewerOpened ビューワーが開かれているか否かの状態を指定。falseならば一部処理を呼び出さない
     */
    enableVerticalView(isViewerOpened?: boolean): void;
    /**
     * 横読み表示へと切り替える
     */
    disableVerticalView(): void;
    /**
     * swiper instanceを再初期化する
     * async関数なので戻り値のpromiseから「swiper最初期化後の処理」を行える
     *
     * @param  swiperConf     初期化時に指定するswiperOption
     * @param  idx            初期化時に指定するindex数値
     * @param  isViewerOpened ビューワーが開いているか否か
     */
    private reinitSwiperInstance;
    /**
     * 横読みビューワーでの2p/1p表示切り替えを行う
     */
    private switchHorizViewSize;
    /**
     * 画面幅に応じて、横読み時の
     * 「1p表示 <-> 2p表示」を切り替える
     * @param  isUpdateSwiper swiper.update()を行うか否か
     */
    switchSingleSlideState(isUpdateSwiper?: boolean): void;
    /**
     * mangaViewer画面をクリックした際のイベントハンドラ
     *
     * クリック判定基準についてはgetClickPoint()を参照のこと
     *
     * @param  e MouseEvent
     */
    private slideClickHandler;
    /**
     * スライダー部分のクリックハンドラ
     * swiperElとcontrollerEl両方にこのハンドラが用いられる
     * @param  e MouseEvent
     */
    sliderClickHandler(e: MouseEvent): void;
    sliderMouseDownHandler(e: MouseEvent): void;
    /**
     * スライダー部分のマウスアップハンドラ
     * ホイールクリックはclickでは取れないようなので
     * 苦肉の策としてmouseupを用いる
     * @param  e MouseEvent
     */
    sliderMouseUpHandler(e: MouseEvent): void;
    /**
     * クリックポイント上にマウス座標が重なっていたならマウスホバー処理を行う
     * @param  e MouseEvent
     */
    sliderMouseMoveHandler(e: MouseEvent): void;
    /**
     * スライダー部分でのマウスホイール操作ハンドラ
     * @param  e WheelEvent
     */
    sliderWheelHandler(e: WheelEvent): void;
    /**
     * スライダー部分でのTouchStartハンドラ
     * @param  e TouchEvent
     */
    sliderTouchStartHandler(e: TouchEvent): void;
    /**
     * スライダー部分でのTouchMoveハンドラ
     * @param  e TouchEvent
     */
    sliderTouchMoveHandler(e: TouchEvent): void;
    /**
     * スライダー部分でのTouchEndハンドラ
     */
    sliderTouchEndHandler(): void;
    /**
     * 進捗バー部分でのClickハンドラ
     * @param  e MouseEvent
     */
    progressbarClickHandler(e: MouseEvent): void;
    /**
     * orientationcange eventに登録する処理
     */
    orientationChange(): void;
    slideTo(idx: number, speed?: number): void;
    /**
     * swiper各種イベントを無効化する
     */
    detachSwiperEvents(): void;
    /**
     * swiper各種イベントを有効化する
     */
    attachSwiperEvents(): void;
    /**
     * ビューワー操作UIをトグルさせる
     * @param isMoveFocus trueであればrootElへとフォーカスを移す
     */
    toggleViewerUI(isMoveFocus?: boolean): void;
    /**
     * ビューワー操作UIを表示する
     */
    showViewerUI(): void;
    /**
     * ビューワー操作UIを非表示化する
     * @param isMoveFocus trueであればrootElへとフォーカスを移す
     */
    hideViewerUI(isMoveFocus?: boolean): void;
    /**
     * swiper内画像をlazyloadする
     */
    loadLazyImgs(): void;
    /**
     * 一つ前のスライドを表示する
     *
     * swiper.slidePrev()には
     * 特定状況下で0番スライドに巻き戻る不具合が
     * 存在するようなので、slideTo()を用いて手動で動かしている
     *
     * @param  speed アニメーション速度
     */
    slidePrev(speed?: number): void;
    /**
     * 一つ次のスライドを表示する
     * @param  speed アニメーション速度
     */
    slideNext(speed?: number): void;
    /**
    * viewType文字列を更新する。
    * 更新タイミングを手動で操作して、viewer状態評価を遅延させる
    */
    private updateViewType;
    /**
     * viewUpdate()を呼び出すイベントを発火させる
     */
    private dispatchViewUpdate;
    /**
     * statesの値に応じて空白スライドを追加する
     * isFirstSlideEmpty有効時: 0番空白スライドを追加
     * isAppendEmptySlide有効時: 最終空白スライドを追加
     */
    private addEmptySlide;
    /**
     * statesの値に応じて空白スライドを消去する
     * isFirstSlideEmpty有効時: 0番空白スライドを消去
     * isAppendEmptySlide有効時: 最終空白スライドを消去
     */
    private removeEmptySlide;
    /**
     * 入力したMouseEventが
     * mangaViewer画面のクリックポイントに重なっているかを返す
     *
     * 横読み時   : 左側クリックで進む、右側クリックで戻る
     * 横読みLTR時: 右側クリックで進む、左側クリックで戻る
     * 縦読み時   : 下側クリックで進む、上側クリックで戻る
     *
     * @param  e mouse event
     * @return   [次に進むクリックポイントに重なっているか, 前に戻るクリックポイントに重なっているか]
     */
    private getClickPoint;
    /**
     * swiper側リサイズイベントに登録するハンドラ
     * open(), close()のタイミングで切り替えるために分離
     */
    private swiperResizeHandler;
    /**
     * swiper側reachBeginningイベントに登録するハンドラ
     */
    private swiperReachBeginningHandler;
    /**
     * swiper側slideChangeイベントに登録するハンドラ
     */
    private swiperSlideChangeHandler;
    /**
     * ページ送りボタンの表示/非表示設定を切り替えるハンドラ
     *
     * disablePagination()で強制非表示化がなされている場合は
     * どうあがいても非表示となる
     */
    private changePaginationVisibility;
    /**
     * 画像読み込み中にswiper.lazy.load()を呼び出した際に
     * 画像読み込み中のまま止まるバグを回避するための関数
     *
     * lazyloading中を示すクラス名を
     * 一旦削除してから読み込み直す
     */
    private forceLoadLazyImgs;
}
