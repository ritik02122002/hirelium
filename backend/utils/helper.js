export const getRandomValue = (from, to) => {
  return from + Math.floor(Math.random() * (to - from + 1));
};
