import {
  interpolateTwoPoints,
  findNearestPoints as fNPs,
  CollectionDirection,
} from "../util";
import type { AlcoholmetryModelCard } from "./models";

interface Point {
  dens: number;
  abm: number;
  abv: number;
  [key: string]: number;
}
export const PointQuantities = ["dens", "abm", "abv"] as (keyof Point)[];

interface MeasuredPoint extends Point {
  mdens: number;
  mabm: number;
  mabv: number;
}

export const MeasuredQuantities = PointQuantities.map(
  (k) => "m" + k,
) as (keyof MeasuredPoint)[];

export const MeasuredPointQuantities = PointQuantities.concat(
  MeasuredQuantities,
) as (keyof MeasuredPoint)[];

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
  computeDensity: (p: number, t: number) => number;
  glassAlpha: number;
  referenceTemp: number;
  densRange: {
    max: number;
    min: number;
  };

  constructor(model: AlcoholmetryModelCard, glass: number) {
    this.computeDensity = model.computeDensity;
    this.referenceTemp = model.tempRange.reference;
    this.glassAlpha = glass;
    this.densRange = {
      max: this.computeDensity(0, 3.984), // densest water
      min: this.computeDensity(1, 40),
    };

    this.sampleDensities(this.referenceTemp);
  }

  private sampleDensities(temperature: number) {
    // this relies on the table for reftemp already existing if temperature != ref
    if (temperature in this.tables) {
      return;
    }
    const ABMs = Array.from({ length: 1011 }, (_, i) => i * 0.1);
    const pureEthanolDensityAtRefTemp =
      temperature == this.referenceTemp
        ? this.computeDensity(1, this.referenceTemp)
        : null;
    const samples = ABMs.map((abm) => {
      const dens = this.computeDensity(abm / 100, temperature);
      const abv =
        temperature == this.referenceTemp
          ? (dens / (pureEthanolDensityAtRefTemp as number)) * abm
          : // there is an issue here, the values don't match
            (findNearestPoint(this.tables[this.referenceTemp], "abm", abm)
              .dens /
              findNearestPoint(this.tables[this.referenceTemp], "abm", 100)
                .dens) *
            abm;
      return {
        dens: dens,
        abm: abm,
        abv: abv,
      };
    });
    this.tables[temperature] = samples;
  }

  /**
   * synthesize a new point based on any dimension (interpolated between the nearest points)
   */
  getPoint(
    quantity: keyof MeasuredPoint,
    value: number,
    temp: number,
  ): MeasuredPoint {
    this.sampleDensities(temp);

    const [knownPQ, knownPQvalue, knownMQ, knownMQvalue] =
      PointQuantities.includes(quantity)
        ? [
            quantity as keyof Point,
            value,
            "m" + quantity,
            this.get("m" + quantity, quantity, value, temp),
          ]
        : [
            (quantity as string).slice(1) as keyof Point,
            this.get(
              (quantity as string).slice(1) as keyof Point,
              quantity,
              value,
              temp,
            ),
            quantity,
            value,
          ];
    const unknownPQs = PointQuantities.toSpliced(
      PointQuantities.indexOf(knownPQ),
      1,
    );
    const unknownMQs = MeasuredQuantities.toSpliced(
      MeasuredQuantities.indexOf(knownMQ),
      1,
    );

    let points = findNearestPoints(this.tables[temp], knownPQ, knownPQvalue, 2);
    const point = {
      [knownPQ]: knownPQvalue,
      [unknownPQs[0]]: interpolateTwoPoints(
        points.map((p) => p.p),
        knownPQ,
        knownPQvalue,
        unknownPQs[0],
      ),
      [unknownPQs[1]]: interpolateTwoPoints(
        points.map((p) => p.p),
        knownPQ,
        knownPQvalue,
        unknownPQs[1],
      ),
    } as Point;
    return {
      ...point,
      [knownMQ]: knownMQvalue,
      [unknownMQs[0]]: this.get(
        unknownMQs[0],
        (unknownMQs[0] as string).slice(1),
        point[(unknownMQs[0] as string).slice(1)],
        temp,
      ),
      [unknownMQs[1]]: this.get(
        unknownMQs[1],
        (unknownMQs[1] as string).slice(1),
        point[(unknownMQs[1] as string).slice(1)],
        temp,
      ),
    } as MeasuredPoint;
  }

  get(
    that: keyof MeasuredPoint,
    from: keyof MeasuredPoint,
    value: number,
    temp: number,
  ): number {
    if (that == from) {
      return value;
    }
    this.sampleDensities(temp);
    if (PointQuantities.includes(from) && PointQuantities.includes(that)) {
      let points = findNearestPoints(this.tables[temp], from, value, 2);
      return interpolateTwoPoints(
        points.map((p) => p.p),
        from,
        value,
        that,
      );
    } else {
      if (from == "m" + that) {
        // correct
        if (temp == this.referenceTemp) {
          return value;
        }
        if (that == "dens") {
          return this.getCorrectedDensity(value, temp);
        }
        const rhoPrimeRefTemp = this.get(
          "dens",
          that,
          value,
          this.referenceTemp,
        );
        const dens = this.getCorrectedDensity(rhoPrimeRefTemp, temp);
        return this.get(that, "dens", dens, temp);
      } else if (that == "m" + from) {
        // distort
        if (temp == this.referenceTemp) {
          return value;
        }
        if (from == "dens") {
          return this.getDistortedDensity(value, temp);
        }
        const d = this.get("dens", from, value, temp);
        const dPrime = this.getDistortedDensity(d, temp);
        return this.get(from, "dens", dPrime, this.referenceTemp);
      } else {
        console.error(`trying to convert ${from}:${value} to ${that}`);
        return -1;
      }
    }
  }

  /**
   * (table I)
   */
  getDensityFromABM(abm: number, temp: number): number {
    return this.get("dens", "abm", abm, temp);
  }

  /**
   * (table VI)
   */
  getABMFromDensity(dens: number, temp: number): number {
    return this.get("abm", "dens", dens, temp);
  }

  /**
   * computes the actual density from measured ABV from a RefTemp calibrated alcoholmeter
   *
   * (table II)
   */
  getDensityFromABV(abv: number, temp: number): number {
    return this.get("dens", "abv", abv, temp);
  }

  /**
   * computes the apparent ABV at the given temperature (or the legal one for RefTemp)
   *
   * (table VII)
   */
  getABVFromDensity(density: number, temp: number): number {
    return this.get("abv", "dens", density, temp);
  }

  /**
   * computes the actual ABM from measured ABV from a RefTemp calibrated alcoholmeter
   *
   * (table IVb)
   */
  getABMFromABV(abv: number, temp: number): number {
    return this.get("abm", "abv", abv, temp);
  }

  /**
   * computes the apparent ABV at the given temperature (or the legal one for RefTemp)
   *
   * (table IIIb)
   */
  getABVFromABM(abm: number, temp: number): number {
    return this.get("abv", "abm", abm, temp);
  }

  /**
   * get legal ABV from the measure of a RefTemp-calibrated alcoholmeter
   *
   * (table VIIIa)
   **/
  getCorrectedABM(measuredABM: number, temp: number): number {
    return this.get("abm", "mabm", measuredABM, temp);
  }

  /**
   * opposite of getCorrectedABM
   */
  getDistortedABM(trueABM: number, temp: number): number {
    return this.get("mabm", "abm", trueABM, temp);
  }

  /**
   *
   * get legal ABV from the measure of a RefTemp-calibrated alcoholmeter
   *
   * (table VIIIb)
   *
   **/
  getCorrectedABV(measuredABV: number, temp: number): number {
    return this.get("abv", "mabv", measuredABV, temp);
  }

  /**
   * opposite of getCorrectedABV
   */
  getDistortedABV(trueABV: number, temp: number): number {
    return this.get("mabv", "abv", trueABV, temp);
  }

  /**
   * get RefTemp density from observed density by correcting for glass expansion
   */
  getCorrectedDensity(measuredQuantity: number, temp: number): number {
    return (
      measuredQuantity * (1 - this.glassAlpha * (temp - this.referenceTemp))
    );
  }

  /**
   * opposite of getCorrectedDensity
   */
  getDistortedDensity(trueQuantity: number, temp: number): number {
    return trueQuantity / (1 - this.glassAlpha * (temp - this.referenceTemp));
  }
}
