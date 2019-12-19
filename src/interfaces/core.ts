import { LaymicClassNames, LaymicStateClassNames } from "./classname";
import { BarWidth, ViewerIcons, ViewerUIButtons } from "./ui";
import { PageRect, PageSize } from "./page";

export type ViewerPages = (string | Element)[];

export interface LaymicPages {
  pages: ViewerPages,
  thumbs: string[],
}

export interface LaymicOptions {
  // ページ横幅
  pageWidth?: number,
  // ページの縦幅
  pageHeight?: number,
  // 左から右へと流れる形式で初期化する
  isLTR?: boolean,
  // 戻る進むボタンを表示する
  isVisiblePagination?: boolean,
  // 横読み時一ページ目を空白として空ける
  // 表紙ページを単独表示することを想定
  isFirstSlideEmpty?: boolean,
  // 全ページ数が奇数でいて見開き2p表示の場合
  // 最終ページとして空白ページを追加する
  // optionとして`false`を指定すると無効化できる
  isAppendEmptySlide?: boolean,
  // アイコンを別のものに変更する
  icons?: Partial<ViewerIcons>,
  // 各種クラス名を別のものに変更する
  classNames?: Partial<LaymicClassNames>,
  // ステート変化用クラス名を別のものに変更する
  stateNames?: Partial<LaymicStateClassNames>,
  // 縦読み時のページ間余白ピクセル数値
  vertPageMargin?: number,
  // 横読み時のページ間余白ピクセル数値
  horizPageMargin?: number,
  // 漫画ページ表示コンテナ周囲の余白ピクセル数値
  viewerPadding?: number,
  // 進捗バーの太さ
  progressBarWidth?: BarWidth,
  // ページ読み込み直後にビューワーを開く機能
  // trueならば有効化、falseならば無効化
  isInstantOpen?: boolean,
  // 漫画を読み進める方向のデフォルト値
  // ユーザー設定がなされていればそちらを優先
  viewerDirection?: "vertical" | "horizontal",
  // インスタンスと紐付けられる文字列
  viewerId?: string,
}

// mangaViewerが管理するElements
// swiperElについてはswiper instanceから触れるけど
// わかりやすさ重視でここに入れておく
export interface ViewerElements {
  rootEl: HTMLElement,
  swiperEl: HTMLElement,
  buttons: ViewerUIButtons,
  controllerEl: HTMLElement,
}

// mangaViewer内部で用いるステートまとめ
export interface ViewerStates {
  // インスタンス識別に用いる文字列
  viewerId: string,
  // インスタンスごとに固有の数字
  viewerIdx: number,
  viewerPadding: number,
  pageSize: PageSize,
  pageAspect: PageSize,
  thresholdWidth: number,
  rootRect: PageRect,
  isLTR: boolean,
  isVertView: boolean,
  isFirstSlideEmpty: boolean,
  // スマホ横持ち時強制2p表示を無効化するか否か
  isDisabledForceHorizView: boolean,
  // 全ページ数が奇数でいて見開き2p表示の場合
  // 最終ページとして空白ページを追加する
  isAppendEmptySlide: boolean,
  horizPageMargin: number,
  vertPageMargin: number,
  progressBarWidth: number,
  thumbItemHeight: number,
  thumbItemWidth: number,
  thumbItemGap: number,
  thumbsWrapperPadding: number,
  isMobile: boolean,
  isInstantOpen: boolean,
  // スクロール状況を復帰させるためのバッファ
  bodyScrollTop: number,
  // laymicがアクティブ状態ならばtrue
  isActive: boolean,
}
