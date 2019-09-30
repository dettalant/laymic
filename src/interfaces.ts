export interface MangaViewerOptions {
  // ページ横幅
  pageWidth?: number;
  // ページの縦幅
  pageHeight?: number;
  // 左から右へと流れる形式で初期化する
  isLTR?: boolean;
  // ライトボックスとして初期化する
  isLightbox?: boolean;
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
  rootEl: HTMLElement;
  swiperEl: HTMLElement,
  controllerEl: HTMLElement;
}

export interface MangaViewerStates {
  viewerId: number;
  multiplyNum: number;
  pageSize: PageSize,
  pageAspect: PageSize,
  swiperRect: PageRect
  isLTR: boolean,
}
