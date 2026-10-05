export function countNonNullKeys(obj: any): number {
  return Object.keys(obj).reduce((acc, it) => {
    return acc + (obj[it] != null ? 1 : 0);
  }, 0);
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function removeNullValues(obj: Object): Object {
  return Object.entries(obj).reduce((a, [k, v]) => {
    if (v != null) {
      if (typeof v === "object") {
        a[k as keyof typeof obj] = removeNullValues(v) as any;
      } else {
        a[k as keyof typeof obj] = v;
      }
    }
    return a;
  }, {});
}

export function getArray(from: number, to: number, step: number): number[] {
  return Array.from(
    { length: (to - from) / step + 1 },
    (_, i) => i * step + from,
  );
}

/**
 * (it also does extrapolation)
 */
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

/**
 * assumes a rectangle
 *
 * coordinates:
 * ```
 *     y
 *     ^
 *   2 | 12  22
 *     |
 *   1 | 11  21
 *     +--------> x
 *        1   2
 * ```
 */
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

/**
 * bilinear interpolation with two known dimensions out of three
 *
 * points must form a trapezoid
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

  /*
  We have no guarantee those four points form a rectangle yet the call to bilinearInterpolate requires it.
  To solve this, we synthesize two new points that form a rectangle with the extremities.
  
  I implement the trapezoid special case because it matches our data which is always temp-aligned.

  Example:
  
  Kvar (abv/abm/dens)
  ^
  |
  |    *        o
  |    o
  |       +
  |
  |             o
  |    o        *
  |
  +----+--------+----------> Kref (temp)
       10       20
  
  Where "o" are the known points, "+" the point we want to interpolate, and "*" the points we're going to synthetise
  
  henceforth I use left/rights for Kref (temp) and top/bottom for the other quantity, but it works in any dimension
  */

  const haveSameCoordinates = (a: T, b: T) => a[K1] == b[K1] && a[K2] == b[K2];

  const pointsSorted = {
    [K1]: points.toSorted((a, b) => {
      if (a[K1] == b[K1]) return a[K2] - b[K2];
      return a[K1] - b[K1];
    }),
    [K2]: points.toSorted((a, b) => {
      if (a[K2] == b[K2]) return a[K1] - b[K1];
      return a[K2] - b[K2];
    }),
  } as { [Property in keyof T]: T[] };
  let Kref: keyof T;
  let Kvar: keyof T;
  if (
    pointsSorted[K1][0][K1] == pointsSorted[K1][1][K1] &&
    pointsSorted[K1][2][K1] == pointsSorted[K1][3][K1]
  ) {
    Kref = K1;
    Kvar = K2;
  } else if (
    pointsSorted[K2][0][K2] == pointsSorted[K2][1][K2] &&
    pointsSorted[K2][2][K2] == pointsSorted[K2][3][K2]
  ) {
    Kref = K2;
    Kvar = K1;
  } else {
    throw Error("bilinear interpolation in arbitrary quad not implemented");
  }

  // just a cool property of the sort
  // (note there's no guarantee that "bottom right" isn't actually higher than "top left")
  points = pointsSorted[Kref];
  enum D {
    BOTTOM_LEFT = 0,
    TOP_LEFT = 1,
    BOTTOM_RIGHT = 2,
    TOP_RIGHT = 3,
  }

  const naturalBottom = pointsSorted[Kvar][0];
  const naturalBottomPosition = points.findIndex((p) =>
    haveSameCoordinates(p, naturalBottom),
  ) as D;
  const naturalTop = pointsSorted[Kvar][3];
  const naturalTopPosition = points.findIndex((p) =>
    haveSameCoordinates(p, naturalTop),
  ) as D;

  let synthBottom = {
    [Kvar]: naturalBottom[Kvar],
    [Kref]: pointsSorted[Kvar].filter((p) => p[Kref] != naturalBottom[Kref])[0][
      Kref
    ],
  } as { [Property in keyof T]: T[keyof T] | number };

  if (haveSameCoordinates(synthBottom as T, pointsSorted[Kvar][1])) {
    synthBottom[S] = pointsSorted[Kvar][1][S];
  } else {
    synthBottom[S] = interpolateTwoPoints(
      pointsSorted[Kref].filter((p) => p[Kref] == synthBottom[Kref]),
      Kvar,
      naturalBottom[Kvar],
      S,
    );
  }

  let synthTop = {
    [Kvar]: naturalTop[Kvar],
    [Kref]: pointsSorted[Kvar].filter((p) => p[Kref] != naturalTop[Kref])[0][
      Kref
    ],
  } as { [Property in keyof T]: T[keyof T] | number };

  if (haveSameCoordinates(synthTop as T, pointsSorted[Kvar][2])) {
    synthTop[S] = pointsSorted[Kvar][2][S];
  } else {
    synthTop[S] = interpolateTwoPoints(
      pointsSorted[Kref].filter((p) => p[Kref] == synthTop[Kref]),
      Kvar,
      naturalTop[Kvar],
      S,
    );
  }

  let [x1, y1, q11, q21] =
    naturalBottomPosition == D.BOTTOM_LEFT
      ? [naturalBottom[K1], naturalBottom[K2], naturalBottom[S], synthBottom[S]]
      : [synthBottom[K1], synthBottom[K2], synthBottom[S], naturalBottom[S]];
  let [x2, y2, q12, q22] =
    naturalTopPosition == D.TOP_RIGHT
      ? [naturalTop[K1], naturalTop[K2], synthTop[S], naturalTop[S]]
      : [synthTop[K1], synthTop[K2], naturalTop[S], synthTop[S]];

  return bilinearInterpolate(
    x1,
    y1,
    x2,
    y2,
    q11,
    q12,
    q21,
    q22,
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

interface Element {
  [key: string]: number | any;
}

function distance(quantity: keyof Element, a: Element, b: Element): number {
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
export function findNearestElements(
  table: Element[],
  qType: keyof Element,
  q: number,
  nbPoints: number,
  direction: CollectionDirection,
): { d: number; p: Element }[] {
  let reversed = direction == CollectionDirection.ASC ? false : true;
  let target = { [qType]: q } as Element;
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

export function findNearestElements2D(
  tables: { [key: number]: Element[] },
  metaQuantityType: string,
  metaQuantity: number,
  quantityType: keyof Element,
  quantity: number,
  metaDirection: CollectionDirection,
  direction: CollectionDirection,
): [Element, Element, Element, Element] {
  const temps = findNearestElements(
    Object.entries(tables).map(([k, v]) => {
      return { t: Number(k), v: v };
    }),
    0,
    metaQuantity,
    2,
    metaDirection,
  ) as { d: number; p: { t: number; v: Element[] } }[];
  const p0 = findNearestElements(
    temps[0].p.v,
    quantityType,
    quantity,
    2,
    direction,
  );
  const p1 = findNearestElements(
    temps[1].p.v,
    quantityType,
    quantity,
    2,
    direction,
  );
  return [
    { [metaQuantityType]: temps[0].p.t, ...p0[0].p },
    { [metaQuantityType]: temps[0].p.t, ...p0[1].p },
    { [metaQuantityType]: temps[1].p.t, ...p1[0].p },
    { [metaQuantityType]: temps[1].p.t, ...p1[1].p },
  ];
}
