import Thumbnails from "#/components/thumbs";
import DOMBuilder from "#/components/builder";
import { ViewerStates } from "#/interfaces/core";

describe("thumbs class test", () => {
  const builder = new DOMBuilder();
  const testPics = [
    "test0.png",
    "test1.png",
    "test2.png",
  ]
  const state: ViewerStates = {
    viewerPadding: 10,
    thumbItemWidth: 96,
    thumbItemGap: 16,
    thumbsWrapperPadding: 16,
    thumbItemHeight: 128,
  } as ViewerStates;

  const rootEl = builder.createDiv();
  const thumbs = new Thumbnails(builder, rootEl, testPics, testPics, state);

  it("revealImgs test", () => {
    thumbs.thumbEls.forEach(el => {
      if (!(el instanceof HTMLImageElement)) return;

      expect(el.src).toBe("");
    })

    thumbs["revealImgs"]();

    thumbs.thumbEls.forEach(el => {
      if (!(el instanceof HTMLImageElement)) return;

      // revealImgs()によってsrcの値が入れ込まれる
      expect(el.src).not.toBe("");
    })
  })
})
