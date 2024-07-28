const getDeepAttribute = (obj: any, field: string) => {
  if (!field) {
    return;
  }

  const parts = field.split('.');
  let data = obj;
  for (let i = 0; i < parts.length; i++) {
    if (!data) {
      return;
    }

    data = data[parts[i]];
  }
  return data;
};

export function transformArrayToMap<T>(
  data: T[] = [],
  keyField: keyof T | string = 'id',
) {
  let key;
  return data.reduce(
    (map, item) => {
      key = getDeepAttribute(item, keyField as string);
      if (!map[key]) {
        map[key] = item;
      }

      return map;
    },
    {} as Record<string, T>,
  );
}
