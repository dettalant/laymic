import { Swiper } from "swiper/js/swiper.esm";
import LaymicStates from "./states";
import { ViewerElements, SwiperViewType } from "../interfaces/index";
import DOMBuilder from "./builder";
export default class LaymicSlider {
    el: ViewerElements;
    swiper: Swiper;
    state: LaymicStates;
    builder: DOMBuilder;
    viewType: SwiperViewType;
    constructor(el: ViewerElements, builder: DOMBuilder, states: LaymicStates);
    readonly activeIdx: number;
    private readonly swiper1pHorizViewConf;
    private readonly swiper2pHorizViewConf;
    private readonly swiperVertViewConf;
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
     * @param isUpdateSwiper swiper.update()を行うか否か
     */
    switchSingleSlideState(isUpdateSwiper?: boolean): void;
    /**
     * mangaViewer画面をクリックした際のイベントハンドラ
     *
     * クリック判定基準についてはgetClickPoint()を参照のこと
     *
     * @param  e  mouse event
     */
    slideClickHandler(e: MouseEvent): void;
    /**
     * クリックポイント上にマウス座標が重なっていたならマウスホバー処理を行う
     * @param  e  mouse event
     */
    slideMouseHoverHandler(e: MouseEvent): void;
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
     */
    toggleViewerUI(): void;
    /**
     * ビューワー操作UIを非表示化する
     */
    hideViewerUI(): void;
    loadLazyImg(): void;
    /**
     * orientationcange eventに登録する処理
     */
    orientationChange(): void;
    slideTo(idx: number, speed?: number): void;
    /**
     * 一つ前のスライドを表示する
     * swiper.slidePrev()には
     * 特定状況下で0番スライドに巻き戻る不具合が
     * 存在するようなので、slideTo()を用いて手動で動かしている
     *
     * @param  speed アニメーション速度
     */
    slidePrev(speed?: number): void;
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
    private enableSwiperKeyboardEvent;
    private disableSwiperKeyboardEvent;
}
