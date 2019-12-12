import { Swiper } from "swiper/js/swiper.esm";
import DOMBuilder from "#/components/builder";
import LaymicPreference from "#/components/preference";
import LaymicThumbnails from "#/components/thumbs";
import LaymicHelp from "#/components/help";
import LaymicZoom from "#/components/zoom";
import LaymicCSSVariables from "#/components/cssVar";
import { ViewerPages, ViewerElements, LaymicPages, LaymicOptions, ViewerStates } from "#/interfaces/index";
export default class Laymic {
    el: ViewerElements;
    state: ViewerStates;
    initOptions: LaymicOptions;
    preference: LaymicPreference;
    thumbs: LaymicThumbnails;
    help: LaymicHelp;
    zoom: LaymicZoom;
    cssVar: LaymicCSSVariables;
    swiper: Swiper;
    builder: DOMBuilder;
    constructor(laymicPages: LaymicPages | ViewerPages, options?: LaymicOptions);
    /**
     * rootElの要素サイズを返す
     * @return 要素サイズオブジェクト
     */
    private readonly rootElRect;
    /**
     * 初期状態のmangaViewerステートオブジェクトを返す
     * @return this.stateの初期値
     */
    private readonly defaultMangaViewerStates;
    private readonly swiper2pHorizViewConf;
    private readonly swiperResponsiveHorizViewConf;
    private readonly swiperVertViewConf;
    /**
     * 横読み2p表示するか否かの判定を行う
     * @return  2p表示する解像度ならばtrue
     */
    private readonly isDoubleSlideHorizView;
    /**
     * モバイル端末での強制2p見開き表示モードか否かを判定する
     * @return 2p見開き表示条件ならばtrue
     */
    private readonly isMobile2pView;
    /**
     * オーバーレイ表示を展開させる
     * @param  isDisableFullscreen trueならば全画面化処理を無効化する
     */
    open(isDisableFullscreen?: boolean): void;
    /**
     * オーバーレイ表示を閉じる
     */
    close(): void;
    private laymicPreferenceUpdateHandler;
    /**
     * 各種イベントの登録
     * インスタンス生成時に一度だけ呼び出されることを想定
     */
    private applyEventListeners;
    /**
     * swiper instanceを再初期化する
     * @param  swiperConf     初期化時に指定するswiperOption
     * @param  idx            初期化時に指定するindex数値
     * @param  isViewerOpened ビューワーが開いているか否か
     */
    private reinitSwiperInstance;
    /**
     * 縦読み表示へと切り替える
     * @param isViewerOpened ビューワーが開かれているか否かの状態を指定。falseならば一部処理を呼び出さない
     */
    private enableVerticalView;
    /**
     * 横読み表示へと切り替える
     */
    private disableVerticalView;
    /**
     * 画面幅に応じて、横読み時の
     * 「1p表示 <-> 2p表示」を切り替える
     */
    private switchSingleSlideState;
    /**
     * 1p目空スライドを削除する
     */
    private removeFirstEmptySlide;
    /**
     * 空スライドを1p目に追加する
     * 重複して追加しないように、空スライドが存在しない場合のみ追加する
     */
    private prependFirstEmptySlide;
    /**
     * 最終p空白スライドを削除する
     */
    private removeLastEmptySlide;
    /**
     * 最終pに空白スライドを追加する
     */
    private appendLastEmptySlide;
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
     * mangaViewer画面をクリックした際のイベントハンドラ
     *
     * クリック判定基準についてはgetClickPoint()を参照のこと
     *
     * @param  e  mouse event
     */
    private slideClickHandler;
    /**
     * クリックポイント上にマウス座標が重なっていたならマウスホバー処理を行う
     * @param  e  mouse event
     */
    private slideMouseHoverHandler;
    /**
     * swiper各種イベントを無効化する
     */
    private detachSwiperEvents;
    /**
     * swiper各種イベントを有効化する
     */
    private attachSwiperEvents;
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
     * ビューワー操作UIをトグルさせる
     */
    private toggleViewerUI;
    /**
     * ビューワー操作UIを非表示化する
     */
    private hideViewerUI;
    /**
     * mangaViewer表示を更新する
     * 主にswiperの表示を更新するための関数
     */
    private viewUpdate;
    /**
     * 全画面化ボタンのイベントハンドラ
     *
     * 非全画面状態ならば全画面化させて、
     * 全画面状態であるならそれを解除する
     */
    private fullscreenHandler;
    /**
     * mangaViewerと紐付いたrootElを表示する
     */
    private showRootEl;
    /**
     * mangaViewerと紐付いたrootElを非表示にする
     */
    private hideRootEl;
    /**
     * body要素のスクロールを停止させる
     */
    private disableBodyScroll;
    /**
     * body要素のスクロールを再開させる
     */
    private enableBodyScroll;
    /**
     * ページ送りボタンを強制的非表示化する
     * ステート状態をいじるのはバグの元なので直書きで非表示化する
     */
    private disablePagination;
    /**
     * ページ送りボタン強制的非表示化を解除する
     * 直書きでのstyle付与を無くす
     */
    private enablePagination;
    /**
     * pageSizeと関連する部分を一挙に設定する
     * @param  width  新たなページ横幅
     * @param  height 新たなページ縦幅
     */
    private setPageSize;
    /**
     * orientationcange eventに登録する処理
     */
    private orientationChange;
}
