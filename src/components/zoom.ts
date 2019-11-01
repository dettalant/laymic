import DOMBuilder from "#/components/builder";
import { PageRect } from "#/interfaces";
import { rafThrottle } from "#/utils";

interface LaymicZoomStates {
  isZoomed: boolean,
  zoomMultiply: number,
  isSwiped: boolean,
  isMouseDown: boolean,
  pastX: number,
  pastY: number,
  zoomRect: PageRect,
}

export default class LaymicZoom {
  rootEl: HTMLElement;
  el: HTMLElement;
  builder: DOMBuilder;
  _isZoomed: boolean = false;
  state: LaymicZoomStates = this.defaultLaymicZoomStates;
  constructor(builder: DOMBuilder, rootEl: HTMLElement) {
    const zoomEl = builder.createDiv();
    zoomEl.className = "laymic_zoomContainer";

    this.el = zoomEl;
    this.rootEl = rootEl;
    this.builder = builder;

    this.applyEventListeners();
  }

  get defaultLaymicZoomStates(): LaymicZoomStates {
    return {
      isZoomed: false,
      zoomMultiply: 1.0,
      isSwiped: false,
      isMouseDown: false,
      pastX: 0,
      pastY: 0,
      zoomRect: {
        t: 0,
        l: 0,
        w: 800,
        h: 600,
      }
    }
  }

  get isZoomed(): boolean {
    return this.state.isZoomed
  }

  private get scaleProperty(): string {
    return `scale(${this.state.zoomMultiply})`;
  }

  private get translateProperty(): string {
    return `translate(${this.state.zoomRect.l}px, ${this.state.zoomRect.t}px)`;
  }

  private applyEventListeners() {
    this.el.addEventListener("click", () => {
      // ドラッグ操作がなされている場合は処理をスキップ
      if (this.state.isSwiped) return;

      // zoom要素クリックでzoom解除
      this.disable();
      console.log(this.el.getBoundingClientRect());
    });

    this.el.addEventListener("mousedown", e => {
      this.state.isMouseDown = true;
      this.state.isSwiped = false;

      this.updateMousePos(e.clientX, e.clientY);
      this.updateZoomRect();
    });

    [
      "mouseup",
      "mouseleave"
    ].forEach(ev => this.el.addEventListener(ev, () => {
      this.state.isMouseDown = false;
    }));

    this.el.addEventListener("mousemove", rafThrottle(e =>  {
      // mousedown状況下でなければスキップ
      if (!this.state.isMouseDown) return;

      this.state.isSwiped = true;
      this.setRootElTranslate(e.clientX, e.clientY);
      this.updateMousePos(e.clientX, e.clientY);
    }));
  }

  private updateMousePos(x: number, y: number) {
    this.state.pastX = x;
    this.state.pastY = y;
  }

  private updateZoomRect() {
    this.state.zoomRect = this.getZoomElRect();
  }

  private getZoomElRect(): PageRect {
    const rect = this.el.getBoundingClientRect();
    return {
      t: rect.top,
      l: rect.left,
      w: rect.width,
      h: rect.height,
    }
  }

  /**
   * 指定された座標に応じてrootElのtranslateの値を動かす
   * @param  currentX x座標
   * @param  currentY y座標
   */
  private setRootElTranslate(currentX: number, currentY: number) {
    const {innerWidth: iw, innerHeight: ih} = window
    const {pastX, pastY, zoomRect} = this.state;
    const {t: ry, l: rx, w: rw, h: rh} = zoomRect;
    const x = pastX - currentX;
    const y = pastY - currentY;

    // これ以上の数値にはならないしきい値
    const maxX = -(rw - iw);
    const maxY = -(rh - ih);

    const calcX = rx - x;
    const calcY = ry - y;
    let translateX = calcX;
    if (calcX < maxX) {
      // maxXより小さければmaxXを返す
      translateX = maxX;
    } else if (calcX > 0) {
      // 0より大きければ0を返す
      translateX = 0;
    }

    let translateY = calcY;
    if (calcY < maxY) {
      translateY = maxY;
    } else if (calcY > 0) {
      translateY = 0;
    }

    zoomRect.l = translateX;
    zoomRect.t = translateY;

    this.rootEl.style.transform = `${this.translateProperty} ${this.scaleProperty}`;
  }

  /**
   * ズームモードに入る
   */
  enable(zoomMultiply: number = 1.5) {
    const zoomed = this.builder.stateNames.zoomed;
    this.rootEl.classList.add(zoomed);
    this.state.isZoomed = true;

    const rect = this.el.getBoundingClientRect();
    const translateX = (rect.width * zoomMultiply - rect.width) / 2;
    const translateY = (rect.height * zoomMultiply - rect.height) / 2;

    this.state.zoomMultiply = zoomMultiply;
    // 中央寄せでズームする
    this.rootEl.style.transform = `translate(${-translateX}px, ${-translateY}px) scale(${zoomMultiply})`;
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
