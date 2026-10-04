import type { TabularModel } from "../models";

const Model: TabularModel = {
  name: "Naive linear",
  tables: {
    0: [
      { abm: 0, abv: 0, dens: 999.84 },
      { abm: 100, abv: 100, dens: 789.63 },
    ],
    20: [
      { abm: 0, abv: 0, dens: 998.2 },
      { abm: 100, abv: 100, dens: 789.45 },
    ],
    40: [
      { abm: 0, abv: 0, dens: 997.7 },
      { abm: 100, abv: 100, dens: 788.84 },
    ],
  },
  tempRange: {
    min: 0,
    max: 40,
    reference: 20,
  },
};

export default Model;
