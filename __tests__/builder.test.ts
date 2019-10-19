import ViewerDOMBuilder from "#/builder";

describe("builder class test", () => {
  const builder = new ViewerDOMBuilder()
  it("createDiv test", () => {
    const div = builder.createDiv();
    expect(div instanceof HTMLDivElement).toBeTruthy();
  })

  it("createButton test", () => {
    const btn = builder.createButton();
    expect(btn instanceof HTMLButtonElement).toBeTruthy();
  })

  it("createSpan test", () => {
    const span = builder.createSpan();
    expect(span instanceof HTMLSpanElement).toBeTruthy();
  })

  it("createParagraph test", () => {
    const p = builder.createParagraph();
    expect(p instanceof HTMLParagraphElement).toBeTruthy();
  })

  it("isIconData test", () => {
    const dummy = {
      id: "dummyId",
      className: "icon_dummy",
      viewBox: "0 0 24 24",
      pathDs: [
        ""
      ]
    };

    const falseDummy = {
      id: 1,
      className: 2,
    }

    expect(builder["isIconData"](dummy)).toBeTruthy();
    expect(builder["isIconData"](falseDummy)).toBeFalsy();
  })

  it("createSelectButton test", () => {
    const selectBtn = builder.createSelectButton("select test", [
      "test1", "test2", "test3"
    ]);

    const active = builder.stateNames.active;

    expect(selectBtn.classList.contains(active)).toBeFalsy();
    selectBtn.focus();
    expect(selectBtn.classList.contains(active)).toBeTruthy();

    selectBtn.blur();
    expect(selectBtn.classList.contains(active)).toBeFalsy();
  })

  it("createCheckBoxButton test", () => {
    const btn = builder.createCheckBoxButton("checkbox test");
    const active = builder.stateNames.active;

    expect(btn.classList.contains(active)).toBeFalsy();

    btn.click();
    expect(btn.classList.contains(active)).toBeTruthy();

    btn.click();
    expect(btn.classList.contains(active)).toBeFalsy();
  });

  it("createSvgUseElement test", () => {
    const dummy = {
      id: "dummyId",
      className: "icon_dummy",
      viewBox: "0 0 24 24",
      pathDs: [
        ""
      ]
    };
    const svg = builder["createSvgUseElement"](dummy);
    expect(svg.getAttribute("class")).toContain(dummy.className);

    const use = svg.children[0];
    expect(use.tagName.toLowerCase()).toBe("use");
    expect(use.getAttribute("xlink:href")).toBe("#" + dummy.id);
  });

  it("createSVGIcons test", () => {
    const icons = builder.createSVGIcons();
    const defs = icons.children[0];
    expect(defs.tagName.toLowerCase()).toBe("defs");
    Array.from(defs.children).forEach(el => {
      expect(el.tagName.toLowerCase()).toBe("symbol");

      Array.from(el.children).forEach(path => {
        expect(path.tagName.toLowerCase()).toBe("path");
      })
    })
  })
})
