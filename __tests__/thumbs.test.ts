import Thumbnails from "#/components/thumbs";
import DOMBuilder from "#/components/builder";
import LaymicStates from "#/components/states";

describe("thumbs class test", () => {
  const builder = new DOMBuilder();
  const testPics = [
    "test0.png",
    "test1.png",
    "test2.png",
  ]

  const states = new LaymicStates();

  const rootEl = builder.createDiv();
  const thumbs = new Thumbnails(builder, rootEl, testPics, testPics, states);

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
