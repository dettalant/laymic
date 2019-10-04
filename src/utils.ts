// 最大公約数を計算する
// ユークリッドの互除法を使用
export const calcGCD = (x: number, y: number) => {
  while (y !== 0) {
    const tx = x;
    x = y;
    y = tx % y;
  }
  return x;
}

let _viewerCntNum = 0;
export const viewerCnt = () => {
  return _viewerCntNum++;
}

export const sleep = (ms: number) => new Promise<Function>((res) => setTimeout(res, ms))

export const readImage = (path: string): Promise<HTMLImageElement> => {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = (e) => rej(e);
    img.src = path;
  })
}
