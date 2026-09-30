import type { ContinuousModel } from "../models";
import { computeDensity } from "./ideal";

const Model: ContinuousModel = {
  name: "OIML R22",
  computeDensity: computeDensity,
  tempRange: {
    min: -20,
    max: 40,
    reference: 20,
  },
};

export default Model;
