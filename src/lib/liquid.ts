import {
  isEither,
  left,
  merge,
  right,
  type Either,
} from "@sweet-monads/either";

import { MeasuredQuantities, PointQuantities } from "./physics/density.js";
import { removeNullValues } from "./util.js";
import { model } from "./state.svelte.js";
import { KnownModels } from "./physics/models.js";

export interface LiquidMakeup {
  abv?: number; // alcohol by volume, percentage
  dens?: number; // in g/L
  abm?: number; // alcohol by mass, percentage
  temp?: number; // degrees C

  mabv?: number; // measured ABV, including glass correction
  mdens?: number; // measured density, including glass correction
  mabm?: number; // measured ABM, including glass correction
}

export interface Liquid extends LiquidMakeup {
  mass?: number; // in kg
  vol?: number; // volume at refTemp, in litres
  mvol?: number; // volume at the current temperature, in litres
  // (does NOT include any correction for container expansion or such, the mvol name is a bit misleading)

  lpa?: number; // litres of pure alcohol
  kpa?: number; // kilograms of pure alcohol
}

export interface NormalizedLiquidMakeup {
  abv: number;
  dens: number;
  abm: number;
  mabv: number;
  mdens: number;
  mabm: number;
  temp: number;
}

export interface NormalizedLiquid extends NormalizedLiquidMakeup {
  mass: number;
  vol: number;
  mvol: number;
  lpa: number;
  kpa: number;
}

export interface ErrorLiquid {
  cause?: any;

  mass?: string;
  vol?: string;
  mvol?: string;

  lpa?: string;
  kpa?: string;

  abm?: string;
  abv?: string;
  dens?: string;
  mabm?: string;
  mabv?: string;
  mdens?: string;
}

enum ErrorType {
  LIQUID,
  MAKEUP,
  QUANTITY,
}
function fillError(t: ErrorType, cause: string, msgToSet: string): ErrorLiquid {
  let e = {
    cause: cause,
  };
  if ((t = ErrorType.LIQUID || ErrorType.QUANTITY)) {
    e = {
      ...e,
      ...{
        mass: msgToSet,
        vol: msgToSet,
        mvol: msgToSet,
      },
    };
  }
  if ((t = ErrorType.LIQUID || ErrorType.MAKEUP)) {
    e = {
      ...e,
      ...{
        lpa: msgToSet,
        kpa: msgToSet,
        abm: msgToSet,
        abv: msgToSet,
        dens: msgToSet,
        mabm: msgToSet,
        mdens: msgToSet,
      },
    };
  }
  return e;
}

function countNumberArgs(...args: any[]): number {
  let total = 0;
  for (const arg of args) {
    total += typeof arg === "number" ? 1 : 0;
  }
  return total;
}

export function normalizeLiquidMakeup(
  m: LiquidMakeup | Either<ErrorLiquid, NormalizedLiquidMakeup>,
): Either<ErrorLiquid, NormalizedLiquidMakeup> {
  if (isEither(m)) {
    return m as Either<ErrorLiquid, NormalizedLiquidMakeup>;
  } else {
    m = removeNullValues(m) as LiquidMakeup;
  }
  const quants = PointQuantities.concat(MeasuredQuantities);

  let definedQuantities = Object.keys(m).filter(
    (k) =>
      quants.indexOf(k) != -1 && typeof m[k as keyof LiquidMakeup] === "number",
  ) as (keyof LiquidMakeup)[];
  switch (definedQuantities.length) {
    case 0:
      return left({ cause: "uninitialized", error: new Error() });
    case 1:
      break;
    default:
      return left(
        fillError(
          ErrorType.MAKEUP,
          "provide only one value for density or alcohol content",
          "conflict",
        ),
      );
  }
  if (typeof m.temp !== "number") {
    m.temp = KnownModels[model.id].tempRange.reference;
  } else if (
    m.temp < KnownModels[model.id].tempRange.min ||
    m.temp > KnownModels[model.id].tempRange.max
  ) {
    return left({
      cause: `temperature outside allowed range of ${KnownModels[model.id].tempRange.min}–${KnownModels[model.id].tempRange.max}`,
      temp: "invalid",
    });
  }

  let r = {
    ...model.table.getPoint(
      definedQuantities[0],
      m[definedQuantities[0]] as number,
      m.temp,
    ),
    ...m,
  };
  if (
    r.dens &&
    (r.dens < model.table.densRange.min || r.dens > model.table.densRange.max)
  ) {
    return left(
      fillError(
        ErrorType.MAKEUP,
        `density outside allowed range of ${model.table.densRange.min.toFixed(2)}–${model.table.densRange.max.toFixed(2)}`,
        "incoherent",
      ),
    );
  }

  return right(r as NormalizedLiquidMakeup);
}

