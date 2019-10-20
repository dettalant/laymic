import Laymic from "#/components/core";
import { ViewerPages, LaymicOptions } from "#/interfaces";

// 複数ビューワーを一括登録したり、
// html側から情報を読み取ってビューワー登録したりするためのclass
export default class LaymicApplicator {
  // laymic instanceを格納するMap object
  laymicMap: Map<string, Laymic> = new Map();
  constructor(selector: string = ".laymic_template") {
    // laymic templateの配列
    const elements = Array.from(document.querySelectorAll(selector) || []);
    // laymic展開イベントを登録するopener配列
    const openers = Array.from(document.querySelectorAll(".laymic_opener") || []);

    // templateになるhtml要素から必要な情報を抜き出す
    elements.forEach(el => {
      if (!(el instanceof HTMLElement)) return;

      const viewerId = el.dataset.viewerId || "noname";
      const pageWidth = parseInt(el.dataset.pageWidth || "", 10);
      const pageHeight = parseInt(el.dataset.pageHeight || "", 10);
      const options: LaymicOptions = {
        viewerId
      };

      if (isFinite(pageWidth)) options.pageWidth = pageWidth;
      if (isFinite(pageHeight)) options.pageHeight = pageHeight;

      const pages: ViewerPages = Array.from(el.children).map(childEl => {
        let result: Element | string = childEl;
        if (childEl instanceof HTMLImageElement) {
          const src = childEl.dataset.src || childEl.src || "";
          result = src;
        }

        return result;
      });


      this.laymicMap.set(viewerId, new Laymic(pages, options))

      // 用をなしたテンプレート要素を削除
      if (el.parentNode) el.parentNode.removeChild(el);
    })

    // openerのdata-for属性がlaymic viewerIdと紐付いている場合
    // クリック時に当該viewerを展開するイベントを登録する
    openers.forEach(el => {
      if (!(el instanceof HTMLElement)) return;

      const dataFor = el.dataset.for || "noname";
      if (!this.laymicMap.has(dataFor)) return;

      el.addEventListener("click", () => {
        this.open(dataFor);
      })
    })
  }

  open(viewerId: string) {
    const laymic = this.laymicMap.get(viewerId);
    if (laymic) laymic.open();
  }

  close(viewerId: string) {
    const laymic = this.laymicMap.get(viewerId);
    if (laymic) laymic.close();
  }
}
