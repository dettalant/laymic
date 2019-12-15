import { BarWidth, UIVisibility } from "./ui"
import { SimpleSelect, SimpleCheckbox } from "@dettalant/simple_choices";

interface PreferenceCheckboxsData {
  // 自動的に全画面化するかの設定値
  isAutoFullscreen: boolean,
  // タップでのページ送りを停止させるかの設定値
  isDisabledTapSlidePage: boolean,
  // スマホを横持ちした際の強制的2p表示を無効化する設定値
  isDisabledForceHorizView: boolean,
  // スマホにおいてズーム中にタップするとズームリセットを行うようにする設定値
  isTapResetZoom: boolean,
}

interface PreferenceSelectsData {
  // 進捗バーの太さ設定値
  progressBarWidth: BarWidth,
  // ページ送りボタンの表示設定値
  paginationVisibility: UIVisibility
  // PC表示での固定ズーム倍率設定値
  zoomButtonRatio: number,
}

export type PreferenceData = PreferenceCheckboxsData & PreferenceSelectsData;

type PreferenceCheckboxs = Record<keyof PreferenceCheckboxsData, SimpleCheckbox>;
type PreferenceSelects = Record<keyof PreferenceSelectsData, SimpleSelect>;

export type PreferenceChoices = PreferenceCheckboxs & PreferenceSelects;

export type PreferenceUpdateEventString = keyof PreferenceData | "";
