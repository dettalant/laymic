import { BarWidth, UIVisibility, LaymicPages, OrientationString } from "./interfaces/index";
/**
 * 最大公約数を計算する
 * ユークリッドの互除法を使用
 * @param  x 最終的に出力される公約数
 * @param  y 直前の計算での残余。これが0になるまで処理を続ける
 * @return   計算結果の最大公約数
 */
export const calcGCD = (x: number, y: number) => {
  while (y !== 0) {
    const tx = x;
    x = y;
    y = tx % y;
  }
  return x;
}

/**
 * インスタンスで固有のviewerIdを出力するための関数
 * 呼び出されるたびにインクリメントするだけ
 * @return  固有のviewerId数値
 */
export const viewerCnt = (() => {
  let _viewerCntNum = 0;
  return () => _viewerCntNum++;
})()

/**
 * 一定時間ウェイトを取る
 * @param  ms ウェイト秒数。ミリ秒で指定
 * @return    Promiseに包まれたsetTimeout戻り値
 */
export const sleep = (ms: number) => new Promise<Function>((res) => setTimeout(res, ms))

export const rafSleep = () => new Promise(res => requestAnimationFrame(res));

export const multiRafSleep = async (len: number = 2) => {
  const range = [...Array(len)].map((_, i) => i);
  for (let _ of range) {
    await rafSleep()
  }
}

// /**
//  * 画像をimg要素として読み取る
//  * @param   path 画像path文字列
//  * @return       Promiseに包まれたHTMLImageElement
//  */
// export const readImage = (path: string): Promise<HTMLImageElement> => {
//   return new Promise((res, rej) => {
//     const img = new Image();
//     img.onload = () => res(img);
//     img.onerror = (e) => rej(e);
//     img.src = path;
//   })
// }

export const isMobile = (): boolean => {
  const regex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Mobile|Opera Mini/i;
  return regex.test(window.navigator.userAgent);
}

// export const isExistTouchEvent = (): boolean => {
//   return "ontouchmove" in window;
// }

export const isSupportedPassive = () => {
  let passive = false;
  const options = Object.defineProperty({}, "passive", {
    get() { passive = true; }
  });
  const testFunc = () => {}
  window.addEventListener("test", testFunc, options);
  window.removeEventListener("test", testFunc);
  return passive;
}

export const passiveFalseOption: AddEventListenerOptions | false = (isSupportedPassive()) ? {passive: false} : false;

export const isMultiTouch = (e: TouchEvent): boolean =>  {
  return e.targetTouches.length > 1;
}

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
export const rafThrottle = function<
  T extends Element,
  E extends Event
>(callback: (ev: E) => void) {
  let requestId = 0;
  return function(this: T, ev: E) {
    if (requestId) return;
    requestId = requestAnimationFrame(() => {
      requestId = 0;
      callback.call(this, ev);
    });
  }
}

export const cancelableRafThrottle = function<
  T extends Element,
  E extends Event,
>(callback: (ev: E) => void) {
  let requestId = 0;
  const listener = function(this: T, ev: E) {
    if (requestId) return;
    requestId = requestAnimationFrame(() => {
      requestId = 0;
      callback.call(this, ev);
    });
  }

  const canceler = () => {
    cancelAnimationFrame(requestId);
    requestId = 0;
  }

  return {
    listener,
    canceler
  }
}

// export const createDoubleTapHandler = function<
//   T extends HTMLElement,
//   E extends TouchEvent
// > (
//   callback: (e: E) => void,
//   ms: number = 500,
//   distance: number = 40
// ) {
//   let tapCnt = 0;
//   let pastX = 0;
//   let pastY = 0;
//
//   const isContainedDistance = (e: TouchEvent): boolean => {
//     const {clientX: cx, clientY: cy} = e.changedTouches[0];
//     const diffX = Math.abs(cx - pastX);
//     const diffY = Math.abs(cy - pastY);
//
//     return diffX < distance && diffY < distance;
//   }
//
//   const setPastPos = (e: TouchEvent) => {
//     const {clientX: cx, clientY: cy} = e.changedTouches[0];
//     pastX = cx;
//     pastY = cy;
//   }
//
//   return function(this: T, e: E) {
//     if (!tapCnt) {
//       tapCnt++;
//       sleep(ms).then(() => {
//         tapCnt = 0;
//       });
//     } else if (isContainedDistance(e)) {
//       // ダブルタップ処理
//       callback.call(this, e);
//       tapCnt = 0;
//     }
//     setPastPos(e)
//   }
// }

