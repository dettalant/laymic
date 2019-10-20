import { calcGCD, viewerCnt, isHTMLElementArray } from "#/utils"

describe("utils function test", () => {
  it("calcGCD test", () => {
    const [w, h] = [1920, 1080];
    const gcd = calcGCD(w, h);
    expect(gcd).toBe(120);
  })

  it("viewerCnt test", () => {
    expect(viewerCnt()).toBe(0);
    expect(viewerCnt()).toBe(1);
  })

  it("isHTMLElementArray test", () => {
    const ns = "http://www.w3.org/2000/svg";
    const div = document.createElement("div");
    const svg = document.createElementNS(ns, "svg");
    const trueData = [
      [div, div, div],
    ];
    trueData.forEach(data => expect(isHTMLElementArray(data)).toBeTruthy());

    const falseData = [
      [ div, svg ],
      [ svg ],
      [ 1, div ],
      [ 1, 3 ],
      [ "a", "b" ],
      [ 1, "a" ],
      [],
    ];

    falseData.forEach(data => expect(isHTMLElementArray(data)).toBeFalsy());
  })
})
