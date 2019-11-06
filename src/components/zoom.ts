import DOMBuilder from "#/components/builder";
import { PageRect } from "#/interfaces";
import { rafThrottle, isMobile, passiveFalseOption, isMultiTouch } from "#/utils";

interface LaymicZoomStates {
  isZoomed: boolean,
  zoomMultiply: number,
  isSwiped: boolean,
  isMouseDown: boolean,
  pastX: number,
  pastY: number,
  baseRect: PageRect,
  zoomRect: PageRect,
  pinchBaseDistance: number,
}

export default class LaymicZoom {
  rootEl: HTMLElement;
  el: HTMLElement;
  builder: DOMBuilder;
  _isZoomed: boolean = false;
  state: LaymicZoomStates = this.defaultLaymicZoomStates;
  constructor(builder: DOMBuilder, rootEl: HTMLElement) {
    const zoomEl = builder.createDiv();
    zoomEl.className = builder.classNames.zoom.controller;

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
      baseRect: {
        t: 0,
        l: 0,
        w: 800,
        h: 600,
      },
      zoomRect: {
        t: 0,
        l: 0,
        w: 800,
        h: 600,
      },
      pinchBaseDistance: 1
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

  private get scaleProperty(): string {
    return `scale(${this.state.zoomMultiply})`;
  }

  private get translateProperty(): string {
    return `translate(${this.state.zoomRect.l}px, ${this.state.zoomRect.t}px)`;
  }

  private applyEventListeners() {
    if (isMobile()) {
      this.el.addEventListener("touchstart", e => {
        e.preventDefault();
        this.state.pinchBaseDistance = this.getDistanceBetweenTouches(e);
        this.state.isSwiped = false;
      })

      this.el.addEventListener("touchmove", rafThrottle(e => {
        if (isMultiTouch(e)) {
          // multi touch
          e.preventDefault();

          const distance = this.getDistanceBetweenTouches(e);

          const m = distance / this.state.pinchBaseDistance;
          let zoomMultiply = (m < 1)
          ? this.state.zoomMultiply * 0.9
          : this.state.zoomMultiply * 1.1;
          if (zoomMultiply < 1) {
            zoomMultiply = 1;
          } else if (zoomMultiply > 3) {
            zoomMultiply = 3;
          }
          const [zoomX, zoomY] = this.getNormalizePosBetweenTouches(e);

          this.enable(zoomMultiply, zoomX, zoomY);
        } else {
          // single touch
          const {clientX: x, clientY: y} = e.targetTouches[0]
          this.state.isSwiped = true;
          this.setRootElTranslate(x, y);
          this.updateMousePos(x, y);
        }
      }), passiveFalseOption)

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
        this.setRootElTranslate(e.clientX, e.clientY);
        this.updateMousePos(e.clientX, e.clientY);
      }));

    }
  }

  private updateMousePos(x: number, y: number) {
    this.state.pastX = x;
    this.state.pastY = y;
  }

  updateZoomRect(translateX: number, translateY: number) {
    const zoomMultiply = this.state.zoomMultiply;
    const {w: baseW, h: baseH} = this.state.baseRect;
    const zoomRect: PageRect = {
      l: translateX,
      t: translateY,
      w: baseW * zoomMultiply,
      h: baseH * zoomMultiply
    };
    this.state.zoomRect = zoomRect;
  }

  updateBaseRect() {
    const elRect = this.getElRect();
    const zoomMultiply = this.state.zoomMultiply
    const baseRect = (zoomMultiply > 1)
      ? {
        t: 0,
        l: 0,
        w: elRect.w / zoomMultiply,
        h: elRect.h / zoomMultiply
      }
      : elRect

    this.state.baseRect = baseRect;
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
  enable(zoomMultiply: number = 1.5, zoomX: number = 0.5, zoomY: number = 0.5) {
    const zoomed = this.builder.stateNames.zoomed;
    this.rootEl.classList.add(zoomed);
    this.state.isZoomed = true;

    const {w: rw, h: rh} = this.state.zoomRect;
    const translateX = -((rw * zoomMultiply - rw) * zoomX);
    const translateY = -((rh * zoomMultiply - rh) * zoomY);

    this.state.zoomMultiply = zoomMultiply;
    this.updateZoomRect(translateX, translateY);

    // 引数を省略した場合は中央寄せでズームする
    this.rootEl.style.transform = `translate(${translateX}px, ${translateY}px) scale(${zoomMultiply})`;
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
