import DOMBuilder from "./builder";
import { PageRect, LaymicZoomStates } from "../interfaces/index";
import LaymicPreference from "./preference";
import { rafThrottle, isMobile, passiveFalseOption, isMultiTouch } from "../utils";

export default class LaymicZoom {
  rootEl: HTMLElement;
  wrapper: HTMLElement;
  controller: HTMLElement;
  builder: DOMBuilder;
  preference: LaymicPreference
  state: LaymicZoomStates = this.defaultLaymicZoomStates;
  constructor(builder: DOMBuilder, rootEl: HTMLElement, preference: LaymicPreference) {
    const zoomEl = builder.createDiv();
    zoomEl.className = builder.classNames.zoom.controller;

    this.controller = zoomEl;
    this.rootEl = rootEl;
    this.wrapper = builder.createZoomWrapper()
    this.builder = builder;
    this.preference = preference;

    this.applyEventListeners();
  }

  /**
   * LaymicZoomStatesのデフォルト値を返す
   * @return LaymicZoomStatesデフォルト値
   */
  get defaultLaymicZoomStates(): LaymicZoomStates {
    return {
      zoomRatio: 1.0,
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
      pastDistance: 1
    }
  }

  /**
   * 現在ズームがなされているかを返す
   * @return zoomRatioが1以上ならばtrue
   */
  get isZoomed(): boolean {
    return this.state.zoomRatio > 1;
  }

  /**
   * 現在のzoomRatioの値を返す
   * @return zoomRatioの値
   */
  get zoomRatio(): number {
    return this.state.zoomRatio;
  }

  /**
   * タッチされた二点間の距離を返す
   * reference: https://github.com/nolimits4web/swiper/blob/master/src/components/zoom/zoom.js
   *
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

  /**
   * タッチされた二点の座標の中心点から、
   * 正規化された拡大時中心点を返す
   *
   * @param  e TouchEvent
   * @return   [betweenX, betweenY]
   */
  getNormalizedPosBetweenTouches(e: TouchEvent): [number, number] {
    if (e.targetTouches.length < 2) return [0.5, 0.5];
    const {l: rl, t: rt, w: rw, h: rh} = this.state.zoomRect;
    const {clientX: x0, clientY: y0} = e.targetTouches[0];
    const {clientX: x1, clientY: y1} = e.targetTouches[1];

    const rx = Math.abs(rl);
    const ry = Math.abs(rt);

    // between x
    const bx = ((x0 + rx) + (x1 + ry)) / 2;
    // between y
    const by = ((y0 + ry) + (y1 + ry)) / 2;

    return [bx / rw, by / rh];
  }

  /**
   * 画面中央座標を正規化して返す
   * @return [centeringX, centeringY]
   */
  getNormalizedCurrentCenter(): [number, number] {
    const {innerWidth: cw, innerHeight: ch} = window;
    // const {clientWidth: cw, clientHeight: ch} = this.rootEl;
    const {l: rx, t: ry, w: rw, h: rh} = this.state.zoomRect;
    const maxX = rw - cw;
    const maxY = rh - ch;

    // `0 / 0`とした際はNaNとなってバグが出るので
    // max値に1を足しておく
    const nx = Math.abs(rx) / (maxX + 1);
    const ny = Math.abs(ry) / (maxY + 1);

    // 戻り値が[0, 0]の場合は[0.5, 0.5]を返す
    return (nx !== 0 || ny !== 0) ? [nx, ny] : [0.5, 0.5];
  }

  /**
   * 現在のzoomRatioの値からscale設定値を生成する
   * @return css transformに用いる設定値
   */
  private get scaleProperty(): string {
    return `scale(${this.state.zoomRatio})`;
  }

  /**
   * 現在のzoomRectの値からtranslate設定値を生成する
   * @return css transformに用いる設定値
   */
  private get translateProperty(): string {
    return `translate(${this.state.zoomRect.l}px, ${this.state.zoomRect.t}px)`;
  }

