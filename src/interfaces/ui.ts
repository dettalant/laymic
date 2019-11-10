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
