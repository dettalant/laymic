import Swiper from "swiper";
import { MangaViewerElements, MangaViewerOptions, MangaViewerStates, MangaViewerConfigs } from "./interfaces";
export default class MangaViewer {
    el: MangaViewerElements;
    conf: MangaViewerConfigs;
    state: MangaViewerStates;
    swiper: Swiper;
    constructor(queryStr: string, pages: (string | HTMLElement)[] | string, options?: MangaViewerOptions);
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
    /**
     * オーバーレイ表示を展開させる
     * @param  isFullscreen trueならば同時に全画面化させる
     */
    open(isFullscreen: boolean): void;
    /**
     * オーバーレイ表示を閉じる
     */
    close(): void;
    /**
     * 縦読み表示へと切り替える
     */
    private enableVerticalView;
    /**
     * 横読み表示へと切り替える
     */
    private disableVerticalView;
    /**
     * mangaViewer画面をクリックした際のイベントハンドラ
     *
     * 横読み時   : 左側クリックで進む、右側クリックで戻る
     * 横読みLTR時: 右側クリックで進む、左側クリックで戻る
     * 縦読み時   : 下側クリックで進む、上側クリックで戻る
     *
     * @param  e pointer-up event
     */
    private slideClickHandler;
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
    private fullscreenButtonHandler;
    /**
     * css変数として各ページ最大サイズを再登録する
     * cssPageWidthUpdateという関数名だけど
     * pageHeightの値も更新するのはこれいかに
     */
    private cssPageWidthUpdate;
    /**
     * mangaViewerと紐付いたrootElを表示する
     * @return [description]
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
     * 入力したpathの画像からpageSizeを設定する
     * @param src 画像path
     */
    private setPageSizeFromImgPath;
}
