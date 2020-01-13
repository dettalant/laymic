import { BarWidth, UIVisibility, LaymicPages, OrientationString } from "./interfaces/index";
/**
 * 最大公約数を計算する
 * ユークリッドの互除法を使用
 * @param  x 最終的に出力される公約数
 * @param  y 直前の計算での残余。これが0になるまで処理を続ける
 * @return   計算結果の最大公約数
 */
export declare const calcGCD: (x: number, y: number) => number;
/**
 * インスタンスで固有のviewerIdを出力するための関数
 * 呼び出されるたびにインクリメントするだけ
 * @return  固有のviewerId数値
 */
export declare const viewerCnt: () => number;
/**
 * 一定時間ウェイトを取る
 * @param  ms ウェイト秒数。ミリ秒で指定
 * @return    Promiseに包まれたsetTimeout戻り値
 */
export declare const sleep: (ms: number) => Promise<Function>;
export declare const rafSleep: () => Promise<unknown>;
export declare const multiRafSleep: (len?: number) => Promise<void>;
export declare const isMobile: () => boolean;
export declare const isSupportedPassive: () => boolean;
export declare const passiveFalseOption: AddEventListenerOptions | false;
export declare const isMultiTouch: (e: TouchEvent) => boolean;
/**
 * requestAnimationFrameを用いて呼び出し頻度を下げた関数を返す
 * addEventListener第二引数に用いられることを想定。
 *
 * 使用例
 * ```javascript
 *  el.addEventListener("mousemove", rafThrottle((e) => {
 *    console.log(e);
 *  }))
 * ```
 *
 * @param  callback 頻度を下げて呼び出されるコールバック関数
 * @return          イベントデータを受け取る関数
 */
export declare const rafThrottle: <T extends Element, E extends Event>(callback: (ev: E) => void) => (this: T, ev: E) => void;
export declare const cancelableRafThrottle: <T extends Element, E extends Event>(callback: (ev: E) => void) => {
    listener: (this: T, ev: E) => void;
    canceler: () => void;
};
export declare const wheelThrottle: <T extends Element, E extends WheelEvent>(callback: (ev: E) => void) => (this: T, ev: E) => void;
export declare const createDoubleClickHandler: <T extends HTMLElement, E extends MouseEvent>(callback: (e: E) => void, ms?: number) => (this: T, e: E) => void;
export declare const isBarWidth: (s: any) => s is BarWidth;
export declare const isUIVisibility: (s: any) => s is UIVisibility;
export declare const compareString: <T>(s: string, cmp: string, success: T) => T | undefined;
export declare const excludeHashLocation: () => string;
export declare const calcWindowVH: (el?: HTMLElement) => void;
export declare const isLaymicPages: (pages: any) => pages is LaymicPages;
/**
 * KeyboardEvent.keyの値が指定されたものと同じであるかをチェックする。
 * @param key    KeyboardEvent.keyの値
 * @param cmpKey 比較する文字列。文字列配列も指定可能
 */
export declare const parseKey: (key: string, cmpKey: string | string[]) => boolean;
export declare const keydownHandlers: ((e: KeyboardEvent) => void)[];
export declare const parentKeydownHandler: (e: KeyboardEvent) => void;
export declare const orientationChangeHandlers: Function[];
export declare const parentOrientationChangeHandler: () => void;
export declare const getDeviceOrientation: () => OrientationString;
export declare const setAriaExpanded: (el: HTMLElement, bool: boolean) => void;
export declare const setRole: (el: HTMLElement, role: string) => void;
