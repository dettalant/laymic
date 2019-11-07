import DOMBuilder from "#/components/builder";
import { PageRect } from "#/interfaces";
import { rafThrottle, isMobile, passiveFalseOption, isMultiTouch } from "#/utils";

interface LaymicZoomStates {
  isZoomed: boolean,
  zoomMultiply: number,
  minRatio: number,
  maxRatio: number,
  isSwiped: boolean,
  isMouseDown: boolean,
  pastX: number,
  pastY: number,
  zoomRect: PageRect,
  pinchBaseDistance: number,
  pinchPastDistance: number,
}

export default class LaymicZoom {
  rootEl: HTMLElement;
  zoomWrapper: HTMLElement;
  el: HTMLElement;
  builder: DOMBuilder;
  _isZoomed: boolean = false;
  state: LaymicZoomStates = this.defaultLaymicZoomStates;
  constructor(builder: DOMBuilder, rootEl: HTMLElement) {
    const zoomEl = builder.createDiv();
    zoomEl.className = builder.classNames.zoom.controller;

    this.el = zoomEl;
    this.rootEl = rootEl;
    this.zoomWrapper = builder.createZoomWrapper()
    this.builder = builder;

    this.applyEventListeners();
  }

  get defaultLaymicZoomStates(): LaymicZoomStates {
    return {
      isZoomed: false,
      zoomMultiply: 1.0,
      minRatio: 1.0,
      maxRatio: 3.0,
      isSwiped: false,
      isMouseDown: false,
      pastX: 0,
      pastY: 0,
      zoomRect: {
        t: 0,
        l: 0,
        w: 800,
        h: 600,
      },
      pinchBaseDistance: 0,
      pinchPastDistance: 0
    }
  }

  get isZoomed(): boolean {
    return this.state.isZoomed
  }

  /**
   * タッチされた二点間の距離を返す
   * reference: https://github.com/nolimits4web/swiper/blob/master/src/components/zoom/zoom.js
   * @return 二点間の距離
   */
  getDistanceBetweenTouches(e: TouchEvent): number {
    // タッチ数が2点に満たない場合は1を返す
    if (e.targetTouches.length < 2) return 0;

    const {clientX: x0, clientY: y0} = e.targetTouches[0];
    const {clientX: x1, clientY: y1} = e.targetTouches[1];
    const distance = ((x1 - x0) ** 2) + ((y1 - y0) ** 2);
    return Math.sqrt(Math.abs(distance));
  }

  getNormalizePosBetweenTouches(e: TouchEvent): [number, number] {
    if (e.targetTouches.length < 2) return [0.5, 0.5];
    const {clientX: x0, clientY: y0} = e.targetTouches[0];
    const {clientX: x1, clientY: y1} = e.targetTouches[1];
    const {w: rw, h: rh} = this.state.zoomRect;

    // between x
    const bx = (x0 + x1) / 2;
    // between y
    const by = (y0 + y1) / 2;

    return [bx / rw, by / rh];
  }

  private pinchZoom(e: TouchEvent, baseDistance: number) {
    const distance = this.getDistanceBetweenTouches(e);

    const m = distance / baseDistance;
    const {minRatio, maxRatio} = this.state;
    let multiply = (m < 1)
    ? this.state.zoomMultiply * 0.9
    : this.state.zoomMultiply * 1.1;

    const zoomMultiply = Math.max(Math.min(multiply, maxRatio), minRatio);
    const [zoomX, zoomY] = this.getNormalizePosBetweenTouches(e);

    this.enable(zoomMultiply, zoomX, zoomY);
  }

  private get scaleProperty(): string {
    return `scale(${this.state.zoomMultiply})`;
  }

  private get translateProperty(): string {
    return `translate(${this.state.zoomRect.l}px, ${this.state.zoomRect.t}px)`;
  }

  private touchMoveHandler(e: TouchEvent) {
    if (isMultiTouch(e)) {
      // multi touch
      e.preventDefault();

      this.pinchZoom(e, this.state.pinchBaseDistance)
    } else {
      // single touch
      const {clientX: x, clientY: y} = e.targetTouches[0]
      this.state.isSwiped = true;
      this.setTranslate(x, y);
      this.updateMousePos(x, y);
    }
  }

  private applyEventListeners() {
    if (isMobile()) {
      this.el.addEventListener("touchstart", e => {
        e.preventDefault();
        const baseDistance = this.getDistanceBetweenTouches(e);
        this.state.pinchBaseDistance = baseDistance;
        this.state.pinchPastDistance = baseDistance;
        this.state.isSwiped = false;
      })

      this.el.addEventListener("touchmove", rafThrottle(e => this.touchMoveHandler(e)), passiveFalseOption)

      this.el.addEventListener("touchend", () => {
        if (this.state.isSwiped || this.state.zoomMultiply > 1) return;
        // ズーム倍率が1の場合はズームモードを終了させる
        this.disable();
      })
    } else {
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
        this.setTranslate(e.clientX, e.clientY);
        this.updateMousePos(e.clientX, e.clientY);
      }));

    }
  }

  private updateMousePos(x: number, y: number) {
    this.state.pastX = x;
    this.state.pastY = y;
  }

  updateZoomRect(translateX?: number, translateY?: number) {
    let zoomRect: PageRect;
    if (translateX !== void 0 && translateY !== void 0) {
      const { clientHeight: rootCH, clientWidth: rootCW } = this.rootEl;
      const multiply = this.state.zoomMultiply;
      zoomRect = {
        l: translateX,
        t: translateY,
        w: rootCW * multiply,
        h: rootCH * multiply
      }
    } else {
      zoomRect = this.getElRect();
    }
    this.state.zoomRect = zoomRect;
  }

  private getElRect(): PageRect {
    const rect = this.el.getBoundingClientRect();
    return {
      t: rect.top,
      l: rect.left,
      w: rect.width,
      h: rect.height,
    }
  }

  /**
   * 指定された座標に応じてzoomWrapperのtranslateの値を動かす
   * @param  currentX x座標
   * @param  currentY y座標
   */
  private setTranslate(currentX: number, currentY: number) {
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

    this.zoomWrapper.style.transform = `${this.translateProperty} ${this.scaleProperty}`;
  }

  /**
   * ズームモードに入る
   */
  enable(zoomMultiply: number = 1.5, zoomX: number = 0.5, zoomY: number = 0.5) {
    this.enableController();
    this.enableZoom(zoomMultiply, zoomX, zoomY);
  }

  enableZoom(zoomMultiply: number = 1.5, zoomX: number = 0.5, zoomY: number = 0.5) {
    const {w: rw, h: rh} = this.state.zoomRect;
    const translateX = -((rw * zoomMultiply - rw) * zoomX);
    const translateY = -((rh * zoomMultiply - rh) * zoomY);

    this.state.zoomMultiply = zoomMultiply;
    this.updateZoomRect(translateX, translateY);

    // 引数を省略した場合は中央寄せでズームする
    this.zoomWrapper.style.transform = `translate(${translateX}px, ${translateY}px) scale(${zoomMultiply})`;
  }

  enableController() {
    const zoomed = this.builder.stateNames.zoomed;
    this.zoomWrapper.classList.add(zoomed);
    this.state.isZoomed = true;
  }

  /**
   * ズームモードから抜ける
   */
  disable() {
    const zoomed = this.builder.stateNames.zoomed;
    this.zoomWrapper.classList.remove(zoomed);
    this.state.isZoomed = false;

    this.state.zoomMultiply = 1.0;
    this.zoomWrapper.style.transform = "";
  }
}
