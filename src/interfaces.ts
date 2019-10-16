export type MangaViewerPages = (string | HTMLElement)[];

export type BarWidth = "auto" | "none" | "tint" | "medium" | "bold";
export type UIVisibility = "auto" | "visible" | "hidden";

export interface MangaViewerOptions {
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
  icons?: MangaViewerIcons,
  // 縦読み時のページ間余白ピクセル数値
  vertPageMargin?: number,
  // 横読み時のページ間余白ピクセル数値
  horizPageMargin?: number,
  // swiper-container周囲の余白ピクセル数値
  viewerPadding?: number,
  progressBarWidth?: BarWidth,
  // ビューワーで読み進める方向のデフォルト値
  // ユーザー設定がなされていればそちらを優先
  viewerDirection?: "vertical" | "horizontal",
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
export interface MangaViewerElements {
  rootEl: HTMLElement,
  swiperEl: HTMLElement,
  buttons: MangaViewerUIButtons,
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
export interface MangaViewerIcons {
  close: IconData,
  fullscreen: IconData,
  exitFullscreen: IconData,
  preference: IconData,
  showThumbs: IconData,
  vertView: IconData,
  horizView: IconData,
  checkboxOuter: IconData,
  checkboxInner: IconData,
}

// mangaViewer UI要素として組み込むボタン要素まとめ
export interface MangaViewerUIButtons {
  close: HTMLButtonElement,
  fullscreen: HTMLButtonElement,
  preference: HTMLButtonElement,
  // show thumbs button
  thumbs: HTMLButtonElement,
  // direction change button
  direction: HTMLButtonElement,
  nextPage: HTMLButtonElement,
  prevPage: HTMLButtonElement,
}

// mangaViewer内部で用いるステートまとめ
export interface MangaViewerStates {
  // インスタンスごとに固有のid数字
  viewerId: number,
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
  thumbItemWidth: number,
  thumbItemGap: number,
  thumbsWrapperPadding: number,
  isMobile: boolean,
}

export interface PreferenceData {
  isAutoFullscreen: boolean,
  isEnableTapSlidePage: boolean,
  progressBarWidth: BarWidth,
  paginationVisibility: UIVisibility
}

export type PreferenceButtons = {
  [P in keyof PreferenceData]: HTMLButtonElement
}

export interface StateClassNames {
  active: string,
  hidden: string,
  singleSlide: string,
  showPreference: string,
  showThumbs: string,
  fullscreen: string,
  visibleUI: string,
  visiblePagination: string,
  vertView: string,
  ltr: string,
}
