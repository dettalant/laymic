import { Swiper } from "swiper/js/swiper.esm";
import Preference from "#/components/preference";
import Thumbnails from "#/components/thumbs";
import { ViewerPages, ViewerElements, LaymicOptions, ViewerStates, StateClassNames } from "#/interfaces";
export default class Laymic {
    el: ViewerElements;
    state: ViewerStates;
    initOptions: LaymicOptions;
    stateNames: StateClassNames;
    preference: Preference;
    thumbs: Thumbnails;
    swiper: Swiper;
    constructor(pages: ViewerPages, options?: LaymicOptions);
    /**
     * インスタンスごとに固有のビューワーIDを返す
     * @return ビューワーID文字列
     */
    private readonly mangaViewerId;
    /**
     * インスタンスごとに固有のビューワーコントローラーIDを返す
     * @return ビューワーコントローラーID文字列
     */
    private readonly mangaViewerControllerId;
    /**
     * swiper-containerの要素サイズを返す
     * @return 要素サイズオブジェクト
     */
    private readonly swiperElRect;
    /**
     * 初期状態のmangaViewerステートオブジェクトを返す
     * @return this.stateの初期値
     */
    private readonly defaultMangaViewerStates;
    private readonly mainSwiperHorizViewConf;
    private readonly mainSwiperVertViewConf;
    /**
     * 各種イベントの登録
     * インスタンス生成時に一度だけ呼び出されることを想定
     */
    private applyEventListeners;
    /**
     * オーバーレイ表示を展開させる
     * @param  isDisableFullscreen trueならば全画面化処理を無効化する
     */
    open(isDisableFullscreen?: boolean): void;
    /**
     * オーバーレイ表示を閉じる
     */
    close(isHashChange?: boolean): void;
    private switchSingleSlideState;
    /**
     * 縦読み表示へと切り替える
     */
    private enableVerticalView;
    /**
     * 横読み表示へと切り替える
     */
    private disableVerticalView;
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
    private changePaginationVisibility;
    private toggleViewerUI;
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
     * css変数として各ページ最大サイズを再登録する
     * cssPageWidthUpdateという関数名だけど
     * pageHeightの値も更新するのはこれいかに
     */
    private cssPageWidthUpdate;
    private cssProgressBarWidthUpdate;
    private cssViewerPaddingUpdate;
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
     * pageSizeと関連する部分を一挙に設定する
     * @param  width  新たなページ横幅
     * @param  height 新たなページ縦幅
     */
    private setPageSize;
    /**
     * 入力したpathの画像からpageSizeを設定する
     * @param src 画像path
     */
    private setPageSizeFromImgPath;
    /**
     * BarWidthの値から進捗バー幅数値を取得する
     * @param  widthStr BarWidth値
     * @return          対応する数値
     */
    private getBarWidth;
    private debugFunction;
}
