export type BarWidth = "auto" | "none" | "tint" | "medium" | "bold";

export type UIVisibility = "auto" | "visible" | "hidden";

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
  viewerDirection: IconData,
  touchApp: IconData,
  // ページ送り方向を示唆するアイコン
  // 左向きだけ用意して、後はcssで回転させて用いる
  chevronLeft: IconData
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
