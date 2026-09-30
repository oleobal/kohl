import type { Either } from "@sweet-monads/either";
import { Table } from "./physics/density";
import { model } from "./state.svelte";

import {
  normalizeLiquid,
  normalizeLiquidMakeup,
  solveWithFinalQuantity,
  solveWithStartingQuantity,
  sumLiquids,
  type ErrorLiquid,
  type NormalizedLiquid,
  type NormalizedLiquidMakeup,
} from "./liquid";

import { test, expect, vi, type Assertion } from "vitest";
import { GlassExpansionCoefficient } from "./physics/oiml/practical";

test("makeupBasics", () => {
  expect(normalizeLiquidMakeup({ abv: 0, temp: 20 }).unwrap()).includes({
    abv: 0,
    temp: 20,
    abm: 0,
    mabv: 0,
  });
  expect(normalizeLiquidMakeup({ abv: 100, temp: 20 }).unwrap()).includes({
    abv: 100,
    temp: 20,
    abm: 100,
    mabv: 100,
  });
});

test("makeupSnapshots", () => {
  // we rely on global state, it's not ideal but let's make sure it's the global state we expect at least
  expect(
    model.id == "OIML_R22" &&
      model.glassAlpha == GlassExpansionCoefficient.SODA_LIME,
  );
  [
    { abv: 12 },
    { abm: 34 },
    { mabv: 56 },
    { mabm: 78 },
    { dens: 800 },
    { mdens: 800 },
  ].forEach((v) => {
    [-20, 0, 20, 40].forEach((t) => {
      expect(normalizeLiquidMakeup({ ...v, ...{ temp: t } })).toMatchSnapshot();
    });
  });
});

test("normalizeLiquidBasics", () => {
  expect(normalizeLiquid({ vol: 1, abv: 0, temp: 20 }).unwrap()).includes({
    vol: 1,
    abv: 0,
    temp: 20,
    abm: 0,
    mabv: 0,
  });
  expect(normalizeLiquid({ vol: 1, abv: 100, temp: 20 }).unwrap()).includes({
    vol: 1,
    abv: 100,
    temp: 20,
    abm: 100,
    mabv: 100,
  });
});

test("normalizeLiquidSnapshots", () => {
  expect(
    model.id == "OIML_R22" &&
      model.glassAlpha == GlassExpansionCoefficient.SODA_LIME,
  );
  [{ mass: 12 }, { vol: 34 }, { mvol: 56 }].forEach((left) => {
    [
      { abv: 12 },
      { abm: 34 },
      { mabv: 56 },
      { mabm: 78 },
      { dens: 850 },
      { mdens: 850 },
    ].forEach((right) => {
      [-20, 0, 20, 40].forEach((t) => {
        expect(
          normalizeLiquid({ ...left, ...right, ...{ temp: t } }),
        ).toMatchSnapshot();
      });
    });
  });
});

test("sumLiquids", () => {
  expect(
    model.id == "OIML_R22" &&
      model.glassAlpha == GlassExpansionCoefficient.SODA_LIME,
  );
  expect(
    sumLiquids([
      { mass: 1, abv: 0 },
      { mass: 1, abv: 0 },
    ]).unwrap(),
  ).includes({ mass: 2, abv: 0 });
  expect(
    sumLiquids([
      { mass: 1, abv: 100 },
      { mass: 1, abv: 100 },
    ]).unwrap(),
  ).includes({ mass: 2, abv: 100 });
  expect(
    sumLiquids([
      { mass: 1, abv: 0 },
      { mass: 1, abv: 100 },
    ]).unwrap(),
  ).includes({ mass: 2, kpa: 1 });
});

test("solveLiquid", () => {
  let all = (f: any, a: [any, any, any], tests: (a: Assertion) => void) => {
    let t = expect(f(...a).unwrap());
    tests(t);
  };

  all(
    solveWithFinalQuantity,
    [{ abm: 100 }, { abm: 0 }, { abm: 50, mass: 2 }],
    (a) => {
      a.nested.property("base.mass", 1);
      a.nested.property("rectifier.mass", 1);
    },
  );

  all(
    solveWithFinalQuantity,
    [{ abm: 100 }, { abm: 0 }, { abm: 0, mass: 2 }],
    (a) => {
      a.nested.property("base.mass", 0);
      a.nested.property("rectifier.mass", 2);
    },
  );

  all(
    solveWithStartingQuantity,
    [{ abm: 100, mass: 1 }, { abm: 0 }, { abm: 100 }],
    (a) => {
      a.nested.property("rectifier.mass", 0);
      a.nested.property("final.mass", 1);
    },
  );
  all(
    solveWithStartingQuantity,
    [{ abm: 100, mass: 1 }, { abm: 0 }, { abm: 50 }],
    (a) => {
      a.nested.property("rectifier.mass", 1);
      a.nested.property("final.mass", 2);
    },
  );
});
