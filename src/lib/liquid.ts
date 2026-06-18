import {
  getDensityFromABV,
  getDensityFromABM,
  getABMFromDensity,
  getABVFromDensity,
  DENSITY_ETHANOL,
  DENSITY_WATER,
} from "./density.js";

import type { Result } from "./util.js";
import { ok, err } from "./util.js";

export interface Liquid {
  mass?: number; // in kg
  volume?: number; // in litres

  ABV?: number; // alcohol by volume, percentage
  LPA?: number; // litres of pure alcohol
  density?: number; // in kg/L
  ABM?: number; // alcohol by mass, percentage
  KPA?: number; // kilograms of pure alcohol
}

export interface NormalizedLiquid {
  mass: number;
  volume: number;

  ABV: number;
  LPA: number;
  density: number;
  ABM: number;
  KPA: number;
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

export function normalizeLiquid(
  liquid: Liquid | Result<NormalizedLiquid, ErrorLiquid>,
): Result<NormalizedLiquid, ErrorLiquid> {
  if (Object.hasOwn(liquid, "ok")) {
    return liquid as Result<NormalizedLiquid, ErrorLiquid>;
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
      return err({ cause: "uninitialized" });
    case 1:
      break;
    default:
      return err({
        cause:
          "conflicting parameters: only one of mass and volume must be given",
        mass: "conflict",
        volume: "conflict",
      });
  }
  if (result?.mass === 0 || result?.volume === 0) {
    return ok({
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
      return err({ cause: "uninitialized" });
    case 1:
      break;
    default:
      return err({
        cause:
          "conflicting parameters: only one of ABV, LPA, density, ABM and KPA must be given",
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
      return err(error); // this is obviously the wrong way round but I'll fix it later
    }
    result.ABV = getABVFromDensity(result.density);
    result.LPA = (result.ABV / 100) * (result.volume as number);
    result.ABM = getABMFromDensity(result.density);
    result.KPA = (result.ABM / 100) * (result.mass as number);
  } else if (result.ABM != null) {
    result.density = getDensityFromABM(result.ABM);
    let error = setQuantityBasedOnDensity();
    if (error) {
      return err(error); // this is obviously the wrong way round but I'll fix it later
    }
    result.ABV = getABVFromDensity(result.density);
    result.KPA = (result.ABM / 100) * (result.mass as number);
    result.LPA = result.KPA * (1 / DENSITY_ETHANOL);
  } else if (result.ABV != null) {
    result.density = getDensityFromABV(result.ABV);
    let error = setQuantityBasedOnDensity();
    if (error) {
      return err(error); // this is obviously the wrong way round but I'll fix it later
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
        return err(error); // this is obviously the wrong way round but I'll fix it later
      }
      result.ABV = getABVFromDensity(result.density);
    } else if (result.volume) {
      result.ABV = ((result.LPA as number) / result.volume) * 100;
      result.density = getDensityFromABV(result.ABV);
      let error = setQuantityBasedOnDensity();
      if (error) {
        return err(error); // this is obviously the wrong way round but I'll fix it later
      }
      result.ABM = getABMFromDensity(result.density);
    }
  }

  return ok(result as NormalizedLiquid);
}

export function sumLiquids(
  liquids: Liquid[],
): Result<NormalizedLiquid, ErrorLiquid> {
  let result = liquids
    .map((it) => normalizeLiquid(it))
    .reduce(
      (acc, liquid) => {
        if (liquid.ok) {
          acc.value.mass += liquid.value.mass;
          acc.value.KPA += liquid.value.KPA;
          return acc;
        } else {
          return {
            ok: false,
            value: { mass: 0, KPA: 0 },
          };
        }
      },
      { ok: true, value: { mass: 0, KPA: 0 } },
    );

  if (result.ok) {
    return normalizeLiquid(result.value);
  } else {
    return { ok: false, error: { cause: "incoherence" } };
  }
}
