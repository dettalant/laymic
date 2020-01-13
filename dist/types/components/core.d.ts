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
    readonly el: ViewerElements;
    readonly state: LaymicStates;
    readonly initOptions: LaymicOptions;
    readonly preference: LaymicPreference;
    readonly thumbs: LaymicThumbnails;
    readonly help: LaymicHelp;
    readonly zoom: LaymicZoom;
    readonly cssVar: LaymicCSSVariables;
    readonly slider: LaymicSlider;
    readonly builder: DOMBuilder;
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
    /**
     * LaymicPreferenceの値が更新された際に
     * 発火するイベントのハンドラ
     * @param  e CustomEvent。e.detailに変更されたプロパティ名を格納する
     */
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
     * keydown時に呼び出されるハンドラ
     * laymicでのキーボード操作をすべてこの関数でまかなう
     * @param  e KeyboardEvent
     */
    private keydownHandler;
    /**
     * state内のrootElの要素サイズを更新する
     */
    private updateRootElRect;
}
