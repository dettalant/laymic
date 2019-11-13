import { BarWidth, LaymicPages } from "#/interfaces/index";
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

let _viewerCntNum = 0;
/**
 * インスタンスで固有のviewerIdを出力するための関数
 * 呼び出されるたびにインクリメントするだけ
 * @return  固有のviewerId数値
 */
export const viewerCnt = () => {
  return _viewerCntNum++;
}

/**
 * 一定時間ウェイトを取る
 * @param  ms ウェイト秒数。ミリ秒で指定
 * @return    Promiseに包まれたsetTimeout戻り値
 */
export const sleep = (ms: number) => new Promise<Function>((res) => setTimeout(res, ms))

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

export const isExistTouchEvent = (): boolean => {
  return "ontouchmove" in window;
}

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
export const rafThrottle = function<T extends Element, E extends Event>(callback: (ev: E) => void) {
  let requestId = 0;
  return function(this: T, ev: E) {
    if (requestId) return;
    requestId = requestAnimationFrame(() => {
      requestId = 0;
      callback.call(this, ev);
    });
  }
}

export const isHTMLElementArray = (array: any): array is HTMLElement[] => {
  let bool = true;

  if (Array.isArray(array) && array.length > 0) {
    array.forEach(v => {
      const b = v instanceof HTMLElement;
      if (!b) bool = false;
    })
  } else {
    bool = false;
  }

  return bool;
}

export const isBarWidth = (s: any): s is BarWidth => {
  return s === "auto" || s === "none" || s === "tint" || s === "bold" || s === "medium";
}

export const compareString = <T, U>(s: string, cmp: string, success: T, failed?: U): T | U | undefined => {
  return s.toLowerCase() === cmp.toLowerCase() ? success : failed;
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