export function normalizeLiquid(
  liquid: Liquid | Either<ErrorLiquid, NormalizedLiquid>,
): Either<ErrorLiquid, NormalizedLiquid> {
  if (isEither(liquid)) {
    return liquid as Either<ErrorLiquid, NormalizedLiquid>;
  }
  let result = removeNullValues(liquid) as Liquid;
  const refTemp = KnownModels[model.id].tempRange.reference;

  if (typeof result.temp !== "number") {
    result.temp = refTemp;
  }

  switch (countNumberArgs(result.mass, result.vol, result.mvol)) {
    case 0:
      return left({ cause: "uninitialized", error: new Error() });
    case 1:
      break;
    default:
      return left(
        fillError(
          ErrorType.QUANTITY,
          "provide only one of mass and volume",
          "conflict",
        ),
      );
  }
  switch (
    countNumberArgs(
      result.kpa,
      result.lpa,
      result.abm,
      result.abv,
      result.dens,
      result.mabv,
      result.mabm,
      result.mdens,
    )
  ) {
    case 0:
      return left({ cause: "uninitialized", error: new Error() });
    case 1:
      break;
    default:
      return left(
        fillError(
          ErrorType.MAKEUP,
          "provide only one value for density or alcohol content",
          "conflict",
        ),
      );
  }

  if (typeof result.lpa === "number") {
    result.kpa =
      (result.lpa * model.table.getDensityFromABM(100, result.temp)) / 1000;
  }
  if (typeof result.kpa === "number") {
    result.lpa =
      (result.kpa * 1000) / model.table.getDensityFromABM(100, result.temp);
  }
  if (typeof result.kpa === "number" && typeof result.mass === "number") {
    result.abm = (result.kpa / result.mass) * 100;
  }
  if (
    typeof result.lpa === "number" &&
    (typeof result.vol === "number" || typeof result.mvol === "number")
  ) {
    if (result.temp == refTemp && typeof result.mvol === "number") {
      result.vol = result.mvol;
    }
    if (typeof result.vol === "number") {
      result.abv = (result.lpa / result.vol) * 100;
    } else {
      // to determine ABM we need density, which itself depends on temp and ABM
      return left(fillError(ErrorType.LIQUID, "not enough info", "incomplete"));
    }
  }
  return normalizeLiquidMakeup(result).chain((m) => {
    result = { ...result, ...m };
    if (result.mass === 0 || result.vol === 0) {
      result.mass = 0;
      result.vol = 0;
      result.mvol = 0;
      return right(result as NormalizedLiquid);
    }
    if (result.mass) {
      result.mvol = (1000 / m.dens) * result.mass;
      result.vol =
        (1000 / model.table.getDensityFromABM(m.abm, refTemp)) * result.mass;
    } else if (result.vol) {
      result.mass =
        (model.table.getDensityFromABM(m.abm, refTemp) / 1000) * result.vol;
      result.mvol =
        result.vol * (model.table.getDensityFromABM(m.abm, refTemp) / m.dens);
    } else if (result.mvol) {
      result.vol =
        result.mvol * (m.dens / model.table.getDensityFromABM(m.abm, refTemp));
      result.mass =
        (model.table.getDensityFromABM(m.abm, refTemp) / 1000) * result.vol;
    }
    result.kpa = ((result.mass as number) * (result.abm as number)) / 100;
    result.lpa =
      result.kpa / (model.table.getDensityFromABM(100, refTemp) / 1000);

    return right(result as NormalizedLiquid);
  });
}

