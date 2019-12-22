import DOMBuilder from "./builder";
import LaymicPreference from "./preference";
import LaymicThumbnails from "./thumbs";
import LaymicHelp from "./help";
import LaymicZoom from "./zoom";
import LaymicCSSVariables from "./cssVar";
import LaymicStates from "./states";
import LaymicSlider from "./slider";
import { ViewerPages, ViewerElements, LaymicPages, LaymicOptions } from "../interfaces/index";
export default class Laymic {
    el: ViewerElements;
    state: LaymicStates;
    initOptions: LaymicOptions;
    preference: LaymicPreference;
    thumbs: LaymicThumbnails;
    help: LaymicHelp;
    zoom: LaymicZoom;
    cssVar: LaymicCSSVariables;
    slider: LaymicSlider;
    builder: DOMBuilder;
    constructor(laymicPages: LaymicPages | ViewerPages, options?: LaymicOptions);
    /**
     * オーバーレイ表示を展開させる
     * @param  isDisabledFullscreen trueならば全画面化処理を無効化する
     */
    open(isDisabledFullscreen?: boolean): void;
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
    private toggleFullscreen;
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
     * fullscreenchangeイベントに登録する処理
     * もしscreenfullのapiを通さず全画面状態が解除されても、
     * 最低限の見た目だけは整えるために分離
     */
    private fullscreenChange;
    /**
     * state内のrootElの要素サイズを更新する
     */
    private updateRootElRect;
}
