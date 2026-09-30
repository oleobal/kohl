import oimlr22 from "./oiml/model";
import bettinSpieweck from "./bettin-spieweck/model";
import type { Point } from "./density";

export interface AlcoholmetryModel {
  name: string;
  tempRange: {
    min: number;
    max: number;
    reference: number;
  };
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
  OIML_R22: oimlr22,
  BETTIN_SPIEWECK: bettinSpieweck,
} as const;
