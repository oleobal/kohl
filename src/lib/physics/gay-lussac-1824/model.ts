import type { TabularModel } from "../models";
import { computeTables } from "./interpolate-data";

const { densRange, tables } = computeTables();

const Model: TabularModel = {
  name: "Gay-Lussac 1824",

  tables: tables,
  tempRange: {
    min: 0,
    max: 30,
    reference: 15,
  },
  densRange: densRange,
};

export default Model;
