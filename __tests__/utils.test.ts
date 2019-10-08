import { calcGCD, viewerCnt } from "#/utils"

describe("utils function test", () => {
  it("calcGCD test", () => {
    const [w, h] = [1920, 1080];
    const gcd = calcGCD(w, h);
    expect(gcd).toBe(120);
  })

  it("viewerCnt test", () => {
    expect(viewerCnt()).toBe(0);
    expect(viewerCnt()).toBe(1);
  })
})
