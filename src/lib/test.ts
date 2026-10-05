import { Table } from "./physics/density";
import { KnownModels } from "./physics/models";
import { GlassExpansionCoefficient } from "./physics/oiml/practical";

export const t = new Table(
  KnownModels.GAY_LUSSAC_1824,
  GlassExpansionCoefficient.SODA_LIME,
);
