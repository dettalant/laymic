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
/**
 * 画像をimg要素として読み取る
 * @param   path 画像path文字列
 * @return       Promiseに包まれたHTMLImageElement
 */
export declare const readImage: (path: string) => Promise<HTMLImageElement>;
export declare const isMobile: () => boolean;
export declare const isExistTouchEvent: () => boolean;
export declare const isExistPointerEvent: () => boolean;
