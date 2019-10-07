export type MangaViewerPages = (string | HTMLElement)[];

export interface MangaViewerOptions {
  // ページ横幅
  pageWidth?: number,
  // ページの縦幅
  pageHeight?: number,
  // 左から右へと流れる形式で初期化する
  isLTR?: boolean,
  // サムネイル機能を無効にする
  isDisableThumbs?: boolean,
  // アイコンを別のものに変更する
  icons?: MangaViewerIcons,
  // 縦読み時のページ間余白ピクセル数値
  vertPageMargin?: number,
  // 横読み時のページ間余白ピクセル数値
  horizPageMargin?: number,
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
  thumbsEl: HTMLElement,
  thumbsWrapperEl: HTMLElement,
  buttons: MangaViewerUIButtons,
  controllerEl: HTMLElement,
}

// mangaViewerで用いるアイコンデータ
// 最低限のsvg生成に必要な内容だけ格納
export interface IconData {
  id: string,
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
  horizPageMargin: number,
  vertPageMargin: number,
  thumbItemWidth: number,
}
