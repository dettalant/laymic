import { ViewerDOMBuilder } from "#/builder";

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
})
