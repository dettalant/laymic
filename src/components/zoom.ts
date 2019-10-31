import DOMBuilder from "#/components/builder";
import { PageRect } from "#/interfaces"

interface LaymicZoomStates {
  isZoomed: boolean,
  zoomMultiply: number,
  isSwiped: boolean,
  isMouseDown: boolean,
  posX: number,
  posY: number,
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

    this.el.addEventListener("click", () => {
      // ドラッグ操作がなされている場合は処理をスキップ
      if (this.state.isSwiped) return;

      // zoom要素クリックでzoom解除
      // this.disable();
      console.log(this.el.getBoundingClientRect());
    })

    this.el.addEventListener("mousedown", e => {
      this.state.isMouseDown = true;
      this.state.isSwiped = false;

      this.updateMousePos(e);
      this.updateZoomRect();
    })

    this.el.addEventListener("mouseup", () => {
      this.state.isMouseDown = false;
    })

    this.el.addEventListener("mousemove", e => {
      // mousedown状況下でなければスキップ
      if (!this.state.isMouseDown) return;

      this.state.isSwiped = true;
      this.setRootElTranslate(e.clientX, e.clientY);
      this.updateMousePos(e);
    })
  }

  get defaultLaymicZoomStates(): LaymicZoomStates {
    return {
      isZoomed: false,
      zoomMultiply: 1.0,
      isSwiped: false,
      isMouseDown: false,
      posX: 0,
      posY: 0,
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

  get scaleProperty(): string {
    return `scale(${this.state.zoomMultiply})`;
  }

  get translateProperty(): string {
    return `translate(${this.state.zoomRect.l}px, ${this.state.zoomRect.t})`;
  }

  updateMousePos(e: MouseEvent) {
    this.state.posX = e.clientX;
    this.state.posY = e.clientY;
  }

  updateZoomRect() {
    this.state.zoomRect = this.getZoomElRect();
  }

  getZoomElRect(): PageRect {
    const rect = this.el.getBoundingClientRect();
    return {
      t: rect.top,
      l: rect.left,
      w: rect.width,
      h: rect.height,
    }
  }

  /**
   * マウス操作に応じてrootElのtranslateの値を動かす
   * TODO: まともに機能していないので動くよう直す
   */
  setRootElTranslate(eventX: number, eventY: number) {
    const {innerWidth: iw, innerHeight: ih} = window
    const zoomRect = this.state.zoomRect;
    // これ以上の数値にはならないしきい値
    const {t: ry, l: rx} = zoomRect;
    console.log(`rx: ${rx}, ry: ${ry}`);
    const maxX = -(rx - iw);
    const maxY = -(ry - ih);

    // eventXがtmpXより右ならマイナスの数値、
    // eventXがtmpXより左ならプラスの数値になる
    const x = this.state.posX - eventX;
    const y = this.state.posY - eventY;
    console.log(x, y);

    let translateX = 0;
    const calcX = rx - x;
    if (calcX < maxX) {
      // maxXよりも低い数値ならばmaxXとする
      translateX = maxX;
    } else if (calcX < 0) {
      // 0よりも低い数値でなければ座標を適用しない
      translateX = calcX;
    }

    let translateY = 0;
    const calcY = ry - y;
    if (calcY < maxY) {
      translateY = maxY;
    } else if (calcY < 0) {
      translateY = calcY;
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
