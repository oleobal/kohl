import { expect, test } from "vitest";

import { Table } from "./density";

// all reference values from OIML R22

test("Table I", () => {
  let table = new Table();
  expect(table.getDensityFromABM(30, -20)).toBeCloseTo(974.91, 2);
  expect(table.getDensityFromABM(50, -20)).toBeCloseTo(943.76, 2);
  expect(table.getDensityFromABM(80, -20)).toBeCloseTo(876.64, 2);
  expect(table.getDensityFromABM(100, -20)).toBeCloseTo(823.12, 2);

  expect(table.getDensityFromABM(25, -15)).toBeCloseTo(976.26, 2);
  expect(table.getDensityFromABM(50, -15)).toBeCloseTo(940.19, 2);
  expect(table.getDensityFromABM(80, -15)).toBeCloseTo(872.59, 2);
  expect(table.getDensityFromABM(100, -15)).toBeCloseTo(818.89, 2);

  expect(table.getDensityFromABM(12, -5)).toBeCloseTo(982.66, 2);
  expect(table.getDensityFromABM(50, -5)).toBeCloseTo(932.89, 2);
  expect(table.getDensityFromABM(80, -5)).toBeCloseTo(864.43, 2);
  expect(table.getDensityFromABM(100, -5)).toBeCloseTo(810.44, 2);

  expect(table.getDensityFromABM(0, 0)).toBeCloseTo(999.84, 2);
  expect(table.getDensityFromABM(50, 0)).toBeCloseTo(929.17, 2);
  expect(table.getDensityFromABM(80, 0)).toBeCloseTo(860.3, 2);
  expect(table.getDensityFromABM(100, 0)).toBeCloseTo(806.22, 2);

  expect(table.getDensityFromABM(0, 20)).toBeCloseTo(998.2, 2);
  expect(table.getDensityFromABM(50, 20)).toBeCloseTo(913.77, 2);
  expect(table.getDensityFromABM(80, 20)).toBeCloseTo(843.39, 2);
  expect(table.getDensityFromABM(100, 20)).toBeCloseTo(789.24, 2);

  expect(table.getDensityFromABM(0, 40)).toBeCloseTo(992.21, 2);
  expect(table.getDensityFromABM(50, 40)).toBeCloseTo(897.44, 2);
  expect(table.getDensityFromABM(80, 40)).toBeCloseTo(825.68, 2);
  expect(table.getDensityFromABM(100, 40)).toBeCloseTo(771.93, 2);
});

test("Table II", () => {
  let table = new Table();
  expect(table.getDensityFromABV(36, -20)).toBeCloseTo(975.08, 2);
  expect(table.getDensityFromABV(50, -20)).toBeCloseTo(958.36, 2);
  expect(table.getDensityFromABV(80, -20)).toBeCloseTo(891.99, 2);
  expect(table.getDensityFromABV(100, -20)).toBeCloseTo(823.12, 2);

  expect(table.getDensityFromABV(31, -15)).toBeCloseTo(976.01, 2);
  expect(table.getDensityFromABV(50, -15)).toBeCloseTo(955.05, 2);
  expect(table.getDensityFromABV(80, -15)).toBeCloseTo(888.04, 2);
  expect(table.getDensityFromABV(100, -15)).toBeCloseTo(818.89, 2);

  expect(table.getDensityFromABV(14, -5)).toBeCloseTo(983.33, 2);
  expect(table.getDensityFromABV(50, -5)).toBeCloseTo(948.23, 2);
  expect(table.getDensityFromABV(80, -5)).toBeCloseTo(880.03, 2);
  expect(table.getDensityFromABV(100, -5)).toBeCloseTo(810.44, 2);

  expect(table.getDensityFromABV(0, 0)).toBeCloseTo(999.84, 2);
  expect(table.getDensityFromABV(50, 0)).toBeCloseTo(944.73, 2);
  expect(table.getDensityFromABV(80, 0)).toBeCloseTo(875.97, 2);
  expect(table.getDensityFromABV(100, 0)).toBeCloseTo(806.22, 2);

  expect(table.getDensityFromABV(0, 20)).toBeCloseTo(998.2, 2);
  expect(table.getDensityFromABV(50, 20)).toBeCloseTo(930.14, 2);
  expect(table.getDensityFromABV(80, 20)).toBeCloseTo(859.27, 2);
  expect(table.getDensityFromABV(100, 20)).toBeCloseTo(789.24, 2);

  expect(table.getDensityFromABV(0, 40)).toBeCloseTo(992.21, 2);
  expect(table.getDensityFromABV(50, 40)).toBeCloseTo(914.57, 2);
  expect(table.getDensityFromABV(80, 40)).toBeCloseTo(841.76, 2);
  expect(table.getDensityFromABV(100, 40)).toBeCloseTo(771.93, 2);
});

