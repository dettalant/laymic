import { BarWidth, UIVisibility } from "#/interfaces/ui"
import { SimpleSelect } from "@dettalant/simple_choices";


export interface PreferenceData {
  // 自動的に全画面化するかの設定値
  isAutoFullscreen: boolean,
  // タップでのページ送りを停止させるかの設定値
  isDisableTapSlidePage: boolean,
  // 進捗バーの太さ設定値
  progressBarWidth: BarWidth,
  // ページ送りボタンの表示設定値
  paginationVisibility: UIVisibility
  // PC表示での固定ズーム倍率設定値
  zoomButtonRatio: number,
}

// export interface PreferenceButtons extends Record<keyof PreferenceData, HTMLButtonElement>{}
export type PreferenceButtons = Record<keyof PreferenceData, HTMLButtonElement>;
//
// export interface PreferenceButtons {
//   isAutoFullscreen: HTMLButtonElement,
//   isDisableTapSlidePage: HTMLButtonElement,
//   progressBarWidth: SimpleSelect,
//   paginationVisibility: SimpleSelect,
//   zoomButtonRatio: SimpleSelect,
// }

export type PreferenceChoices = Record<keyof Omit<PreferenceData, "isAutoFullscreen" | "isDisableTapSlidePage">, SimpleSelect>

export type PreferenceUpdateEventString = keyof PreferenceData | "";
