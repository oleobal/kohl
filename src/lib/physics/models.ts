import { computeDensity as oiml_computeDensity } from "./oiml/ideal";
import { computeDensity as bs_computeDensity } from "./bettin-spieweck/ideal";

export interface AlcoholmetryModelCard {
  name: string;
  computeDensity: (p: number, t: number) => number;
  tempRange: {
    min: number;
    max: number;
  };
}

export interface KnownModels {
  OIML_R22: AlcoholmetryModelCard;
  BETTIN_SPIEWECK: AlcoholmetryModelCard;
}

export const knownModels: KnownModels = {
  OIML_R22: {
    name: "OIML R22",
    computeDensity: oiml_computeDensity,
    tempRange: {
      min: -20,
      max: 40,
    },
  },
  BETTIN_SPIEWECK: {
    name: "Bettin–Spieweck",
    computeDensity: bs_computeDensity,
    tempRange: {
      min: -20,
      max: 40,
    },
  },
};
