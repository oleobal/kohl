import { computeDensity } from "./oiml/ideal";
import {
  interpolateTwoPoints,
  findNearestPoints as fNPs,
  CollectionDirection,
} from "./util";
import {
  adjustForGlassExpansion,
  adjustForSurfaceTension,
} from "./oiml/practical";

export const DENSITY_ETHANOL_40C = 771.93;
export const DENSITY_WATER_0C = 999.84;

interface Point {
  dens: number;
  abm: number;
  abv: number;
  [key: string]: number;
}

function findNearestPoint(
  table: Point[],
  qType: keyof Point,
  q: number,
): Point {
  return findNearestPoints(table, qType, q, 1)[0].p;
}

function findNearestPoints(
  table: Point[],
  qType: keyof Point,
  q: number,
  nbPoints: number,
): { d: number; p: Point }[] {
  let direction =
    qType == "dens" ? CollectionDirection.DESC : CollectionDirection.ASC;
  return fNPs(table, qType, q, nbPoints, direction) as {
    d: number;
    p: Point;
  }[];
}

export class Table {
  tables: { [key: number]: Point[] } = {};

  constructor() {
    this.sampleDensities(20);
  }

  private sampleDensities(temperature: number) {
    // this relies on the table for 20C already existing if temperature != 20
    if (temperature in this.tables) {
      return;
    }
    const ABMs = Array.from({ length: 1011 }, (_, i) => i * 0.1);
    const pureEthanolDensityAt20C =
      temperature == 20 ? computeDensity(1, 20) : null;
    const samples = ABMs.map((abm) => {
      const dens = computeDensity(abm / 100, temperature);
      const abv =
        temperature == 20
          ? (dens / (pureEthanolDensityAt20C as number)) * abm
          : // there is an issue here, the values don't match
            (findNearestPoint(this.tables[20], "abm", abm).dens /
              findNearestPoint(this.tables[20], "abm", 100).dens) *
            abm;
      return {
        dens: dens,
        abm: abm,
        abv: abv,
      };
    });
    this.tables[temperature] = samples;
  }

  getDensityFromABM(abm: number, temp: number): number {
    this.sampleDensities(temp);
    let points = findNearestPoints(this.tables[temp], "abm", abm, 2);
    return interpolateTwoPoints(
      points.map((p) => p.p),
      "abm",
      abm,
      "dens",
    );
  }

  getABMFromDensity(density: number, temp: number): number {
    this.sampleDensities(temp);
    let points = findNearestPoints(this.tables[temp], "dens", density, 2);
    return interpolateTwoPoints(
      points.map((p) => p.p),
      "dens",
      density,
      "abm",
    );
  }

  /** computes the actual density from measured ABV from a 20C calibrated alcoholmeter */
  getDensityFromABV(abv: number, temp: number): number {
    this.sampleDensities(temp);
    let points = findNearestPoints(this.tables[temp], "abv", abv, 2);
    return interpolateTwoPoints(
      points.map((p) => p.p),
      "abv",
      abv,
      "dens",
    );
  }

  /** computes the apparent ABV at the given temperature (or the legal one for 20C) */
  getABVFromDensity(density: number, temp: number): number {
    this.sampleDensities(temp);
    let points = findNearestPoints(this.tables[temp], "dens", density, 2);
    return interpolateTwoPoints(
      points.map((p) => p.p),
      "dens",
      density,
      "abv",
    );
  }

  /** computes the actual ABM from measured ABV from a 20C calibrated alcoholmeter */
  getABMFromABV(abv: number, temp: number): number {
    this.sampleDensities(temp);
    let points = findNearestPoints(this.tables[temp], "abv", abv, 2);
    return interpolateTwoPoints(
      points.map((p) => p.p),
      "abv",
      abv,
      "abm",
    );
  }

  /** computes the apparent ABV at the given temperature (or the legal one for 20C) */
  getABVFromABM(abm: number, temp: number): number {
    this.sampleDensities(temp);
    let points = findNearestPoints(this.tables[temp], "abm", abm, 2);
    return interpolateTwoPoints(
      points.map((p) => p.p),
      "abm",
      abm,
      "abv",
    );
  }

  /**
   * get legal ABV from the measure of a 20C-calibrated alcoholmeter
   *
   * (table VIIIa)
   **/
  getCorrectedABM(measuredABM: number, temp: number): number {
    const rhoPrime20C = this.getDensityFromABM(measuredABM, 20);
    const dens = adjustForGlassExpansion(rhoPrime20C, temp);
    return this.getABMFromDensity(dens, temp);
  }

  /**
   *
   * get legal ABV from the measure of a 20C-calibrated alcoholmeter
   *
   * (table VIIIb)
   *
   **/
  getCorrectedABV(measuredABV: number, temp: number): number {
    const rhoPrime20C = this.getDensityFromABV(measuredABV, 20);
    const dens = adjustForGlassExpansion(rhoPrime20C, temp);
    return this.getABVFromDensity(dens, temp);
  }

  // fetch an arbitrary Point based on temp + other quantity
  // all other quantities are interpolated
  getPoint(qType: keyof Point, q: number, temp: number) {
    this.sampleDensities(temp);
  }
}
