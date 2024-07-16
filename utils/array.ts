export const findItem = <T extends { id: string | number }>(
  array: Array<T>,
  _id: number | string
): null | T => {
  const feedIndex = array.findIndex(({ id }) => id === _id);
  if (feedIndex === -1) {
    //try to fetch in backend
    return null;
  }
  return array[feedIndex];
};
