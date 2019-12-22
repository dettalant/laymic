import Preference from "#/components/preference";
import DOMBuilder from "#/components/builder";
import { BarWidth, UIVisibility } from "#/interfaces/index";

describe("preference class test", () => {
  const builder = new DOMBuilder();
  const rootEl = builder.createDiv();
  const preference = new Preference(builder, rootEl);
  it("save & load preference data", () => {
    preference["savePreferenceData"]();
    const data = preference["loadPreferenceData"]();
    expect(typeof data.isAutoFullscreen === "boolean").toBeTruthy();
    expect(typeof data.isDisabledTapSlidePage === "boolean").toBeTruthy();
    expect(typeof data.isDisabledDoubleTapResetZoom === "boolean").toBeTruthy();
    expect(typeof data.paginationVisibility === "string").toBeTruthy();
    expect(typeof data.progressBarWidth === "string").toBeTruthy();
    expect(typeof data.zoomButtonRatio === "number").toBeTruthy();
  })

  it("isAutoFullscreen test", () => {
    const testValues: boolean[] = [
      true,
      false
    ];
    testValues.forEach(bool => {
      preference.isAutoFullscreen = bool;

      expect(preference.isAutoFullscreen).toBe(bool);
      expect(preference["loadPreferenceData"]().isAutoFullscreen).toBe(bool);
    })
  })

  it("isEnableTapSlidePage test", () => {
    const testValues: boolean[] = [
      true,
      false
    ];
    testValues.forEach(bool => {
      preference.isDisabledTapSlidePage = bool;

      expect(preference.isDisabledTapSlidePage).toBe(bool);
      expect(preference["loadPreferenceData"]().isDisabledTapSlidePage).toBe(bool);
    })
  })

  it("paginationVisibility test", () => {
    const testValues: UIVisibility[] = [
      "hidden",
      "visible",
      "auto"
    ];

    testValues.forEach(value => {
      preference.paginationVisibility = value;

      expect(preference.paginationVisibility).toBe(value);
      expect(preference["loadPreferenceData"]().paginationVisibility).toBe(value);
    })
  })

  it("progressBarWidth test", () => {
    const testValues: BarWidth[] = [
      "none",
      "auto",
      "bold",
      "medium",
      "tint"
    ];
    testValues.forEach(value => {
      preference.progressBarWidth = value;
      expect(preference.progressBarWidth).toBe(value);
      expect(preference["loadPreferenceData"]().progressBarWidth).toBe(value);
    })
  })

  it("zoomButtonRatio test", () => {
    const testValues = [
      2.5,
      3.0,
      2.0,
      // ここから実用はしないけど指定できる数値
      2.2,
      3.3,
      10,
      1.5,
    ];

    testValues.forEach(value => {
      preference.zoomButtonRatio = value;
      expect(preference.zoomButtonRatio).toBe(value);
      expect(preference["loadPreferenceData"]().zoomButtonRatio).toBe(value);
    })
  })

  it("dispatchPreferenceUpdateEvent test", done => {
    const testStr = "isAutoFullscreen";
    preference.rootEl.addEventListener("LaymicPreferenceUpdate", ((e: CustomEvent<string>) => {
      if (e.detail === testStr) {
        expect(true).toBeTruthy();
        done();
      }
    }) as EventListener);

    preference["dispatchPreferenceUpdateEvent"](testStr);
  })
})
