import { computeTables } from "./interpolate-data";
import { expect, test } from "vitest";

test("G-L reconstruction", () => {
  const { densRange, tables } = computeTables();
  // check the data looks alright
  Object.entries(
    tables as { [key: string]: { abm: number; abv: number; dens: number }[] },
  ).forEach(([t, v]) => {
    v.forEach((p) => {
      expect(typeof p.abm + typeof p.abv + typeof p.dens).toEqual(
        "numbernumbernumber",
      );
    });
  });
});
