import { computeDensity, computeABV } from "./oiml/ideal";
import { kdTree } from "kd-tree-javascript";
import { bilinearInterpolate, linearInterpolate } from "./util";
import { adjustDensity } from "./oiml/practical";

interface Point {
  dens: number;
  temp: number;
  abm: number;
  abv: number; // this is not the actual ABV but rather what an alcoholmeter calibrated at 20C would say in this situation (eg a proxy for density)
}

function abmDistance(a: Point, b: Point): number {
  return Math.sqrt(Math.pow(b.temp - a.temp, 2) + Math.pow(b.abm - a.abm, 2));
}
function densDistance(a: Point, b: Point): number {
  return Math.sqrt(Math.pow(b.temp - a.temp, 2) + Math.pow(b.dens - a.dens, 2));
}
function abvDistance(a: Point, b: Point): number {
  return Math.sqrt(Math.pow(b.temp - a.temp, 2) + Math.pow(b.abv - a.abv, 2));
}

/* 
bilinear interpolation
*/
function interpolateFourPoints(
  points: Point[],
  knownTemperature: number,
  knownQuantityType: keyof Point,
  knownQuantity: number,
  searchedQuantityType: keyof Point,
): number {
  const K = knownQuantityType;
  const S = searchedQuantityType;
  points = points.toSorted((a, b) => {
    if (a.temp != b.temp) {
      return a.temp - b.temp;
    }
    return a[K] - b[K];
  });
  console.log(points);
  return bilinearInterpolate(
    points[0].temp,
    points[0][K],
    points[3].temp,
    points[3][K],
    points[0][S],
    points[1][S],
    points[2][S],
    points[3][S],
    knownTemperature,
    knownQuantity,
  );
}

function sampleDensities(): {
  abmByDens: kdTree<Point>;
  densByAbm: kdTree<Point>;
  abvByDens: kdTree<Point>;
  densByAbv: kdTree<Point>;
  abvByAbm: kdTree<Point>;
  abmByAbv: kdTree<Point>;
} {
  const pureEthanoldensityAt20C = computeDensity(1, 20);
  const temperatures = Array.from({ length: 600 }, (_, i) => -20 + i * 0.1);
  const ABMs = Array.from({ length: 1000 }, (_, i) => i * 0.1);
  const samples = temperatures
    .map((temp) =>
      ABMs.map((abm) => {
        const dens = computeDensity(abm / 100, temp);
        return {
          dens: dens,
          temp: temp,
          abm: abm,
          abv: (dens / pureEthanoldensityAt20C) * abm,
        };
      }),
    )
    .flat();

  let densTree = new kdTree<Point>(samples, abmDistance, ["temp", "abm"]);
  let abmTree = new kdTree<Point>(samples, densDistance, ["temp", "dens"]);

  let abvByDensTree = new kdTree<Point>(samples, densDistance, ["abv", "dens"]);
  let densByAbvTree = new kdTree<Point>(samples, abvDistance, ["abv", "dens"]);

  let abvByAbmTree = new kdTree<Point>(samples, abmDistance, ["abv", "abm"]);
  let abmByAbvTree = new kdTree<Point>(samples, abvDistance, ["abv", "abm"]);

  return {
    densByAbm: densTree,
    abmByDens: abmTree,

    abvByDens: abvByDensTree,
    densByAbv: densByAbvTree,

    abvByAbm: abvByAbmTree,
    abmByAbv: abmByAbvTree,
  };
}

export class Table {
  abmByDens: kdTree<Point>;
  densByAbm: kdTree<Point>;

  abvByDens: kdTree<Point>;
  densByAbv: kdTree<Point>;

  abvByAbm: kdTree<Point>;
  abmByAbv: kdTree<Point>;

  constructor() {
    const d = sampleDensities();
    this.abmByDens = d.abmByDens;
    this.densByAbm = d.densByAbm;
    this.abvByDens = d.abvByDens;
    this.densByAbv = d.densByAbv;
    this.abmByAbv = d.abmByAbv;
    this.abvByAbm = d.abvByAbm;
  }

  getDensityFromABM(abm: number, temp: number): number {
    let points = this.densByAbm.nearest({ abm: abm, temp: temp } as Point, 4);
    console.log(points);
    return interpolateFourPoints(
      points.map((p) => p[0]),
      temp,
      "abm",
      abm,
      "dens",
    );
  }

  getABMFromDensity(density: number, temp: number): number {
    let points = this.abmByDens.nearest(
      { dens: density, temp: temp } as Point,
      4,
    );
    return interpolateFourPoints(
      points.map((p) => p[0]),
      temp,
      "dens",
      density,
      "abm",
    );
  }

  /** computes the actual density from measured ABV from a 20C calibrated alcoholmeter */
  getDensityFromABV(abv: number, temp: number): number {
    let points = this.densByAbv.nearest({ abv: abv, temp: temp } as Point, 4);
    return interpolateFourPoints(
      points.map((p) => p[0]),
      temp,
      "abv",
      abv,
      "dens",
    );
  }

  /** computes the apparent ABV at the given temperature (or the legal one for 20C) */
  getABVFromDensity(density: number, temp: number): number {
    let points = this.abvByDens.nearest(
      { dens: density, temp: temp } as Point,
      4,
    );
    return interpolateFourPoints(
      points.map((p) => p[0]),
      temp,
      "dens",
      density,
      "abv",
    );
  }

  /** computes the actual ABM from measured ABV from a 20C calibrated alcoholmeter */
  getABMFromABV(abv: number, temp: number): number {
    let points = this.abmByAbv.nearest({ abv: abv, temp: temp } as Point, 4);
    console.log(points);
    return interpolateFourPoints(
      points.map((p) => p[0]),
      temp,
      "abv",
      abv,
      "abm",
    );
  }

  /** computes the apparent ABV at the given temperature (or the legal one for 20C) */
  getABVFromABM(abm: number, temp: number): number {
    let points = this.abvByAbm.nearest({ abm: abm, temp: temp } as Point, 4);
    return interpolateFourPoints(
      points.map((p) => p[0]),
      temp,
      "abm",
      abm,
      "abv",
    );
  }

  /** get legal ABV from the measure of a 20C-calibrated alcoholmeter */
  getCorrectedABV(measuredABV: number, temp: number): number {
    const measuredABM = this.getABMFromABV(measuredABV, temp);
    console.log(measuredABM);
    return this.getABVFromABM(measuredABM, 20);
  }
}