// ipadではdblclick eventが使えないと聞いたので
// click eventで同じ操作を代用するためのもの
export const createDoubleClickHandler = function<
  T extends HTMLElement,
  E extends MouseEvent
> (
  callback: (e: E) => void,
  ms: number = 500,
) {
  let clickCnt = 0;
  return function(this: T, e: E) {
    if (!clickCnt) {
      clickCnt++;
      sleep(ms).then(() => {
        clickCnt = 0;
      })
    } else {
      callback.call(this, e);
      clickCnt = 0;
    }
  }
}

// export const isHTMLElementArray = (array: any): array is HTMLElement[] => {
//   let bool = true;
//
//   if (Array.isArray(array) && array.length > 0) {
//     array.forEach(v => {
//       const b = v instanceof HTMLElement;
//       if (!b) bool = false;
//     })
//   } else {
//     bool = false;
//   }
//
//   return bool;
// }

export const isBarWidth = (s: any): s is BarWidth => {
  return s === "auto" || s === "none" || s === "tint" || s === "bold" || s === "medium";
}

export const isUIVisibility = (s: any): s is UIVisibility => {
  return s === "auto" || s === "none" || s === "visible";
}

export const compareString = <T>(s: string, cmp: string, success: T): T | undefined => {
  return s.toLowerCase() === cmp.toLowerCase() ? success : undefined;
}

export const excludeHashLocation = () => location.protocol + "//" + location.host + location.pathname + location.search;

export const calcWindowVH = (el: HTMLElement = document.documentElement) => {
  const vh = window.innerHeight * 0.01;
  el.style.setProperty("--js-vh", vh + "px");
}

export const isLaymicPages = (pages: any): pages is LaymicPages => {
  return "pages" in pages && Array.isArray(pages.pages);
}

// /**
//  * ViewerPages内はじめのHTMLImageElementのsrcを取得する
//  * @param  pages laymicに指定された全ページ
//  * @return       取得したsrc文字列。取得できなければ空欄を返す
//  */
// export const getBeginningSrc = (pages: ViewerPages): string => {
//   let result = "";
//   for (let p of pages) {
//     if (typeof p === "string") {
//       result = p;
//       break;
//     } else if (p instanceof HTMLImageElement) {
//       result = p.dataset.src || p.src;
//       break;
//     }
//   }
//   return result;
// }

/**
 * KeyboardEvent.keyの値が指定されたものと同じであるかをチェックする。
 * @param key    KeyboardEvent.keyの値
 * @param cmpKey 比較する文字列。文字列配列も指定可能
 */
export const parseKey = (key: string, cmpKey: string | string[]): boolean => {
  const cmp = (typeof cmpKey === "string")
    ? [cmpKey]
    : cmpKey;

  return cmp.includes(key);
}

export const keydownHandlers: ((e: KeyboardEvent) => void)[] = [];
export const parentKeydownHandler = (e: KeyboardEvent) => {
  keydownHandlers.forEach(func => func(e));
}

export const orientationChangeHandlers: Function[] = [];

export const parentOrientationChangeHandler = () => {
  orientationChangeHandlers.forEach(func => func())
}

export const getDeviceOrientation = (): OrientationString => {
  let orientation: OrientationString = "unknown";
  if (screen.orientation) {
    const type = screen.orientation.type;
    if (type.includes("landscape")) orientation = "landscape";
    if (type.includes("portrait")) orientation = "portrait";
  } else if (window.orientation) {
    orientation = (parseInt(window.orientation.toString(), 10) % 180)
    ? "landscape"
    : "portrait";
  }

  return orientation;
}

export const setAriaExpanded = (el: HTMLElement, bool: boolean) => el.setAttribute("aria-expanded", (bool) ? "true" : "false");

export const setRole = (el: HTMLElement, role: string) => el.setAttribute("role", role);
