import {
  interpolateTwoPoints,
  findNearestElements,
  CollectionDirection,
  interpolateFourPoints,
  findNearestElements2D,
} from "../util";
import { isContinuous, isTabular, type AlcoholmetryModel } from "./models";
import { correctDensity, distortDensity } from "./oiml/practical";

export interface Point {
  dens: number;
  abm: number;
  abv: number;
  [key: string]: number;
}
export const PointQuantities = ["dens", "abm", "abv"] as (keyof Point)[];

export interface MeasuredPoint extends Point {
  mdens: number;
  mabm: number;
  mabv: number;
}

interface PointWithTemp extends Point {
  temp: number;
}

export const MeasuredQuantities = PointQuantities.map(
  (k) => "m" + k,
) as (keyof MeasuredPoint)[];

function findNearestPointAtTemp(
  table: Point[],
  qType: keyof Point,
  q: number,
): Point {
  return findNearestPointsAtTemp(table, qType, q, 1)[0].p;
}

function findNearestPointsAtTemp(
  table: Point[],
  qType: keyof Point,
  q: number,
  nbPoints: number,
): { d: number; p: Point }[] {
  let direction =
    qType == "dens" ? CollectionDirection.DESC : CollectionDirection.ASC;
  return findNearestElements(table, qType, q, nbPoints, direction) as {
    d: number;
    p: Point;
  }[];
}

function findNearestPoints2D(
  tables: { [key: number]: Point[] },
  temp: number,
  qType: keyof Point,
  q: number,
): [PointWithTemp, PointWithTemp, PointWithTemp, PointWithTemp] {
  return findNearestElements2D(
    tables,
    "temp",
    temp,
    qType,
    q,
    CollectionDirection.ASC,
    qType == "dens" ? CollectionDirection.DESC : CollectionDirection.ASC,
  ) as [PointWithTemp, PointWithTemp, PointWithTemp, PointWithTemp];
}

export class Table {
  tables: { [key: number]: Point[] } = {};
  computeDensity: ((p: number, t: number) => number) | undefined;

  glassAlpha: number;
  tempRange: {
    min: number;
    max: number;
    reference: number;
  };
  densRange: {
    max: number;
    min: number;
  };

  constructor(model: AlcoholmetryModel, glassAlpha: number) {
    this.tempRange = model.tempRange;
    this.glassAlpha = glassAlpha;
    if (isContinuous(model)) {
      this.computeDensity = model.computeDensity;
      this.densRange = model.densRange || {
        min: this.computeDensity(1, 40) - 1,
        max: this.computeDensity(0, 3.984) + 1, // densest water
      };
      this.sampleDensities(this.tempRange.reference);
    } else if (isTabular(model)) {
      this.tables = model.tables;
      this.densRange = model.densRange || {
        min: this.getDensityFromABM(100, 40) - 1,
        max: this.getDensityFromABM(0, 3.984) + 1,
      };
    } else {
      throw Error("unknown model type");
    }
  }

