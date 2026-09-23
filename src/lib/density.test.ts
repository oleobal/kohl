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

test("Table VIIIa", () => {
  let table = new Table();
  expect(table.getCorrectedABM(0, 20)).toBeCloseTo(0, 1);
  expect(table.getCorrectedABM(25.4, 20)).toBeCloseTo(25.4, 1);
  expect(table.getCorrectedABM(81.2, 20)).toBeCloseTo(81.2, 1);
  expect(table.getCorrectedABM(100, 20)).toBeCloseTo(100, 1);

  // all data from METAS

  expect(table.getCorrectedABM(13.5, -10)).toBeCloseTo(19.6, 1);
  expect(table.getCorrectedABM(40, -10)).toBeCloseTo(50.3, 1);
  expect(table.getCorrectedABM(80.5, -10)).toBeCloseTo(90.2, 1);
  expect(table.getCorrectedABM(91, -10)).toBeCloseTo(99.6, 1);

  expect(table.getCorrectedABM(0, 0)).toBeCloseTo(0.6, 1);
  expect(table.getCorrectedABM(40, 0)).toBeCloseTo(46.9, 1);
  expect(table.getCorrectedABM(80.5, 0)).toBeCloseTo(87.1, 1);
  expect(table.getCorrectedABM(94, 0)).toBeCloseTo(99.6, 1);

  expect(table.getCorrectedABM(2.5, 35)).toBeCloseTo(0.4, 1);
  expect(table.getCorrectedABM(40, 35)).toBeCloseTo(34.7, 1);
  expect(table.getCorrectedABM(80.5, 35)).toBeCloseTo(75.3, 1);
  expect(table.getCorrectedABM(100, 35)).toBeCloseTo(95.8, 1);
});

test("Table VIIIb", () => {
  let table = new Table();

  const values = [
    // Oudin data (from his Guide pratique d'alcoométrie)
    // [66, 6, 70.6],

    // discarding the Oudin data as Evelyne Chanson showed it to be unreliable

    // METAS data (from the Swiss government website)
    [66, 6, 70.6],
    [0, 0, 0.7],
    [13, -6, 16.0],
    [12, 25, 10.9],
    [19, 16, 20.2],
    [37.5, 17, 38.7],
    [53.5, -9, 63.5],
    [66, 35, 60.8],
    [86.5, 6, 90.2],
    [94.5, -9, 100],
    [97.5, 16, 98.3],
    [99, 33, 96.5],

    // EC data (from the EU commission's Practical Alcoholic strength tables)
    [19.5, -20, 36.0],
    [22, -17.5, 38.1],
    [39, -18, 53.7],
    [63, -20, 75.7],
    [80, -17.5, 90.2],
    [92.0, -20, 100],
    [92.6, -17.5, 100],
    [18.1, -15, 30],
    [93.1, -15, 99.9],
    [17.4, -12.5, 26.8],
    [35, -12.5, 48.2],
    [93.7, -12.5, 100],
    [16.4, -10, 23.3],
    [70, -10, 79.2],
    [94.3, -10, 100],
    [14.6, -7.5, 18.9],
    [29, -7.5, 40.7],
    [94.8, -7.5, 100],
    [11.6, -5, 13.9],
    [73.8, -5, 81.3],
    [95.3, -5, 99.9],
    [6.3, -2.5, 7.3],
    [30, -2.5, 39.5],
    [95.8, -2.5, 99.9],
    [0, 0, 0.7],
    [50, 0, 57.2],
    [96.3, 0, 99.9],
    [0, 2.5, 0.9],
    [75, 2.5, 80.3],
    [96.8, 2.5, 99.9],
    [0, 5, 0.9],
    [33, 5, 39.2],

    [3.8, 40, 0],
    [30, 40, 22.2],
    [62, 40, 54.9],
    [86, 40, 80.1],
    [100, 40, 96.3],
    [102.9, 40, 99.8],
    [103.0, 40, 99.9],
    [103.1, 40, 100],
  ];

  values.forEach((v) => {
    expect(table.getCorrectedABV(v[0], v[1])).toBeCloseTo(v[2], 1);
  });
});
