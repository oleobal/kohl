import type { ContinuousModel } from "../models";
import {
  correctDensity,
  distortDensity,
  REFERENCE_TEMPERATURE,
} from "../oiml/practical";
import { computeDensity } from "./ideal";

const Model: ContinuousModel = {
  name: "Bettin–Spieweck 1990",
  computeDensity: computeDensity,
  tempRange: {
    min: -20,
    max: 40,
    reference: REFERENCE_TEMPERATURE,
  },
};

export default Model;