  private sampleDensities(temperature: number) {
    // this relies on the table for reftemp already existing if temperature != ref
    if (temperature in this.tables || !this.computeDensity) {
      return;
    }
    const ABMs = Array.from({ length: 1011 }, (_, i) => i * 0.1);
    const pureEthanolDensityAtRefTemp =
      temperature == this.tempRange.reference
        ? this.computeDensity(1, this.tempRange.reference)
        : null;
    const samples = ABMs.map((abm) => {
      const dens = (this.computeDensity as (p: number, t: number) => number)(
        abm / 100,
        temperature,
      );
      const abv =
        temperature == this.tempRange.reference
          ? (dens / (pureEthanolDensityAtRefTemp as number)) * abm
          : (findNearestPointAtTemp(
              this.tables[this.tempRange.reference],
              "abm",
              abm,
            ).dens /
              findNearestPointAtTemp(
                this.tables[this.tempRange.reference],
                "abm",
                100,
              ).dens) *
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

    let point: Point;
    if (this.tables[temp]) {
      let points = findNearestPointsAtTemp(
        this.tables[temp],
        knownPQ,
        knownPQvalue,
        2,
      );
      point = {
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
    } else {
      let points = findNearestPoints2D(
        this.tables,
        temp,
        knownPQ,
        knownPQvalue,
      );
      point = {
        [knownPQ]: knownPQvalue,
        [unknownPQs[0]]: interpolateFourPoints(
          points,
          "temp",
          temp,
          knownPQ,
          knownPQvalue,
          unknownPQs[0],
        ),
        [unknownPQs[1]]: interpolateFourPoints(
          points,
          "temp",
          temp,
          knownPQ,
          knownPQvalue,
          unknownPQs[1],
        ),
      } as Point;
    }
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

  private getContinuous(
    that: keyof Point,
    from: keyof Point,
    value: number,
    temp: number,
  ): number {
    this.sampleDensities(temp);
    let points = findNearestPointsAtTemp(this.tables[temp], from, value, 2);
    return interpolateTwoPoints(
      points.map((p) => p.p),
      from,
      value,
      that,
    );
  }

  private getTabular(
    that: keyof MeasuredPoint,
    from: keyof MeasuredPoint,
    value: number,
    temp: number,
  ): number {
    const temps = findNearestElements(
      Object.entries(this.tables).map(([k, v]) => {
        return { temp: Number(k), v: v };
      }),
      "temp",
      temp,
      2,
      CollectionDirection.ASC,
    ) as { d: number; p: { temp: number; v: MeasuredPoint[] } }[];
    const p0 = findNearestPointsAtTemp(temps[0].p.v, from, value, 2);
    const p1 = findNearestPointsAtTemp(temps[1].p.v, from, value, 2);
    return interpolateFourPoints(
      [
        { temp: temps[0].p.temp, [from]: p0[0].p[from], [that]: p0[0].p[that] },
        { temp: temps[0].p.temp, [from]: p0[1].p[from], [that]: p0[1].p[that] },
        { temp: temps[1].p.temp, [from]: p1[0].p[from], [that]: p1[0].p[that] },
        { temp: temps[1].p.temp, [from]: p1[1].p[from], [that]: p1[1].p[that] },
      ],
      "temp",
      temp,
      from,
      value,
      that,
    );
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
    const fGet = this.computeDensity ? this.getContinuous : this.getTabular;
    if (PointQuantities.includes(from) && PointQuantities.includes(that)) {
      return fGet.apply(this, [that, from, value, temp]);
    } else {
      if (from == "m" + that) {
        // correct
        if (temp == this.tempRange.reference) {
          return value;
        }
        if (that == "dens") {
          return this.correctDensity(value, temp);
        }
        const rhoPrimeRefTemp = this.get(
          "dens",
          that,
          value,
          this.tempRange.reference,
        );
        const dens = this.correctDensity(rhoPrimeRefTemp, temp);
        return this.get(that, "dens", dens, temp);
      } else if (that == "m" + from) {
        // distort
        if (temp == this.tempRange.reference) {
          return value;
        }
        if (from == "dens") {
          return this.distortDensity(value, temp);
        }
        const d = this.get("dens", from, value, temp);
        const dPrime = this.distortDensity(d, temp);
        return this.get(from, "dens", dPrime, this.tempRange.reference);
      } else {
        // these aren't used by the calculator but they're convenient to have for charting
        if (MeasuredQuantities.includes(from)) {
          return this.get(
            that,
            String(from).slice(1),
            this.get(String(from).slice(1), from, value, temp),
            temp,
          );
        }
        if (MeasuredQuantities.includes(that)) {
          return this.get(
            that,
            String(that).slice(1),
            this.get(String(that).slice(1), from, value, temp),
            temp,
          );
        }
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

  correctDensity(d: number, t: number): number {
    return correctDensity(d, t, this.glassAlpha);
  }

  distortDensity(d: number, t: number): number {
    return distortDensity(d, t, this.glassAlpha);
  }
}
