export type ViewerPages = (string | Element)[];

export type BarWidth = "auto" | "none" | "tint" | "medium" | "bold";
export type UIVisibility = "auto" | "visible" | "hidden";

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

export interface LaymicApplicatorOptions {
  // .laymic_template
  templateSelector: string,
  // .laymic_opener
  openerSelector: string,
  // laymic
  defaultViewerId: string
}

export interface PageSize {
  // width
  w: number,
  // height
  h: number,
}

export interface PageRect extends PageSize {
  // left
  l: number,
  // top
  t: number,
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

// mangaViewerで用いるアイコンデータ
// 最低限のsvg生成に必要な内容だけ格納
export interface IconData {
  id: string,
  className: string,
  viewBox: string,
  pathDs: string[],
}

// mangaViewerで用いるアイコンまとめ
export interface ViewerIcons {
  close: IconData,
  fullscreen: IconData,
  exitFullscreen: IconData,
  preference: IconData,
  showThumbs: IconData,
  vertView: IconData,
  horizView: IconData,
  checkboxOuter: IconData,
  checkboxInner: IconData,
  showHelp: IconData,
  zoomIn: IconData,
}

// mangaViewer UI要素として組み込むボタン要素まとめ
export interface ViewerUIButtons {
  help: HTMLButtonElement,
  close: HTMLButtonElement,
  fullscreen: HTMLButtonElement,
  preference: HTMLButtonElement,
  // show thumbs button
  thumbs: HTMLButtonElement,
  // direction change button
  direction: HTMLButtonElement,
  nextPage: HTMLButtonElement,
  prevPage: HTMLButtonElement,
  zoom: HTMLButtonElement
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
  swiperRect: PageRect,
  isLTR: boolean,
  isVertView: boolean,
  isFirstSlideEmpty: boolean,
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
}

export interface PreferenceData {
  isAutoFullscreen: boolean,
  isEnableTapSlidePage: boolean,
  progressBarWidth: BarWidth,
  paginationVisibility: UIVisibility
}

export type PreferenceButtons = Record<keyof PreferenceData, HTMLButtonElement>

export interface LaymicStateClassNames {
  // 汎用的なアクティブ時ステート
  active: string,
  // 汎用的な非表示時ステート
  hidden: string,
  // 横読み時1p表示がなされている際に付与
  singleSlide: string,
  // 設定画面展開中に付与
  showPreference: string,
  // サムネイル表示展開中に付与
  showThumbs: string,
  // ヘルプ表示展開中に付与
  showHelp: string,
  // 全画面表示時に付与
  fullscreen: string,
  // 使用ブラウザがFullscreen APIに未対応の場合に付与
  unsupportedFullscreen: string,
  // UI表示がなされている場合に付与
  visibleUI: string,
  // ページ送りボタン表示設定が有効な場合に付与
  visiblePagination: string,
  // 縦読み時に付与
  vertView: string,
  // 設定が有効な場合に付与
  ltr: string,
  // モバイル端末の場合に付与
  mobile: string,
  // ズーム中に付与
  zoomed: string,
}

export type LaymicUIButtonClassNames = Record<keyof ViewerUIButtons, string>

export interface LaymicSVGClassNames {
  container: string,
  icon: string,
  defaultProp: string,
}

export interface LaymicControllerClassNames {
  controller: string,
  controllerTop: string,
  controllerBottom: string,
  progressbar: string,
}

export interface LaymicCheckboxClassNames {
  container: string,
  label: string
  iconWrapper: string,
}

export interface LaymicSelectClassNames {
  container: string,
  label: string,
  wrapper: string,
  item: string,
}

export interface LaymicThumbsClassNames {
  container: string,
  wrapper: string,
  item: string,
  imgThumb: string,
  slideThumb: string,
  lazyload: string,
  lazyloading: string,
  lazyloaded: string,
}

export interface LaymicPreferenceClassNames {
  container: string,
  wrapper: string,
  button: string,
  paginationVisibility: string,
  isAutoFullscreen: string,
}

export interface LaymicHelpClassNames {
  container: string,
  wrapper: string,
  vertImg: string,
  horizImg: string,
}

export interface LaymicClassNames {
  root: string,
  slider: string,
  emptySlide: string,
  uiButton: string,
  pagination: string,
  controller: LaymicControllerClassNames,
  buttons: LaymicUIButtonClassNames,
  svg: LaymicSVGClassNames,
  checkbox: LaymicCheckboxClassNames,
  select: LaymicSelectClassNames,
  thumbs: LaymicThumbsClassNames,
  preference: LaymicPreferenceClassNames,
  help: LaymicHelpClassNames,
}
