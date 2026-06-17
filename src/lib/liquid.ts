import {
  getDensityFromABV,
  getDensityFromABM,
  getABMFromDensity,
  getABVFromDensity,
} from "./density.js";

export interface Liquid {
  mass?: number; // in kg
  volume?: number; // in litres

  ABV?: number; // alcohol by volume, percentage
  ABM?: number; // alcohol by mass, percentage
  density?: number; // in kg/L
  KPA?: number; // kilograms of pure alcohol
  LPA?: number; // litres of pure alcohol
}

export interface NormalizedLiquid {
  mass: number;
  volume: number;

  ABV: number;
  ABM: number;
  density: number;
  KPA: number;
  LPA: number;

  error?: {
    mass?: string;
    volume?: string;

    ABV?: string;
    ABM?: string;
    density?: string;
    KPA?: string;
    LPA?: string;
  };
}

function countNumberArgs(...args: any[]): number {
  let total = 0;
  for (const arg of args) {
    total += typeof arg === "number" ? 1 : 0;
  }
  return total;
}

export function normalizeLiquid(liquid: Liquid): NormalizedLiquid {
  var result: Liquid | NormalizedLiquid = {
    mass: undefined,
    volume: undefined,

    ABV: undefined,
    ABM: undefined,
    density: undefined,
    KPA: undefined,
    LPA: undefined,
  };

  result = { ...result, ...liquid };
  if (countNumberArgs(liquid.mass, liquid.volume) != 1) {
    (result as NormalizedLiquid).error = {
      mass: "we need exactly one of (volume, mass)",
      volume: "we need exactly one of (volume, mass)",
    };
    return result as NormalizedLiquid;
  }
  if (
    countNumberArgs(
      liquid.ABV || liquid.ABM || liquid.density || liquid.KPA || liquid.LPA,
    ) != 1
  ) {
    (result as NormalizedLiquid).error = {
      ABV: "we need exactly one of (ABV, ABM, density, KPA, LPA)",
      ABM: "we need exactly one of (ABV, ABM, density, KPA, LPA)",
      density: "we need exactly one of (ABV, ABM, density, KPA, LPA)",
      KPA: "we need exactly one of (ABV, ABM, density, KPA, LPA)",
      LPA: "we need exactly one of (ABV, ABM, density, KPA, LPA)",
    };
    return result as NormalizedLiquid;
  }

  function setQuantityBasedOnDensity() {
    if (!result.density) {
      throw Error("failed assertion: density not set");
    }
    if (result.mass) {
      result.volume = (1 / result.density) * result.mass;
    } else if (result.volume) {
      result.mass = result.density * result.volume;
    }
  }

  if (result.density) {
    setQuantityBasedOnDensity();
    result.ABV = getABVFromDensity(result.density);
    result.LPA = (result.ABV / 100) * (result.volume as number);
    result.ABM = getABMFromDensity(result.density);
    result.KPA = (result.ABM / 100) * (result.mass as number);
  } else if (result.ABM) {
    result.density = getDensityFromABM(result.ABM);
    setQuantityBasedOnDensity();
    result.ABV = getABVFromDensity(result.density);
    result.KPA = (result.ABM / 100) * (result.mass as number);
    result.LPA = result.KPA * (1 / 0.78934);
  } else if (result.ABV) {
    result.density = getDensityFromABV(result.ABV);
    setQuantityBasedOnDensity();
    result.LPA = (result.ABV / 100) * (result.volume as number);
    result.ABM = getABMFromDensity(result.density);
    result.KPA = (result.ABM / 100) * (result.mass as number);
  } else if (result.KPA || result.LPA) {
    if (result.KPA) {
      result.LPA = result.KPA * (1 / 0.78934);
    } else if (result.LPA) {
      result.KPA = result.LPA * 0.78934;
    }
    if (result.mass) {
      result.ABM = ((result.KPA as number) / result.mass) * 100;
      result.density = getDensityFromABM(result.ABM);
      setQuantityBasedOnDensity();
      result.ABV = getABVFromDensity(result.density);
    } else if (result.volume) {
      result.ABV = ((result.LPA as number) / result.volume) * 100;
      result.density = getDensityFromABV(result.ABV);
      setQuantityBasedOnDensity();
      result.ABM = getABMFromDensity(result.density);
    }
  }

  return result as NormalizedLiquid;
}

export function sumLiquids(liquids: Liquid[]) {
  let result = liquids
    .map((it) => normalizeLiquid(it))
    .reduce(
      (acc, liquid) => {
        acc.mass += liquid.mass;
        acc.KPA += liquid.KPA;
        return acc;
      },
      { mass: 0, KPA: 0 },
    );

  return normalizeLiquid(result);
}
