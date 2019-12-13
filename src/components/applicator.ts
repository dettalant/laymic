import Laymic from "./core";
import { ViewerPages, LaymicPages, LaymicOptions, LaymicApplicatorOptions } from "../interfaces/index";
import { isBarWidth, compareString } from "../utils";

// 複数ビューワーを一括登録したり、
// html側から情報を読み取ってビューワー登録したりするためのclass
export default class LaymicApplicator {
  // laymic instanceを格納するMap object
  laymicMap: Map<string, Laymic> = new Map();
  constructor(selector: string | LaymicApplicatorOptions = ".laymic_template", laymicOptions: LaymicOptions = {}) {
    const applicatorOptions = (typeof selector === "string")
      ? Object.assign(this.defaultLaymicApplicatorOptions, {templateSelector: selector})
      : Object.assign(this.defaultLaymicApplicatorOptions, selector);

    // laymic templateの配列
    const elements = Array.from(document.querySelectorAll(applicatorOptions.templateSelector) || []);
    // laymic展開イベントを登録するopener配列
    const openers = Array.from(document.querySelectorAll(applicatorOptions.openerSelector) || []);

    // templateになるhtml要素から必要な情報を抜き出す
    elements.forEach(el => this.applyLaymicInstance(el, laymicOptions));

    // openerのdata-for属性がlaymic viewerIdと紐付いている場合
    // クリック時に当該viewerを展開するイベントを登録する
    openers.forEach(el => {
      if (!(el instanceof HTMLElement)) return;

      const dataFor = el.dataset.for || "laymic";
      if (!this.laymicMap.has(dataFor)) return;

      el.addEventListener("click", () => {
        this.open(dataFor);
      })
    })
  }

  private get defaultLaymicApplicatorOptions(): LaymicApplicatorOptions {
    return {
      templateSelector: ".laymic_template",
      openerSelector: ".laymic_opener",
      defaultViewerId: "laymic",
    }
  }

  private applyLaymicInstance(el: Element, initOptions: LaymicOptions) {
    if (!(el instanceof HTMLElement)) return;

    const viewerId = el.dataset.viewerId;
    const progressBarWidth = (isBarWidth(el.dataset.progressBarWidth))
      ? el.dataset.progressBarWidth
      : undefined;
    const viewerDirection = (el.dataset.viewerDirection === "vertical") ? "vertical" : undefined;

    const isVisiblePagination = compareString(el.dataset.isVisiblePagination || "", "true", true);
    const isFirstSlideEmpty = compareString(el.dataset.isFirstSlideEmpty || "", "false", false);
    const isInstantOpen = compareString(el.dataset.isInstantOpen || "", "false", false);
    const isLTR = compareString(el.dir, "ltr", true);

    const options: LaymicOptions = {
      viewerId,
      progressBarWidth,
      viewerDirection,
      isFirstSlideEmpty,
      isInstantOpen,
      isVisiblePagination,
      isLTR,
    }

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

    const pageEls = Array.from(el.children).filter(el => el.tagName.toLowerCase() !== "br");

    const pages: ViewerPages = pageEls.map(childEl => {
      let result: Element | string = childEl;
      if (childEl instanceof HTMLImageElement) {
        const src = childEl.dataset.src || childEl.src || "";
        result = src;
      }

      return result;
    });

    const thumbs: string[] = pageEls.map(childEl => {
      return (childEl instanceof HTMLElement)
        ? childEl.dataset.thumbSrc || ""
        : "";
    })

    const laymicPages: LaymicPages = {
      pages,
      thumbs
    }

    // JSON.stringifyを経由させてundefined部分を抹消する
    const opts = Object.assign({}, initOptions, JSON.parse(JSON.stringify(options)));

    this.laymicMap.set(viewerId || "laymic", new Laymic(laymicPages, opts))
  }

  open(viewerId: string) {
    const laymic = this.laymicMap.get(viewerId);
    if (laymic) {
      laymic.open();
    } else {
      console.warn(`LaymicApplicator: ${viewerId} と紐づくlaymic instanceが存在しない`)
    };
  }

  close(viewerId: string) {
    const laymic = this.laymicMap.get(viewerId);
    if (laymic) {
      laymic.close();
    } else {
      console.warn(`LaymicApplicator: ${viewerId} と紐づくlaymic instanceが存在しない`)
    };
  }
}
