import { BarWidth, UIVisibility } from "#/interfaces/ui"

export interface PreferenceData {
  isAutoFullscreen: boolean,
  isDisableTapSlidePage: boolean,
  progressBarWidth: BarWidth,
  paginationVisibility: UIVisibility
}

export type PreferenceButtons = Record<keyof PreferenceData, HTMLButtonElement>;

export type PreferenceUpdateEventString = keyof PreferenceData | "";
