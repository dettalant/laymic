import DOMBuilder from "#/components/builder";

export default class LaymicZoom {
  rootEl: HTMLElement;
  el: HTMLElement;
  builder: DOMBuilder;
  _isZoomed: boolean = false;
  state: {
    isZoomed: boolean,
    zoomMultiply: number
  } = {isZoomed: false, zoomMultiply: 1.0};
  constructor(builder: DOMBuilder, rootEl: HTMLElement) {
    const zoomEl = builder.createDiv();
    zoomEl.className = "laymic_zoomContainer";

    this.el = zoomEl;
    this.rootEl = rootEl;
    this.builder = builder;

    this.el.addEventListener("click", () => {
      // zoom要素クリックでzoom解除
      this.disable();
    })
  }

  get isZoomed(): boolean {
    return this.state.isZoomed
  }

  /**
   * ズームモードに入る
   */
  enable(zoomMultiply: number = 1.5) {
    const zoomed = this.builder.stateNames.zoomed;
    this.rootEl.classList.add(zoomed);
    this.state.isZoomed = true;

    this.state.zoomMultiply = zoomMultiply;
    this.rootEl.style.transform = `scale(${zoomMultiply})`;
  }

  /**
   * ズームモードから抜ける
   */
  disable() {
    const zoomed = this.builder.stateNames.zoomed;
    this.rootEl.classList.remove(zoomed);
    this.state.isZoomed = false;

    this.state.zoomMultiply = 1.0;
    this.rootEl.style.transform = "";
  }
}
