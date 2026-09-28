import { Table } from "./physics/density";
import type { Liquid } from "./liquid";
import { GlassExpansionCoefficient } from "./physics/oiml/practical";
import { knownModels, type KnownModels } from "./physics/models";

export let appSettings: { [key: string]: any } = $state({
  locale: "en",
});

export let liquids: {
  ids: string[];
  data: { [key: string]: Liquid };
} = $state({
  ids: [],
  data: {},
});

export let model: {
  id: keyof KnownModels;
  glassAlpha: keyof typeof GlassExpansionCoefficient | number;
  table: Table;
} = $state({
  id: "OIML_R22",
  glassAlpha: "SODA_LIME",
  table: new Table(knownModels.OIML_R22, GlassExpansionCoefficient.SODA_LIME),
});
