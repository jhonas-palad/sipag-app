export const secToMs = (seconds: number) => {
  return seconds * 1000;
};

export const minToSec = (min: number) => {
  return min * secToMs(60);
};