  /**
   * touchstartに対して登録する処理まとめ
   * @param  e タッチイベント
   */
  private touchStartHandler(e: TouchEvent) {
    e.stopPropagation();
    this.state.isSwiped = false;

    // for swipe
    const {clientX: x, clientY: y} = e.targetTouches[0];
    this.updatePastPos(x, y);

    // for pinch out/in
    this.updatePastDistance(e)
  }

  /**
   * touchmoveイベントに対して登録する処理まとめ
   * @param  e タッチイベント
   */
  private touchMoveHandler(e: TouchEvent) {
    e.stopPropagation();
    e.preventDefault();
    if (isMultiTouch(e)) {
      // multi touch
      this.pinchZoom(e);
    } else {
      // single touch
      const {clientX: x, clientY: y} = e.targetTouches[0];
      this.state.isSwiped = true;

      this.setTranslate(x, y);
      this.updatePastPos(x, y);
    }
  }

  /**
   * もろもろのEventListenerを登録する
   * インスタンス生成時に一度だけ呼ばれることを想定
   */
  private applyEventListeners() {
    const applyEventsForMobile = () => {
      this.controller.addEventListener("touchstart", e => this.touchStartHandler(e));

      this.controller.addEventListener("touchmove", rafThrottle(e => this.touchMoveHandler(e)), passiveFalseOption);

      this.controller.addEventListener("touchend", (e) => {
        e.stopPropagation();
        if (this.state.isSwiped || this.isZoomed) return;
        // ズーム倍率が1の場合はズームモードを終了させる
        this.disable();
      });

      // タップすると標準倍率に戻す処理
      // touchendで行うといまいちな操作感なので
      // clickイベントを使用
      this.controller.addEventListener("click", () => {
        // 関連設定値がfalseの場合は早期リターン
        if (!this.preference.isTapResetZoom) return;
        this.disable();
      })
    }

    const applyEventsForPC = () => {
      this.controller.addEventListener("click", () => {
        // ドラッグ操作がなされている場合は処理をスキップ
        if (this.state.isSwiped) return;

        // zoom要素クリックでzoom解除
        this.disable();
      });

      this.controller.addEventListener("mousedown", e => {
        this.state.isMouseDown = true;
        this.state.isSwiped = false;

        this.updatePastPos(e.clientX, e.clientY);
      });

      [
        "mouseup",
        "mouseleave"
      ].forEach(ev => this.controller.addEventListener(ev, () => {
        this.state.isMouseDown = false;
      }));

      this.controller.addEventListener("mousemove", rafThrottle(e =>  {
        // mousedown状況下でなければスキップ
        if (!this.state.isMouseDown) return;

        this.state.isSwiped = true;
        this.setTranslate(e.clientX, e.clientY);
        this.updatePastPos(e.clientX, e.clientY);
      }));
    }

    // モバイルとPCで適用イベント変更
    if (isMobile()) {
      applyEventsForMobile()
    } else {
      applyEventsForPC();
    }
  }

  /**
   * 過去の座標値を更新する
   * @param  x 新しいx座標
   * @param  y 新しいy座標
   */
  private updatePastPos(x: number, y: number) {
    this.state.pastX = x;
    this.state.pastY = y;
  }

  /**
   * controller要素のサイズを取得する
   * @return PageRectの形式に整えられたサイズ値
   */
  private getControllerRect(): PageRect {
    const rect = this.controller.getBoundingClientRect();
    return {
      t: rect.top,
      l: rect.left,
      w: rect.width,
      h: rect.height,
    }
  }

  /**
   * 指定された座標に応じてwrapperのtranslateの値を動かす
   * @param  currentX x座標
   * @param  currentY y座標
   */
  private setTranslate(currentX: number, currentY: number) {
    const {clientWidth: cw, clientHeight: ch} = this.rootEl;
    const {pastX, pastY, zoomRect} = this.state;
    const {t: ry, l: rx, w: rw, h: rh} = zoomRect;
    const x = pastX - currentX;
    const y = pastY - currentY;

    // これ以上の数値にはならないしきい値
    const maxX = -(rw - cw);
    const maxY = -(rh - ch);

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

    this.wrapper.style.transform = `${this.translateProperty} ${this.scaleProperty}`;
  }

