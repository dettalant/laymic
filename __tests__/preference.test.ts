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
    expect(typeof data.isDisableTapSlidePage === "boolean").toBeTruthy();
    expect(typeof data.paginationVisibility === "string").toBeTruthy();
    expect(typeof data.progressBarWidth === "string").toBeTruthy();
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
      preference.isDisableTapSlidePage = bool;

      expect(preference.isDisableTapSlidePage).toBe(bool);
      expect(preference["loadPreferenceData"]().isDisableTapSlidePage).toBe(bool);
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

  it("applyCurrentPreferenceValue test", () => {
    const key = preference["PREFERENCE_KEY"];
    const data = preference["loadPreferenceData"]();

    const pbwValue = "none";
    const pvValue = "visible";
    const zbrValue = 2.5;

    data.isAutoFullscreen = true;
    data.isDisableTapSlidePage = true;
    data.progressBarWidth = pbwValue;
    data.paginationVisibility = pvValue;
    data.zoomButtonRatio = zbrValue;

    localStorage.setItem(key, JSON.stringify(data));

    const preference2 = new Preference(builder, rootEl);
    const uiVisibilityValues = preference2["uiVisibilityValues"];

    const barWidthValues = preference2["barWidthValues"];
    const zoomButtonRatioValues = preference2["zoomButtonRatioValues"];
    const {
      isAutoFullscreen,
      isDisableTapSlidePage,
      progressBarWidth,
      paginationVisibility,
      zoomButtonRatio
    } = preference2.buttons;

    const progressbarIdx = barWidthValues.indexOf(pbwValue);
    const paginationIdx = uiVisibilityValues.indexOf(pvValue);
    const zoomIdx = zoomButtonRatioValues.indexOf(zbrValue);

    const active = preference2.builder.stateNames.active;

    preference2["applyPreferenceValues"]();

    expect(isAutoFullscreen.classList.contains(active)).toBeTruthy();
    expect(isDisableTapSlidePage.classList.contains(active)).toBeTruthy();

    [
      {
        el: progressBarWidth,
        idx: progressbarIdx,
      },
      {
        el: paginationVisibility,
        idx: paginationIdx,
      },
      {
        el: zoomButtonRatio,
        idx: zoomIdx
      }
    ].forEach(obj => {
      const els = preference2["getSelectItemEls"](obj.el) as HTMLElement[];
      els.forEach(el => {
        if (el.dataset.itemIdx === obj.idx.toString()) {
          // 選択状態の一つのみがorder === "-1"となる
          expect(el.style.order).toBe("-1");
        } else {
          expect(el.style.order).toBe("");
        }
      })
    })
  })
})
