import { BarWidth, UIVisibility } from "./ui"
import { SimpleSelect, SimpleCheckbox } from "@dettalant/simple_choices";

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

type PreferenceCheckboxs = Record<"isAutoFullscreen" | "isDisableTapSlidePage", SimpleCheckbox>;
type PreferenceSelects = Record<keyof Omit<PreferenceData, keyof PreferenceCheckboxs>, SimpleSelect>;

export type PreferenceChoices = PreferenceCheckboxs & PreferenceSelects;

export type PreferenceUpdateEventString = keyof PreferenceData | "";
