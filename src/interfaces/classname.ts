import { ViewerUIButtons } from "#/interfaces/ui"

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

export interface LaymicZoomClassNames {
  controller: string,
  wrapper: string
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
  zoom: LaymicZoomClassNames,
}
