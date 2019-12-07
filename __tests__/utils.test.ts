import { calcGCD, viewerCnt, isBarWidth, excludeHashLocation, compareString, setRole, setAriaExpanded } from "#/utils"

describe("utils function test", () => {
  it("calcGCD test", () => {
    const data = [
      [1920, 1080, 120],
      [1024, 768, 256],
      [450, 800, 50],
      [123, 456, 3],
    ]
    for (const [w, h, success] of data) {
      const gcd = calcGCD(w, h);
      expect(gcd).toBe(success);
    }
  })

  it("viewerCnt test", () => {
    expect(viewerCnt()).toBe(0);
    expect(viewerCnt()).toBe(1);
    expect(viewerCnt()).toBe(2);
  })

  // it("isHTMLElementArray test", () => {
  //   const ns = "http://www.w3.org/2000/svg";
  //   const div = document.createElement("div");
  //   const svg = document.createElementNS(ns, "svg");
  //   const trueData = [
  //     [div, div, div],
  //   ];
  //
  //   const falseData = [
  //     [ div, svg ],
  //     [ svg ],
  //     [ 1, div ],
  //     [ 1, 3 ],
  //     [ "a", "b" ],
  //     [ 1, "a" ],
  //     [],
  //   ];
  //
  //   for (const data of trueData) {
  //     expect(isHTMLElementArray(data)).toBeTruthy();
  //   }
  //
  //   for (const data of falseData) {
  //     expect(isHTMLElementArray(data)).toBeFalsy();
  //   }
  // })

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

    for (const data of trueData) {
      expect(isBarWidth(data)).toBeTruthy();
    }

    for (const data of falseData) {
      expect(isBarWidth(data)).toBeFalsy();
    }
  })

  it("excludeHashLocation test", () => {
    const hashStrs = [
      "excludeHashLocationTest",
      "1234",
      "#",
    ]
    for (const str of hashStrs) {
      location.hash = str;
      const isSameString = location.href.split("#")[0] === excludeHashLocation();
      expect(isSameString).toBeTruthy();
    }
  })

  it("compareString test", () => {
    type compareStringData = [string, string, any];
    const trueData: compareStringData[] = [
      ["true", "true", true],
      ["false", "false", false],
      ["a", "a", "abc"],
      ["1", "1", 10]
    ]

    const falseData: compareStringData[] = [
      ["true", "false", true],
      ["false", "true", false],
      ["a", "b", "abc"],
      ["1", "2", 10],
    ]

    // 成功時はsuccessの値を返す
    for (const [s, cmp, success] of trueData) {
      const value = compareString(s, cmp, success);
      expect(value).toBe(success)
    }

    // デフォルトの失敗時はundefinedを返す
    for (const [s, cmp, success] of falseData) {
      const value = compareString(s, cmp, success);
      expect(value).toBeUndefined();
    }
  })

  it("setAriaExpanded test", () => {
    const el = document.createElement("div");
    const ariaExpanded = "aria-expanded";

    expect(el.getAttribute(ariaExpanded)).toBe(null);

    [
      true,
      false,
      true,
    ].forEach(bool => {
      setAriaExpanded(el, bool);
      expect(el.getAttribute(ariaExpanded)).toBe(bool.toString());
    })
  })

  it("setRole test", () => {
    const el = document.createElement("div");

    expect(el.getAttribute("role")).toBe(null);

    [
      "list",
      "menu",
      "menuitem",
      "listitem"
    ].forEach(role => {
      setRole(el, role);
      expect(el.getAttribute("role")).toBe(role);
    })
  })
})
