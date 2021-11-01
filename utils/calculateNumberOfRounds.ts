import { DurationSettings } from "../types/DurationSettings";

export const calculateNumberOfRounds = (durationSettings: DurationSettings) => {
  return Math.floor(
    durationSettings.totalDurationInMinutes /
      durationSettings.changeEveryXMinutes
  );
};
