import { computeDensity, computeABV } from "./oiml/ideal";
import { kdTree } from "kd-tree-javascript";
import { interpolateTwoPoints } from "./util";
import {
  adjustForGlassExpansion,
  adjustForSurfaceTension,
} from "./oiml/practical";

export const DENSITY_ETHANOL_40C = 771.93;
export const DENSITY_WATER_0C = 999.84;

interface Point {
  dens: number;
  abm: number;
  abv: number; // for 20C, the legal ABV. Otherwise, what an alcoholmeter calibrated at 20C would say in this situation (eg a proxy for density)
  [key: string]: number;
}

function abmDistance(a: Point, b: Point): number {
  return Math.abs(b.abm - a.abm);
}
function densDistance(a: Point, b: Point): number {
  return Math.abs(b.dens - a.dens);
}
function abvDistance(a: Point, b: Point): number {
  return Math.abs(b.abv - a.abv);
}

interface TableSet {
  dens: {
    abm: kdTree<Point>;
    abv: kdTree<Point>;
  };
  abm: {
    dens: kdTree<Point>;
    abv: kdTree<Point>;
  };
  abv: {
    abm: kdTree<Point>;
    dens: kdTree<Point>;
  };
}

export class Table {
  tables: { [key: number]: TableSet } = {};

  constructor() {
    this.sampleDensities(20);
  }

  private sampleDensities(temperature: number) {
    // this relies on the table for 20C already existing if temperature != 20
    if (temperature in this.tables) {
      return;
    }
    const ABMs = Array.from({ length: 1000 }, (_, i) => i * 0.1);
    const pureEthanolDensityAt20C =
      temperature == 20 ? computeDensity(1, 20) : null;
    const samples = ABMs.map((abm) => {
      const dens = computeDensity(abm / 100, temperature);
      return {
        dens: dens,
        abm: abm,
        abv:
          temperature == 20
            ? (dens / (pureEthanolDensityAt20C as number)) * abm
            : // there is an issue here, the values don't match
              adjustForSurfaceTension(
                (adjustForGlassExpansion(
                  this.tables[20].dens.abm.nearest(
                    { abm: abm } as Point,
                    1,
                  )[0][0].dens,
                  temperature,
                ) /
                  this.tables[20].dens.abm.nearest(
                    { abm: 100 } as Point,
                    1,
                  )[0][0].dens) *
                  abm,
                3,
                dens,
                abm,
                temperature,
              ),
      };
    });

    this.tables[temperature] = {
      dens: {
        abm: new kdTree<Point>(samples, abmDistance, ["dens", "abm"]),
        abv: new kdTree<Point>(samples, abvDistance, ["dens", "abv"]),
      },
      abm: {
        dens: new kdTree<Point>(samples, densDistance, ["abm", "dens"]),
        abv: new kdTree<Point>(samples, abvDistance, ["abm", "abv"]),
      },
      abv: {
        dens: new kdTree<Point>(samples, densDistance, ["abv", "dens"]),
        abm: new kdTree<Point>(samples, abmDistance, ["abv", "abm"]),
      },
    };
  }

  /** R22 table I */
  getDensityFromABM(abm: number, temp: number): number {
    this.sampleDensities(temp);
    let points = this.tables[temp].dens.abm.nearest({ abm: abm } as Point, 2);
    return interpolateTwoPoints(
      points.map((p) => p[0]),
      "abm",
      abm,
      "dens",
    );
  }

  getABMFromDensity(density: number, temp: number): number {
    this.sampleDensities(temp);
    let points = this.tables[temp].dens.abm.nearest(
      { dens: density } as Point,
      2,
    );
    return interpolateTwoPoints(
      points.map((p) => p[0]),
      "dens",
      density,
      "abm",
    );
  }

  /** computes the actual density from measured ABV from a 20C calibrated alcoholmeter */
  getDensityFromABV(abv: number, temp: number): number {
    this.sampleDensities(temp);
    let points = this.tables[temp].dens.abv.nearest({ abv: abv } as Point, 2);
    return interpolateTwoPoints(
      points.map((p) => p[0]),
      "abv",
      abv,
      "dens",
    );
  }

  /** computes the apparent ABV at the given temperature (or the legal one for 20C) */
  getABVFromDensity(density: number, temp: number): number {
    this.sampleDensities(temp);
    let points = this.tables[temp].abv.dens.nearest(
      { dens: density } as Point,
      2,
    );
    return interpolateTwoPoints(
      points.map((p) => p[0]),
      "dens",
      density,
      "abv",
    );
  }

  /** computes the actual ABM from measured ABV from a 20C calibrated alcoholmeter */
  getABMFromABV(abv: number, temp: number): number {
    this.sampleDensities(temp);
    let points = this.tables[temp].abm.abv.nearest({ abv: abv } as Point, 2);
    return interpolateTwoPoints(
      points.map((p) => p[0]),
      "abv",
      abv,
      "abm",
    );
  }

  /** computes the apparent ABV at the given temperature (or the legal one for 20C) */
  getABVFromABM(abm: number, temp: number): number {
    this.sampleDensities(temp);
    let points = this.tables[temp].abv.abm.nearest({ abm: abm } as Point, 2);
    return interpolateTwoPoints(
      points.map((p) => p[0]),
      "abm",
      abm,
      "abv",
    );
  }

  /** get legal ABV from the measure of a 20C-calibrated alcoholmeter */
  getCorrectedABV(measuredABV: number, temp: number): number {
    const measuredABM = this.getABMFromABV(measuredABV, temp);
    return this.getABVFromABM(measuredABM, 20);
  }
}
