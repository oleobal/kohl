import oimlr22 from "./oiml/model";
import gayLussac from "./gay-lussac-1824/model";
import bettinSpieweck from "./bettin-spieweck/model";
import naiveLinear from "./naive-linear/model";
import type { Point } from "./density";

export interface AlcoholmetryModel {
  name: string;
  tempRange: {
    min: number;
    max: number;
    reference: number;
  };
  densRange?: { min: number; max: number };
}

export interface TabularModel extends AlcoholmetryModel {
  tables: { [key: number]: Point[] };
}
export function isTabular(m: AlcoholmetryModel): m is TabularModel {
  return (m as TabularModel).tables !== undefined;
}

export interface ContinuousModel extends AlcoholmetryModel {
  computeDensity: (p: number, t: number) => number;
}
export function isContinuous(m: AlcoholmetryModel): m is ContinuousModel {
  return (m as ContinuousModel).computeDensity !== undefined;
}

export const KnownModels = {
  GAY_LUSSAC_1824: gayLussac,
  OIML_R22: oimlr22,
  BETTIN_SPIEWECK: bettinSpieweck,
  NAIVE_LINEAR: naiveLinear,
} as const;
