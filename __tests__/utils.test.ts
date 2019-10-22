import { calcGCD, viewerCnt, isHTMLElementArray, isBarWidth, excludeHashLocation } from "#/utils"

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

    const falseData = [
      [ div, svg ],
      [ svg ],
      [ 1, div ],
      [ 1, 3 ],
      [ "a", "b" ],
      [ 1, "a" ],
      [],
    ];

    for (let data of trueData) {
      expect(isHTMLElementArray(data)).toBeTruthy();
    }

    for (let data of falseData) {
      expect(isHTMLElementArray(data)).toBeFalsy();
    }
  })

  it("isBarWidth test", () => {
    const trueData = [
      "auto",
      "none",
      "tint",
      "medium",
      "bold"
    ];

    const falseData = [
      "ttt",
      "",
      [],
      1,
      NaN,
      true,
      false,
      {},
    ];

    for (let data of trueData) {
      expect(isBarWidth(data)).toBeTruthy();
    }

    for (let data of falseData) {
      expect(isBarWidth(data)).toBeFalsy();
    }
  })

  it("excludeHashLocation test", () => {
    const hashStrs = [
      "excludeHashLocationTest",
      "1234",
      "#",
    ]
    for (let str of hashStrs) {
      location.hash = str;
      const isSameString = location.href.split("#")[0] === excludeHashLocation();
      expect(isSameString).toBeTruthy();
    }
  })
})
