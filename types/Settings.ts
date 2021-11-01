import { DurationSettings } from "./DurationSettings";
import { Player } from "./Player";

export type Settings = {
  players: Player[];
  useDefaultSettings: boolean;
  durationSettings: DurationSettings;
  bigBlinds: number[];
  totalNumberOfChips: number;
};
