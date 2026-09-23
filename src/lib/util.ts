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
    if (a[K1] != b[K1]) {
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

interface Point {
  [key: string]: number;
}

function distance(quantity: keyof Point, a: Point, b: Point): number {
  return Math.abs(b[quantity] - a[quantity]);
}

export enum CollectionDirection {
  ASC,
  DESC,
}

/**
 * find the points closest to the given quantity in the given samples
 *
 * this relies on the quantities being strictly ordered in the given dimension!
 *
 * eg f(x) < f(x+1) whatever x is
 *
 * this enables searching for coordinates from the quantities
 */
export function findNearestPoints(
  table: Point[],
  qType: keyof Point,
  q: number,
  nbPoints: number,
  direction: CollectionDirection,
): { d: number; p: Point }[] {
  let reversed = direction == CollectionDirection.ASC ? false : true;
  let target = { [qType]: q } as Point;
  // the samples are ordered whatever the quantity so we can run binary search
  // (however density is ordered reverse to ABV and ABM)
  let center = table.length / 2;
  let range = table.length / 4;

  // find the center
  let iterations = 0;
  let iL = -1;
  let iH = -1;
  while (iterations < Math.max(Math.ceil(table.length / 10), 10)) {
    iterations++;
    iL = Math.floor(center);
    iH = iL == center ? iL + 1 : Math.ceil(center);

    if (iH >= table.length) {
      center = table.length - 1;
      iH = table.length - 1;
      iL = center - 1;
      break;
    }
    if (iL < 0) {
      center = 0;
      iH = 0;
      iL = 1;
      break;
    }

    if (reversed) {
      if (table[iL][qType] < q) {
        center -= range;
        range /= 2;
      } else if (table[iH][qType] > q) {
        center += range;
        range /= 2;
      } else {
        break;
      }
    } else {
      if (table[iH][qType] < q) {
        center += range;
        range /= 2;
      } else if (table[iL][qType] > q) {
        center -= range;
        range /= 2;
      } else {
        break;
      }
    }
  }

  // widen to nbPoints
  let dL = distance(qType, table[iL], target);
  let dH = distance(qType, table[iH], target);
  let results =
    dL <= dH
      ? [
          { d: dL, p: table[iL] },
          { d: dH, p: table[iH] },
        ]
      : [
          { d: dH, p: table[iH] },
          { d: dL, p: table[iL] },
        ];
  while (results.length < nbPoints) {
    dL = iL - 1 > 0 ? distance(qType, table[iL - 1], target) : Infinity;
    dH =
      iH + 1 < table.length ? distance(qType, table[iH + 1], target) : Infinity;
    if (dL <= dH) {
      iL--;
      results.push({ d: dL, p: table[iL] });
    } else {
      iH++;
      results.push({ d: dH, p: table[iH] });
    }
  }
  return results;
}
