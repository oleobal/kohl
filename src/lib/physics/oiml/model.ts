import type { ContinuousModel } from "../models";
import { computeDensity } from "./ideal";
import {
  distortDensity,
  correctDensity,
  REFERENCE_TEMPERATURE,
} from "./practical";

const Model: ContinuousModel = {
  name: "Wagenbreth–Blanke 1973",
  computeDensity: computeDensity,
  tempRange: {
    min: -20,
    max: 40,
    reference: REFERENCE_TEMPERATURE,
  },
};

export default Model;
