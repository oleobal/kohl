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

export function linearInterpolate(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x: number,
): number {
  console.log(x1, y1, x2, y2, x);
  return y1 + (x - x1) * ((y2 - y1) / (x2 - x1));
}

export function bilinearInterpolate(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  q11: number,
  q12: number,
  q21: number,
  q22: number,
  x: number,
  y: number,
): number {
  const xy1 = linearInterpolate(x1, q11, x2, q21, x);
  const xy2 = linearInterpolate(x1, q12, x2, q22, x);
  return linearInterpolate(y1, xy1, y2, xy2, y);
}