  /**
   * ピンチズーム処理を行う
   * @param  e タッチイベント
   */
  pinchZoom(e: TouchEvent) {
    const distance = this.getDistanceBetweenTouches(e);

    const {innerWidth: iw, innerHeight: ih} = window;
    // 画面サイズの対角線上距離を最大距離とする
    const maxD = Math.sqrt(iw ** 2 + ih ** 2);

    const pinchD = distance - this.state.pastDistance;
    const {minRatio, maxRatio} = this.state;

    // 計算値そのままでは動作が硬いので
    // 感度を6倍にしてスマホブラウザ操作感と近づける
    const ratio = this.state.zoomRatio + (pinchD / maxD) * 6;

    // maxRatio~minRatio間に収まるよう調整
    const zoomRatio = Math.max(Math.min(ratio, maxRatio), minRatio);

    // タッチ座標と画面中央座標を取得し、
    // その平均値をズームの中心座標とする
    const [bx, by] = this.getNormalizedPosBetweenTouches(e);
    const [cx, cy] = this.getNormalizedCurrentCenter();
    const zoomX = (bx + cx) / 2;
    const zoomY = (by + cy) / 2;

    this.enableZoom(zoomRatio, zoomX, zoomY);
    this.state.pastDistance = distance;
  }

  /**
   * zoomRectの値を更新する
   * translateXとtranslateYの値を入力していれば自前で計算し、
   * そうでないなら`getControllerRect()`を呼び出す
   *
   * @param  translateX 新たなleft座標
   * @param  translateY 新たなtop座標
   */
  updateZoomRect(translateX?: number, translateY?: number) {
    let zoomRect: PageRect;
    if (translateX !== void 0 && translateY !== void 0) {
      const { clientHeight: rootCH, clientWidth: rootCW } = this.rootEl;
      const ratio = this.state.zoomRatio;
      zoomRect = {
        l: translateX,
        t: translateY,
        w: rootCW * ratio,
        h: rootCH * ratio
      }
    } else {
      zoomRect = this.getControllerRect();
    }
    this.state.zoomRect = zoomRect;
  }

  updatePastDistance(e: TouchEvent) {
    const distance = this.getDistanceBetweenTouches(e);
    this.state.pastDistance = distance;
  }

  /**
   * ズームモードに入る
   * @param  zoomRatio ズーム倍率
   * @param  zoomX     正規化されたズーム時中央横座標
   * @param  zoomY     正規化されたズーム時中央縦座標
   */
  enable(zoomRatio: number = 1.5, zoomX: number = 0.5, zoomY: number = 0.5) {
    this.enableController();
    this.enableZoom(zoomRatio, zoomX, zoomY);
  }

  /**
   * 拡大縮小処理を行う
   * @param  zoomRatio ズーム倍率
   * @param  zoomX     正規化されたズーム時中央横座標
   * @param  zoomY     正規化されたズーム時中央縦座標
   */
  enableZoom(zoomRatio: number = 1.5, zoomX: number = 0.5, zoomY: number = 0.5) {
    const {clientWidth: cw, clientHeight: ch} = this.rootEl;
    const translateX = -((cw * zoomRatio - cw) * zoomX);
    const translateY = -((ch * zoomRatio - ch) * zoomY);

    this.state.zoomRatio = zoomRatio;
    this.updateZoomRect(translateX, translateY);

    // 引数を省略した場合は中央寄せでズームする
    this.wrapper.style.transform = `translate(${translateX}px, ${translateY}px) scale(${zoomRatio})`;
  }

  /**
   * ズーム時操作要素を前面に出す
   */
  enableController() {
    const zoomed = this.builder.stateNames.zoomed;
    this.wrapper.classList.add(zoomed);
  }

  /**
   * ズームモードから抜ける
   */
  disable() {
    const zoomed = this.builder.stateNames.zoomed;
    this.wrapper.classList.remove(zoomed);

    this.state.zoomRatio = 1.0;
    this.wrapper.style.transform = "";
  }
}
