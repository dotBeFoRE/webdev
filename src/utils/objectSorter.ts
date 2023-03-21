const objectSort = <T extends Record<string, unknown>>(obj: T): T => {
  const sorted = {} as Record<string, unknown>;
  Object.keys(obj)
    .sort()
    .forEach((key) => {
      sorted[key] = obj[key];
    });
  return sorted as T;
};

export default objectSort;
