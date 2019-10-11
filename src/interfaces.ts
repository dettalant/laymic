export type MangaViewerPages = (string | HTMLElement)[];

export interface MangaViewerOptions {
  // ページ横幅
  pageWidth?: number,
  // ページの縦幅
  pageHeight?: number,
  // 左から右へと流れる形式で初期化する
  isLTR?: boolean,
  // サムネイル機能を無効にする
  // NOTE: 現在未使用
  isDisableThumbs?: boolean,
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
  progressBarWidth?: number,
  defaultDirection?: "horizontal" | "vertical",
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
}

// mangaViewer内部で用いるステートまとめ
export interface MangaViewerStates {
  // インスタンスごとに固有のid数字
  viewerId: number,
  viewerPadding: number,
  pageSize: PageSize,
  pageAspect: PageSize,
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
  isTouchEvent: boolean,
}

export type ViewerDirection = "auto" | "vertical" | "horizontal";

export interface PreferenceData {
  isAutoFullscreen: boolean,
  viewerDirection: ViewerDirection,
  isEnableTapSlidePage: boolean,
}

export type PreferenceButtons = {[P in keyof PreferenceData]: HTMLButtonElement}
// export interface MangaViewerPreferenceButtons {
//   [P in keyof PreferenceData]: HTMLElement
// }
