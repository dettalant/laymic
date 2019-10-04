import { SwiperOptions } from "swiper";

export interface MangaViewerOptions {
  // ページ横幅
  pageWidth?: number,
  // ページの縦幅
  pageHeight?: number,
  // 左から右へと流れる形式で初期化する
  isLTR?: boolean,
  // ライトボックスとして初期化する
  isLightbox?: boolean,
  icons?: MangaViewerIcons,
  vertViewSlideMargin: number,
  horizViewSlideMargin: number,
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

export interface IconData {
  id: string,
  viewBox: string,
  pathDs: string[],
}

export interface MangaViewerIcons {
  close: IconData,
  fullscreen: IconData,
  exitFullscreen: IconData,
  theater: IconData,
  exitTheater: IconData,
  preference: IconData,
  vertView: IconData,
  horizView: IconData,
}

export interface MangaViewerUIButtons {
  close: HTMLButtonElement,
  fullscreen: HTMLButtonElement,
  theater: HTMLButtonElement,
  preference: HTMLButtonElement,
  // direction change button
  direction: HTMLButtonElement,
}

export interface MangaViewerStates {
  viewerId: number,
  viewerHeightPer: number,
  pageSize: PageSize,
  pageAspect: PageSize,
  swiperRect: PageRect,
  isLTR: boolean,
  isVertView: boolean,
}

export interface MangaViewerConfigs {
  swiperVertView: SwiperOptions,
  swiperHorizView: SwiperOptions
}
