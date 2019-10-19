import MangaViewerThumbnails from "#/thumbs";
import ViewerDOMBuilder from "#/builder";

describe("thumbs class test", () => {
  const builder = new ViewerDOMBuilder();
  const testPics = [
    "test0.png",
    "test1.png",
    "test2.png",
  ]
  const state = {
    viewerPadding: 10,
    // デフォルト値としてウィンドウ幅を指定
    swiperRect: {
      l: 0,
      t: 0,
      w: 1000,
      h: 800,
    },
    // インスタンスごとに固有のid数字
    viewerId: 0,
    pageSize: {
      w: 400,
      h: 800
    },
    thresholdWidth: 400,
    pageAspect: {
      w: 45,
      h: 64
    },
    isLTR: false,
    isVertView: false,
    isFirstSlideEmpty: false,
    vertPageMargin: 10,
    horizPageMargin: 0,
    progressBarWidth: 8,
    thumbItemWidth: 96,
    thumbItemGap: 16,
    thumbsWrapperPadding: 16,
    isMobile: false,
  };

  const thumbs = new MangaViewerThumbnails(builder, testPics, state);

  it("revealImgs test", () => {
    thumbs.thumbEls.forEach(el => {
      if (!(el instanceof HTMLImageElement)) return;

      expect(el.src).toBe("");
    })

    thumbs.revealImgs();

    thumbs.thumbEls.forEach(el => {
      if (!(el instanceof HTMLImageElement)) return;

      // revealImgs()によってsrcの値が入れ込まれる
      expect(el.src).not.toBe("");
    })
  })
})
