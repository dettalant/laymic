import { MangaViewerPreference } from "#/preference";
import { ViewerDOMBuilder } from "#/builder";
import { BarWidth, UIVisibility } from "#/interfaces";

describe("preference class test", () => {
  const builder = new ViewerDOMBuilder();
  const rootEl = builder.createDiv();
  const preference = new MangaViewerPreference(builder, rootEl);
  it("save & load preference data", () => {
    preference["savePreferenceData"]();
    const data = preference["loadPreferenceData"]();
    expect(typeof data.isAutoFullscreen === "boolean").toBeTruthy();
    expect(typeof data.isEnableTapSlidePage === "boolean").toBeTruthy();
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
      preference.isEnableTapSlidePage = bool;

      expect(preference.isEnableTapSlidePage).toBe(bool);
      expect(preference["loadPreferenceData"]().isEnableTapSlidePage).toBe(bool);
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

  it("dispatchPreferenceUpdateEvent test", done => {
    const preferenceTest = "preferenceTest";
    preference.rootEl.addEventListener("MangaViewerPreferenceUpdate", ((e: CustomEvent<string>) => {
      if (e.detail === preferenceTest) {
        expect(true).toBeTruthy();
        done();
      }
    }) as EventListener);

    preference["dispatchPreferenceUpdateEvent"](preferenceTest);
  })

  it("applyCurrentPreferenceValue test", () => {
    const key = preference["PREFERENCE_KEY"];
    const data = preference["loadPreferenceData"]();

    const pbwValue = "none";
    const pvValue = "visible";

    data.isAutoFullscreen = true;
    data.isEnableTapSlidePage = true;
    data.progressBarWidth = pbwValue;
    data.paginationVisibility = pvValue;

    localStorage.setItem(key, JSON.stringify(data));

    const preference2 = new MangaViewerPreference(builder, rootEl);
    const uiVisibilityValues: UIVisibility[] = [
      "auto",
      "hidden",
      "visible",
    ];

    const barWidthValues: BarWidth[] = [
      "auto",
      "none",
      "tint",
      "medium",
      "bold",
    ];
    const {
      isAutoFullscreen,
      isEnableTapSlidePage,
      progressBarWidth,
      paginationVisibility,
    } = preference2.buttons;

    const progressbarIdx = barWidthValues.indexOf(pbwValue);
    const paginationIdx = uiVisibilityValues.indexOf(pvValue);

    const active = preference2.stateNames.active;

    preference2["applyCurrentPreferenceValue"]();

    expect(isAutoFullscreen.classList.contains(active)).toBeTruthy();
    expect(isEnableTapSlidePage.classList.contains(active)).toBeTruthy();

    [
      {
        el: progressBarWidth,
        idx: progressbarIdx,
      },
      {
        el: paginationVisibility,
        idx: paginationIdx,
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
