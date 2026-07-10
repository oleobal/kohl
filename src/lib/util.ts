export function countNonNullKeys(obj: any): number {
  return Object.keys(obj).reduce((acc, it) => {
    return acc + (obj[it] != null ? 1 : 0);
  }, 0);
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function removeNullValues(obj: Object): Object {
  return Object.entries(obj).reduce(
    (a, [k, v]) => (v == null ? a : ((a[k as keyof typeof obj] = v), a)),
    {},
  );
}
