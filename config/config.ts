import { DEFAULT_THEME } from "@mantine/styles";

export const MINIMUM_NUMBERS_OF_PLAYERS = 2;
export const MAXIMUM_NUMBERS_OF_PLAYERS = 10;

export const DEFAULT_STARTING_BLIND = 20;
export const DEFAULT_TOTAL_NUMBER_OF_CHIPS = 1000;

export const DEFAULT_TOTAL_DURATION = 180;
export const DEFAULT_DURATION_OF_ROUND = 20;

const getColor = (color: keyof typeof DEFAULT_THEME.colors) => {
  return DEFAULT_THEME.colors[color][6];
};

export const colors = [
  getColor("blue"),
  getColor("red"),
  getColor("violet"),
  getColor("yellow"),
  getColor("green"),
  getColor("orange"),
  getColor("gray"),
  getColor("lime"),
  getColor("indigo"),
  getColor("pink"),
  getColor("teal"),
  getColor("dark"),
  getColor("violet"),
  getColor("cyan"),
];

export const STORAGE_KEY = "poker-timer.settings";
