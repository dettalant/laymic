// 複数ビューワーを一括登録したり、
// html側から情報を読み取ってビューワー登録したりするためのclass
export default class MangaViewerApplicator {
  constructor(selector: string) {
    const elements = document.querySelectorAll(selector);
    Array.from(elements).forEach(el => {
      console.log(el);
      if (el.parentNode) el.parentNode.removeChild(el);
    })
  }
}
