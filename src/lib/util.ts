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
  if (x1 == x2) {
    return y1;
  }
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

/*
bilinear interpolation with two known dimensions out of three
*/
export function interpolateFourPoints<T extends { [key: string]: number }>(
  points: T[],
  knownQuantity1Type: keyof T,
  knownQuantity1: number,
  knownQuantity2Type: keyof T,
  knownQuantity2: number,
  searchedQuantityType: keyof T,
): number {
  const K1 = knownQuantity1Type;
  const K2 = knownQuantity2Type;
  const S = searchedQuantityType;
  points = points.toSorted((a, b) => {
    if (a[K1] != b[K2]) {
      return a[K1] - b[K1];
    }
    return a[K2] - b[K2];
  });
  return bilinearInterpolate(
    points[0][K1],
    points[0][K2],
    points[3][K1],
    points[3][K2],
    points[0][S],
    points[1][S],
    points[2][S],
    points[3][S],
    knownQuantity1,
    knownQuantity2,
  );
}

/*
linear interpolation with one known dimension out of two
*/
export function interpolateTwoPoints<T extends { [key: string]: number }>(
  points: T[],
  knownQuantityType: keyof T,
  knownQuantity: number,
  searchedQuantityType: keyof T,
): number {
  const K = knownQuantityType;
  const S = searchedQuantityType;
  points = points.toSorted((a, b) => {
    return a[K] - b[K];
  });
  return linearInterpolate(
    points[0][K],
    points[0][S],
    points[1][K],
    points[1][S],
    knownQuantity,
  );
}