export function sumLiquids(
  liquids: Liquid[],
): Either<ErrorLiquid, NormalizedLiquid> {
  return liquids
    .map((it) => normalizeLiquid(it))
    .reduce(
      (acc, liquid) => {
        if (liquid.isRight() && acc.isRight()) {
          acc.value.mass += liquid.value.mass;
          acc.value.kpa += liquid.value.kpa;
          return acc;
        } else {
          if (
            (liquid.isRight() || liquid.value.cause == "uninitialized") &&
            (acc.isRight() || acc.value.cause == "uninitialized")
          ) {
            return left({ cause: "uninitialized", error: new Error() });
          }
          return left({ cause: "incoherence" });
        }
      },
      right({ mass: 0, kpa: 0 }),
    )
    .chain(normalizeLiquid);
}

/** return the proportion of liquid 1 to achieve final ABM (so it's between 0 and 1)
 */
function computeRectificationSplit(
  ABM1: number,
  ABM2: number,
  finalABM: number,
): Either<ErrorLiquid, number> {
  if (
    !(
      (ABM1 <= finalABM && finalABM <= ABM2) ||
      (ABM1 >= finalABM && finalABM >= ABM2)
    )
  ) {
    return left({
      cause: "final ABV should be between base and rectifier",
    } as ErrorLiquid);
  }
  const midpoint = finalABM - Math.min(ABM1, ABM2);
  const range = Math.abs(ABM2 - ABM1);
  if (ABM1 < ABM2) {
    return right(1 - midpoint / range);
  } else {
    return right(midpoint / range);
  }
}

export function solveWithStartingQuantity(
  base: Liquid | Either<ErrorLiquid, NormalizedLiquid>,
  rectifier: LiquidMakeup | Either<ErrorLiquid, NormalizedLiquidMakeup>,
  final: LiquidMakeup | Either<ErrorLiquid, NormalizedLiquidMakeup>,
): Either<
  ErrorLiquid,
  { rectifier: NormalizedLiquid; final: NormalizedLiquid }
> {
  return merge([
    normalizeLiquid(base),
    normalizeLiquidMakeup(rectifier),
    normalizeLiquidMakeup(final),
  ]).chain(([b, r, f]) => {
    let s = computeRectificationSplit(b.abm, r.abm, f.abm);
    if (s.isLeft()) {
      return left(s.value);
    }
    const split = s.unwrap();

    const f_mass = b.mass * (1 / split);
    const r_mass = f_mass - b.mass;

    return merge([
      normalizeLiquid({
        ...{
          mass: r_mass,
        },
        ...removeNullValues(rectifier),
      }),
      normalizeLiquid({
        ...{
          mass: f_mass,
        },
        ...removeNullValues(final),
      }),
    ]).chain(([comp_r, comp_f]) => {
      return right({
        rectifier: comp_r,
        final: comp_f,
      });
    });
  });
}

export function solveWithFinalQuantity(
  base: LiquidMakeup | Either<ErrorLiquid, NormalizedLiquidMakeup>,
  rectifier: LiquidMakeup | Either<ErrorLiquid, NormalizedLiquidMakeup>,
  final: Liquid | Either<ErrorLiquid, NormalizedLiquid>,
): Either<
  ErrorLiquid,
  { base: NormalizedLiquid; rectifier: NormalizedLiquid }
> {
  return merge([
    normalizeLiquidMakeup(base),
    normalizeLiquidMakeup(rectifier),
    normalizeLiquid(final),
  ]).chain(([b, r, f]) => {
    let s = computeRectificationSplit(b.abm, r.abm, f.abm);
    if (s.isLeft()) {
      return left(s.value);
    }
    const split = s.unwrap();
    const b_mass = f.mass * split;
    const r_mass = f.mass - b_mass;

    return merge([
      normalizeLiquid({
        ...{
          mass: b_mass,
        },
        ...removeNullValues(base),
      }),
      normalizeLiquid({
        ...{
          mass: r_mass,
        },
        ...removeNullValues(rectifier),
      }),
    ]).chain(([comp_b, comp_r]) => {
      return right({
        base: comp_b,
        rectifier: comp_r,
      });
    });
  });
}
