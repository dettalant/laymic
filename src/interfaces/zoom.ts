import { PageRect } from "./page";
export interface LaymicZoomStates {
  // 現在のズーム倍率
  zoomRatio: number,
  // 最小ズーム倍率
  minRatio: number,
  // 最大ズーム倍率
  maxRatio: number,
  // スワイプ/ドラッグ判定
  isSwiped: boolean,
  // マウス操作時のマウス押下判定
  isMouseDown: boolean,
  // 過去のx座標
  pastX: number,
  // 過去のy座標
  pastY: number,
  // zoomController要素のサイズ
  zoomRect: PageRect,
  // pinch past distance
  pastDistance: number,
}
