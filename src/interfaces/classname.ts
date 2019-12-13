import { ViewerUIButtons } from "./ui";
import { SelectClassNames, CheckboxClassNames } from "@dettalant/simple_choices";

export interface LaymicStateClassNames {
  // 汎用的なアクティブ時ステート
  active: string,
  // 汎用的な非表示時ステート
  hidden: string,
  // 汎用的な反転時ステート
  reversed: string,
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
  notice: string,
  button: string,
  paginationVisibility: string,
  isAutoFullscreen: string,
  zoomButtonRatio: string
}

export interface LaymicHelpClassNames {
  container: string,
  wrapper: string,
  vertImg: string,
  horizImg: string,
  innerWrapper: string,
  innerItem: string,
  iconWrapper: string,
  iconLabel: string,
  chevronsContainer: string,
  zoomItem: string,
  fullscreenItem: string,
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
  checkbox: CheckboxClassNames,
  select: SelectClassNames,
  thumbs: LaymicThumbsClassNames,
  preference: LaymicPreferenceClassNames,
  help: LaymicHelpClassNames,
  zoom: LaymicZoomClassNames,
}
