import {
  isEither,
  left,
  merge,
  right,
  type Either,
} from "@sweet-monads/either";

import {
  getDensityFromABV,
  getDensityFromABM,
  getABMFromDensity,
  getABVFromDensity,
  DENSITY_ETHANOL,
  DENSITY_WATER,
} from "./density.js";

export interface LiquidMakeup {
  ABV?: number; // alcohol by volume, percentage
  density?: number; // in kg/L
  ABM?: number; // alcohol by mass, percentage
}

export interface Liquid extends LiquidMakeup {
  mass?: number; // in kg
  volume?: number; // in litres
  LPA?: number; // litres of pure alcohol
  KPA?: number; // kilograms of pure alcohol
}

export interface NormalizedLiquidMakeup {
  ABV: number; // alcohol by volume, percentage
  density: number; // in kg/L
  ABM: number; // alcohol by mass, percentage
}

export interface NormalizedLiquid extends NormalizedLiquidMakeup {
  mass: number; // in kg
  volume: number; // in litres
  LPA: number; // litres of pure alcohol
  KPA: number; // kilograms of pure alcohol
}

export interface ErrorLiquid {
  cause?: any;

  mass?: string;
  volume?: string;

  ABV?: string;
  LPA?: string;
  density?: string;
  ABM?: string;
  KPA?: string;
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
    m = m as LiquidMakeup;
  }
  switch (countNumberArgs(m.ABV, m.ABM, m.density)) {
    case 0:
      return left({ cause: "uninitialized" });
    case 1:
      break;
    default:
      return left({
        cause: "provide only one of ABV, LPA and density",
        ABV: "conflict",
        ABM: "conflict",
        density: "conflict",
      });
  }
  if (m.ABM != null) {
    if (m.ABM < 0 || m.ABM > 100) {
      return left({ cause: "impossible ABM" });
    }
    const d = getDensityFromABM(m.ABM);
    return right({
      ABM: m.ABM,
      density: d,
      ABV: getABVFromDensity(d),
    });
  } else if (m.ABV != null) {
    if (m.ABV < 0 || m.ABV > 100) {
      return left({ cause: "impossible ABV" });
    }
    const d = getDensityFromABV(m.ABV);
    return right({
      ABV: m.ABV,
      density: d,
      ABM: getABMFromDensity(d),
    });
  } else if (m.density != null) {
    if (m.density < DENSITY_ETHANOL) {
      return left({ cause: "density below that of pure ethanol" });
    }
    if (m.density > DENSITY_WATER) {
      return left({ cause: "density above that of pure water" });
    }
    return right({
      ABV: getABVFromDensity(m.density),
      density: m.density,
      ABM: getABMFromDensity(m.density),
    });
  }
  return left({ cause: "unreachable" });
}

