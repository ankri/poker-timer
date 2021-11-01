export const calculateBigBlinds = (
  maxNumberOfChips: number,
  numberOfRounds: number
) => {
  const factor = Math.floor(maxNumberOfChips / 1.5 ** numberOfRounds);
  const newBigBlinds = new Array(numberOfRounds).fill(1).map((_, index) => {
    const value = factor * 1.5 ** (index + 1);
    if (index === numberOfRounds - 1) {
      return maxNumberOfChips;
    } else if (value < 200) {
      return Math.ceil((value + 1) / 10) * 10;
    } else {
      return Math.ceil((value + 1) / 25) * 25;
    }
  });

  return newBigBlinds;
};
