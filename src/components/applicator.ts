import Laymic from "#/components/core";
import { ViewerPages, LaymicOptions } from "#/interfaces";
import { isBarWidth, toBoolean } from "#/utils";

// 複数ビューワーを一括登録したり、
// html側から情報を読み取ってビューワー登録したりするためのclass
export default class LaymicApplicator {
  // laymic instanceを格納するMap object
  laymicMap: Map<string, Laymic> = new Map();
  constructor(selector: string = ".laymic_template", initOptions: LaymicOptions = {}) {
    // laymic templateの配列
    const elements = Array.from(document.querySelectorAll(selector) || []);
    // laymic展開イベントを登録するopener配列
    const openers = Array.from(document.querySelectorAll(".laymic_opener") || []);

    // templateになるhtml要素から必要な情報を抜き出す
    elements.forEach(el => {
      if (!(el instanceof HTMLElement)) return;

      const viewerId = el.dataset.viewerId || "noname";
      const progressBarWidth = (isBarWidth(el.dataset.progressBarWidth))
        ? el.dataset.progressBarWidth
        : undefined;
      const viewerDirection = (el.dataset.viewerDirection === "vertical") ? "vertical" : "horizontal";
      const isFirstSlideEmpty = (toBoolean(el.dataset.isFirstSlideEmpty || ""))
        ? true
        : undefined;
      const isVisiblePagination = (toBoolean(el.dataset.isVisiblePagination || ""))
        ? true
        : undefined;
      const isInstantOpen = ((el.dataset.isInstantOpen || "").toLowerCase() === "false")
        ? false
        : undefined;
      const isLTR = (el.dir === "ltr") ? true : undefined;
      const options: LaymicOptions = Object.assign(initOptions, {
        viewerId,
        progressBarWidth,
        viewerDirection,
        isFirstSlideEmpty,
        isInstantOpen,
        isVisiblePagination,
        isLTR,
      });

      {
        // わかりやすくスコープを分けておく
        const pageWidth = parseInt(el.dataset.pageWidth || "", 10);
        const pageHeight = parseInt(el.dataset.pageHeight || "", 10);
        const vertPageMargin = parseInt(el.dataset.vertPageMargin || "", 10);
        const horizPageMargin = parseInt(el.dataset.horizPageMargin || "", 10);
        const viewerPadding = parseInt(el.dataset.viewerPadding || "", 10);

        if (isFinite(pageWidth)) options.pageWidth = pageWidth;
        if (isFinite(pageHeight)) options.pageHeight = pageHeight;
        if (isFinite(vertPageMargin)) options.vertPageMargin = vertPageMargin;
        if (isFinite(horizPageMargin)) options.horizPageMargin = horizPageMargin;
        if (isFinite(viewerPadding)) options.viewerPadding = viewerPadding;
      }

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