test("Table IIIa", () => {
  let table = new Table();
  expect(table.getDensityFromABM(0, 20)).toBeCloseTo(998.2, 2);
  expect(table.getDensityFromABM(4.2, 20)).toBeCloseTo(990.69, 2);
  expect(table.getDensityFromABM(24.9, 20)).toBeCloseTo(961.78, 2);
  expect(table.getDensityFromABM(50, 20)).toBeCloseTo(913.77, 2);
  expect(table.getDensityFromABM(70.7, 20)).toBeCloseTo(865.94, 2);
  expect(table.getDensityFromABM(94.1, 20)).toBeCloseTo(806.69, 2);
  expect(table.getDensityFromABM(100, 20)).toBeCloseTo(789.24, 2);
});

test("Table IIIb", () => {
  let table = new Table();
  expect(table.getABVFromABM(0, 20)).toBeCloseTo(0, 2);
  expect(table.getABVFromABM(0.9, 20)).toBeCloseTo(1.14, 2);
  expect(table.getABVFromABM(29.5, 20)).toBeCloseTo(35.68, 2);
  expect(table.getABVFromABM(50, 20)).toBeCloseTo(57.89, 2);
  expect(table.getABVFromABM(90.9, 20)).toBeCloseTo(93.92, 2);
  expect(table.getABVFromABM(99.9, 20)).toBeCloseTo(99.94, 2);
  expect(table.getABVFromABM(100, 20)).toBeCloseTo(100, 2);
});

test("Table IVa", () => {
  let table = new Table();
  expect(table.getDensityFromABV(0, 20)).toBeCloseTo(998.2, 2);
  expect(table.getDensityFromABV(0.9, 20)).toBeCloseTo(996.85, 2);
  expect(table.getDensityFromABV(28.3, 20)).toBeCloseTo(964.28, 2);
  expect(table.getDensityFromABV(50, 20)).toBeCloseTo(930.14, 2);
  expect(table.getDensityFromABV(79.8, 20)).toBeCloseTo(859.83, 2);
  expect(table.getDensityFromABV(99.1, 20)).toBeCloseTo(793.77, 2);
  expect(table.getDensityFromABV(100, 20)).toBeCloseTo(789.24, 2);
});

test("Table IVb", () => {
  let table = new Table();
  expect(table.getABMFromABV(0, 20)).toBeCloseTo(0, 2);
  expect(table.getABMFromABV(0.1, 20)).toBeCloseTo(0.08, 2);
  expect(table.getABMFromABV(0.9, 20)).toBeCloseTo(0.71, 2);
  expect(table.getABMFromABV(20.9, 20)).toBeCloseTo(16.96, 2);
  expect(table.getABMFromABV(50, 20)).toBeCloseTo(42.43, 2);
  expect(table.getABMFromABV(76.4, 20)).toBeCloseTo(69.38, 2);
  expect(table.getABMFromABV(99.1, 20)).toBeCloseTo(98.53, 2);
  expect(table.getABMFromABV(99.9, 20)).toBeCloseTo(99.83, 2);
  expect(table.getABMFromABV(100, 20)).toBeCloseTo(100, 2);
});

test("Table Va", () => {
  let table = new Table();
  expect(table.getABMFromDensity(789.3, 20)).toBeCloseTo(99.98, 2);
  expect(table.getABMFromDensity(790, 20)).toBeCloseTo(99.76, 2);
  expect(table.getABMFromDensity(800.9, 20)).toBeCloseTo(96.13, 2);
  expect(table.getABMFromDensity(850, 20)).toBeCloseTo(77.3, 2);
  expect(table.getABMFromDensity(900, 20)).toBeCloseTo(56.12, 2);
  expect(table.getABMFromDensity(950, 20)).toBeCloseTo(32.2, 2);
  expect(table.getABMFromDensity(998, 20)).toBeCloseTo(0.1, 2);
  expect(table.getABMFromDensity(998.2, 20)).toBeCloseTo(0, 2);
});

test("Table Vb", () => {
  let table = new Table();
  expect(table.getABVFromDensity(789.3, 20)).toBeCloseTo(99.99, 2);
  expect(table.getABVFromDensity(790, 20)).toBeCloseTo(99.85, 2);
  expect(table.getABVFromDensity(800.9, 20)).toBeCloseTo(97.55, 2);
  expect(table.getABVFromDensity(850, 20)).toBeCloseTo(83.26, 2);
  expect(table.getABVFromDensity(900, 20)).toBeCloseTo(64, 2);
  expect(table.getABVFromDensity(950, 20)).toBeCloseTo(38.76, 2);
  expect(table.getABVFromDensity(998, 20)).toBeCloseTo(0.13, 2);
  expect(table.getABVFromDensity(998.2, 20)).toBeCloseTo(0, 2);
});
