import { Table } from "./physics/density";
import type { Liquid } from "./liquid";
import { GlassExpansionCoefficient } from "./physics/oiml/practical";
import { KnownModels } from "./physics/models";

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

class ModelState {
  id: keyof typeof KnownModels = $state("OIML_R22");
  glassAlpha: keyof typeof GlassExpansionCoefficient | number =
    $state("SODA_LIME");
  tables: {
    -readonly [Property in keyof typeof KnownModels]?: {
      -readonly [Property in keyof typeof GlassExpansionCoefficient]?: Table;
    };
  } = {};
  table: Table;

  constructor() {
    this.load(this.id, this.glassAlpha);
    this.table = $state(this.getTable());
  }

  load(
    id: keyof typeof KnownModels,
    glassAlpha: keyof typeof GlassExpansionCoefficient | number,
  ): Table {
    if (!(id in this.tables) || this.tables[id] == undefined) {
      this.tables[id] = {};
    }
    if (this.tables) {
      if (!(glassAlpha in this.tables[id])) {
        this.tables[id][glassAlpha] = new Table(
          KnownModels[id],
          typeof glassAlpha == "number"
            ? glassAlpha
            : GlassExpansionCoefficient[glassAlpha],
        );
        console.log("initializing model", id, glassAlpha);
      }
    }
    return this.tables[id][glassAlpha] as Table;
  }

  loadAndSelect(
    id: keyof typeof KnownModels,
    glassAlpha: keyof typeof GlassExpansionCoefficient | number,
  ): Table {
    this.table = this.load(id, glassAlpha);
    return this.table;
  }

  getTable() {
    return (
      this.tables[this.id] as {
        [Property in keyof typeof GlassExpansionCoefficient]: Table;
      }
    )[this.glassAlpha] as Table;
  }
}

export let model = new ModelState();
