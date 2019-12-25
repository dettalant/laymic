import DOMBuilder from "./builder";
import { PageRect, LaymicZoomStates } from "../interfaces/index";
import LaymicPreference from "./preference";
import { rafThrottle, cancelableRafThrottle, isMobile, passiveFalseOption, isMultiTouch, createDoubleClickHandler} from "../utils";

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
    // focus操作を受け付けるようにしておく
    this.wrapper.tabIndex = -1;

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
   *
   * 真面目な処理だと操作感があまり良くなかったので
   * ズーム状態のしきい値を動かすインチキを行っている。
   *
   * @return ズーム状態であるならtrue
   */
  get isZoomed(): boolean {
    // フルスクリーン状態ではちょっとインチキ、
    // 非フルスクリーン状態ではだいぶインチキ
    const ratio = (this.isFullscreen)
      ? 1.025
      : 1.1;

    return this.state.zoomRatio > ratio;
  }

  /**
   * 現在のzoomRatioの値を返す
   * @return zoomRatioの値
   */
  get zoomRatio(): number {
    return this.state.zoomRatio;
  }

  /**
   * フルスクリーン状態であるかを返す
   * @return フルスクリーン状態であるならtrue
   */
  private get isFullscreen(): boolean {
    return !!document.fullscreenElement
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
  enable(zoomRatio: number = this.preference.zoomButtonRatio, zoomX: number = 0.5, zoomY: number = 0.5) {
    this.enableController();
    this.enableZoom(zoomRatio, zoomX, zoomY);
  }

  /**
   * 拡大縮小処理を行う
   * 引数を省略した場合は中央寄せでズームする
   * @param  zoomRatio ズーム倍率
   * @param  zoomX     正規化されたズーム時中央横座標
   * @param  zoomY     正規化されたズーム時中央縦座標
   */
  enableZoom(zoomRatio: number = this.preference.zoomButtonRatio, zoomX: number = 0.5, zoomY: number = 0.5) {
    const {clientWidth: cw, clientHeight: ch} = this.rootEl;
    const translateX = -((cw * zoomRatio - cw) * zoomX);
    const translateY = -((ch * zoomRatio - ch) * zoomY);

    // 内部値の書き換え
    this.state.zoomRatio = zoomRatio;
    this.updateZoomRect(translateX, translateY);

    // 内部値に応じたcss transformの設定
    // 非フルスクリーン時は内部値だけ変更しcssは据え置き
    this.setTransformProperty();
  }

  /**
   * ズーム時操作要素を前面に出す
   */
  enableController() {
    const zoomed = this.builder.stateNames.zoomed;
    this.wrapper.classList.add(zoomed);

    this.wrapper.focus();
  }

  /**
   * ズームモードから抜ける
   */
  disable() {
    const zoomed = this.builder.stateNames.zoomed;
    this.wrapper.classList.remove(zoomed);
    this.state.zoomRatio = 1.0;
    this.wrapper.style.transform = "";

    // ズーム解除時にはrootElへとフォーカスを移す
    this.rootEl.focus();
  }

  /**
   * タッチされた二点間の距離を返す
   * reference: https://github.com/nolimits4web/swiper/blob/master/src/components/zoom/zoom.js
   *
   * @return 二点間の距離
   */
  private getDistanceBetweenTouches(e: TouchEvent): number {
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
  private getNormalizedPosBetweenTouches(e: TouchEvent): [number, number] {
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
  private getNormalizedCurrentCenter(): [number, number] {
    const {innerWidth: cw, innerHeight: ch} = window;
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
   * css transformの値を設定する
   * ズームが行われていない際、また非フルスクリーン時は
   * cssへのtransform追加を行わない
   */
  private setTransformProperty() {
    const {l: tx, t: ty} = this.state.zoomRect;
    const ratio = this.state.zoomRatio;

    // モバイル環境ではないか、
    // モバイル環境でフルスクリーンの際にのみ
    // transformの値をセットする
    const isSetTransform = this.isFullscreen || !isMobile();

    const transformStr = (this.isZoomed && isSetTransform)
      ? `translate(${tx}px, ${ty}px) scale(${ratio})`
      : "";

    this.wrapper.style.transform = transformStr;
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
    // rafThrottleでの非同期呼び出しを行うので
    // 呼び出し時にisZoomedがfalseとなっていれば早期リターン
    // また、デバイス側ズームがなされている状態でも早期リターン
    if (!this.isZoomed) return;

    e.stopPropagation();
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

      const touchMove = cancelableRafThrottle<HTMLElement, TouchEvent>(e => this.touchMoveHandler(e))
      this.controller.addEventListener("touchmove", touchMove.listener, passiveFalseOption);

      const disableZoom = () => {
        // touchMoveHandlerが非同期処理されないよう
        // キャンセルをかけておく
        touchMove.canceler();
        // zoom処理を強制終了
        this.disable();
      }

      this.controller.addEventListener("touchend", e => {
        e.stopPropagation();
        if (this.state.isSwiped || this.isZoomed) return ;
        // ズーム倍率が一定以下の場合はズームモードを終了させる
        disableZoom();
      });

      // タップすると標準倍率に戻す処理
      this.controller.addEventListener("click", createDoubleClickHandler(() => {
        // 関連する設定がfalseの際には
        // ダブルタップでズーム無効化
        if (!this.preference.isDisabledDoubleTapResetZoom) {
          disableZoom();
        }
      }))
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

    // 設定した値をcss transformとして反映
    this.setTransformProperty();
  }
}