export function normalizeLiquid(
  liquid: Liquid | Either<ErrorLiquid, NormalizedLiquid>,
): Either<ErrorLiquid, NormalizedLiquid> {
  if (isEither(liquid)) {
    return liquid as Either<ErrorLiquid, NormalizedLiquid>;
  } else {
    liquid = liquid as Liquid;
  }
  let result: Liquid = {
    mass: undefined,
    volume: undefined,

    ABV: undefined,
    ABM: undefined,
    density: undefined,
    KPA: undefined,
    LPA: undefined,
  };

  result = { ...result, ...liquid };
  switch (countNumberArgs(liquid.mass, liquid.volume)) {
    case 0:
      return left({ cause: "uninitialized" });
    case 1:
      break;
    default:
      return left({
        cause: "provide only one of mass and volume",
        mass: "conflict",
        volume: "conflict",
      });
  }
  if (result?.mass === 0 || result?.volume === 0) {
    return right({
      mass: 0,
      volume: 0,
      ABV: 0,
      ABM: 0,
      density: 1,
      KPA: 0,
      LPA: 0,
    });
  }

  switch (
    countNumberArgs(
      liquid.ABV,
      liquid.ABM,
      liquid.density,
      liquid.KPA,
      liquid.LPA,
    )
  ) {
    case 0:
      return left({ cause: "uninitialized" });
    case 1:
      break;
    default:
      return left({
        cause: "provide only one of ABV, LPA, density, KPA and LPA",
        ABV: "conflict",
        ABM: "conflict",
        density: "conflict",
        KPA: "conflict",
        LPA: "conflict",
      });
  }

  function setQuantityBasedOnDensity(): ErrorLiquid | undefined {
    if (
      !result.density ||
      result.density < DENSITY_ETHANOL ||
      result.density > DENSITY_WATER
    ) {
      return {
        cause: "invalid density",
        mass: "incoherent",
        volume: "incoherent",

        ABV: "incoherent",
        LPA: "incoherent",
        density: "incoherent",
        ABM: "incoherent",
        KPA: "incoherent",
      } as ErrorLiquid;
    }
    if (result.mass) {
      result.volume = (1 / result.density) * result.mass;
    } else if (result.volume) {
      result.mass = result.density * result.volume;
    }
  }

  if (result.density != null) {
    let error = setQuantityBasedOnDensity();
    if (error) {
      return left(error); // this is obviously the wrong way round but I'll fix it later
    }
    result.ABV = getABVFromDensity(result.density);
    result.LPA = (result.ABV / 100) * (result.volume as number);
    result.ABM = getABMFromDensity(result.density);
    result.KPA = (result.ABM / 100) * (result.mass as number);
  } else if (result.ABM != null) {
    result.density = getDensityFromABM(result.ABM);
    let error = setQuantityBasedOnDensity();
    if (error) {
      return left(error); // this is obviously the wrong way round but I'll fix it later
    }
    result.ABV = getABVFromDensity(result.density);
    result.KPA = (result.ABM / 100) * (result.mass as number);
    result.LPA = result.KPA * (1 / DENSITY_ETHANOL);
  } else if (result.ABV != null) {
    result.density = getDensityFromABV(result.ABV);
    let error = setQuantityBasedOnDensity();
    if (error) {
      return left(error); // this is obviously the wrong way round but I'll fix it later
    }
    result.LPA = (result.ABV / 100) * (result.volume as number);
    result.ABM = getABMFromDensity(result.density);
    result.KPA = (result.ABM / 100) * (result.mass as number);
  } else if (result.KPA != null || result.LPA != null) {
    if (result.KPA != null) {
      result.LPA = result.KPA * (1 / DENSITY_ETHANOL);
    } else if (result.LPA != null) {
      result.KPA = result.LPA * DENSITY_ETHANOL;
    }
    if (result.mass) {
      result.ABM = ((result.KPA as number) / result.mass) * 100;
      result.density = getDensityFromABM(result.ABM);
      let error = setQuantityBasedOnDensity();
      if (error) {
        return left(error); // this is obviously the wrong way round but I'll fix it later
      }
      result.ABV = getABVFromDensity(result.density);
    } else if (result.volume) {
      result.ABV = ((result.LPA as number) / result.volume) * 100;
      result.density = getDensityFromABV(result.ABV);
      let error = setQuantityBasedOnDensity();
      if (error) {
        return left(error); // this is obviously the wrong way round but I'll fix it later
      }
      result.ABM = getABMFromDensity(result.density);
    }
  }

  return right(result as NormalizedLiquid);
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
          acc.value.KPA += liquid.value.KPA;
          return acc;
        } else {
          if (
            (liquid.isRight() || liquid.value.cause == "uninitialized") &&
            (acc.isRight() || acc.value.cause == "uninitialized")
          ) {
            return left({ cause: "uninitialized" });
          }
          return left({ cause: "incoherence" });
        }
      },
      right({ mass: 0, KPA: 0 }),
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
    let s = computeRectificationSplit(b.ABM, r.ABM, f.ABM);
    if (s.isLeft()) {
      return left(s.value);
    }
    const split = s.unwrap();

    const f_mass = b.mass * (1 / split);
    const r_mass = f_mass - b.mass;

    console.log("dayum", b, r, f);
    return merge([
      normalizeLiquid({
        ...{
          mass: r_mass,
        },
        ...rectifier,
      }),
      normalizeLiquid({
        ...{
          mass: f_mass,
        },
        ...final,
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
    let s = computeRectificationSplit(b.ABM, r.ABM, f.ABM);
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
        ...base,
      }),
      normalizeLiquid({
        ...{
          mass: r_mass,
        },
        ...rectifier,
      }),
    ]).chain(([comp_b, comp_r]) => {
      return right({
        base: comp_b,
        rectifier: comp_r,
      });
    });
  });
}
