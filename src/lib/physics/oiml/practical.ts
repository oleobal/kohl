// implementation of "practical" tables from OIML R22

import {
  CollectionDirection,
  findNearestElements2D,
  interpolateFourPoints,
  interpolateTwoPoints,
} from "../../util";

export enum GlassExpansionCoefficient {
  // cubic expansion coefficient per degree celsius
  // values from OIML R22, literature can have other values (especially for borosilicate)
  SODA_LIME = 25e-6,
  BOROSILICATE = 10e-6,
  NO_CORRECTION = 0,
}

export const REFERENCE_TEMPERATURE = 20;

/**
 * get RefTemp density from observed density by correcting for glass expansion
 */
export function correctDensity(
  measuredDensity: number,
  temp: number,
  glassAlpha: number,
): number {
  return measuredDensity * (1 - glassAlpha * (temp - REFERENCE_TEMPERATURE));
}

/**
 * distort by simulating glass expansion
 */
export function distortDensity(
  trueDensity: number,
  temp: number,
  glassAlpha: number,
): number {
  return trueDensity / (1 - glassAlpha * (temp - REFERENCE_TEMPERATURE));
}

/**
 * get ABV or density adjusted for surface tension
 *
 * surface tension depends on temperature, ethanol content, and characteristics of the instrument
 */
export function adjustForSurfaceTension(
  quantity: number,
  sensitivity: number, // instrument sensitivity, in m^-1 (quantity per meter). ABV => 3; dens=>30
  actualDensity: number,
  actualABM: number,
  t: number,
): number {
  // R22 annex II
  const E = sensitivity; // m^-1
  const d = 0.003; // stem diameter, m (OIML R44 class II)
  const rho = actualDensity; // g/L
  const g = 9.81; // earth attraction, m^-2

  const gamma = getSurfaceTension(actualABM, t); // mN/m
  const gamma20C = getSurfaceTension(actualABM, 20); // mN/m

  return quantity + (4 / (g * E * d * rho)) * (gamma - gamma20C);
}

/** superficial tension in mN/m */
export function getSurfaceTension(abm: number, t: number) {
  /*
  		75.6	74.1	72.6	71.1	69.6
  		51.4	49.7	47.9	46.1	44.4
  	42.7	41.3	39.8	38.4	37	35.6
  36.5	35.6	34.7	33.7	32.8	31.9	31
  32.7	32	31.3	30.6	29.9	29.2	28.5
  31	30.3	29.6	28.9	28.2	27.5	26.8
  29.8	29.1	28.4	27.7	27	26.3	25.6
  28.8	28.1	27.4	26.7	26	25.3	24.6
  27.8	27	26.3	25.6	24.8	24.1	23.4
  26.8	26.1	25.3	24.5	23.7	22.9	22.2
  25.8	25	24.1	23.3	22.4	21.6	20.7
  */
  const points: { [key: number]: { p: number; g: number }[] } = {};

  points[-20] = [
    { p: 30, g: 36.5 },
    { p: 40, g: 32.7 },
    { p: 50, g: 31 },
    { p: 60, g: 29.8 },
    { p: 70, g: 28.8 },
    { p: 80, g: 27.8 },
    { p: 90, g: 26.8 },
    { p: 100, g: 25.8 },
  ];
  points[-10] = [
    { p: 20, g: 42.7 },
    { p: 30, g: 35.6 },
    { p: 40, g: 32 },
    { p: 50, g: 30.3 },
    { p: 60, g: 29.1 },
    { p: 70, g: 28.1 },
    { p: 80, g: 27 },
    { p: 90, g: 26.1 },
    { p: 100, g: 25 },
  ];
  points[0] = [
    { p: 0, g: 75.6 },
    { p: 10, g: 51.4 },
    { p: 20, g: 41.3 },
    { p: 30, g: 34.7 },
    { p: 40, g: 31.3 },
    { p: 50, g: 29.6 },
    { p: 60, g: 28.4 },
    { p: 70, g: 27.4 },
    { p: 80, g: 26.3 },
    { p: 90, g: 25.3 },
    { p: 100, g: 24.1 },
  ];
  points[10] = [
    { p: 0, g: 74.1 },
    { p: 10, g: 49.7 },
    { p: 20, g: 39.8 },
    { p: 30, g: 33.7 },
    { p: 40, g: 30.6 },
    { p: 50, g: 28.9 },
    { p: 60, g: 27.7 },
    { p: 70, g: 26.7 },
    { p: 80, g: 25.6 },
    { p: 90, g: 24.5 },
    { p: 100, g: 23.3 },
  ];
  points[20] = [
    { p: 0, g: 72.6 },
    { p: 10, g: 47.9 },
    { p: 20, g: 38.4 },
    { p: 30, g: 32.8 },
    { p: 40, g: 29.9 },
    { p: 50, g: 28.2 },
    { p: 60, g: 27 },
    { p: 70, g: 26 },
    { p: 80, g: 24.8 },
    { p: 90, g: 23.7 },
    { p: 100, g: 22.4 },
  ];
  points[30] = [
    { p: 0, g: 71.1 },
    { p: 10, g: 46.1 },
    { p: 20, g: 37 },
    { p: 30, g: 31.9 },
    { p: 40, g: 29.2 },
    { p: 50, g: 27.5 },
    { p: 60, g: 26.3 },
    { p: 70, g: 25.3 },
    { p: 80, g: 24.1 },
    { p: 90, g: 22.9 },
    { p: 100, g: 21.6 },
  ];
  points[40] = [
    { p: 0, g: 69.6 },
    { p: 10, g: 44.4 },
    { p: 20, g: 35.6 },
    { p: 30, g: 31 },
    { p: 40, g: 28.5 },
    { p: 50, g: 26.8 },
    { p: 60, g: 25.6 },
    { p: 70, g: 24.6 },
    { p: 80, g: 23.4 },
    { p: 90, g: 22.2 },
    { p: 100, g: 20.7 },
  ];

  let nearestPoints = findNearestElements2D(
    points,
    "temp",
    t,
    "p",
    abm,
    CollectionDirection.ASC,
    CollectionDirection.ASC,
  );
  return interpolateFourPoints(nearestPoints, "t", t, "p", abm, "g");
}

// "frozen" values are implicit in the provided tables

export function isFrozenABV(abv: number, temperature: number) {
  return (
    (temperature <= -20 && abv < 36) ||
    (temperature <= -19 && abv < 35) ||
    (temperature <= -18 && abv < 34) ||
    (temperature <= -17 && abv < 33) ||
    (temperature <= -16 && abv < 32) ||
    (temperature <= -15 && abv < 31) ||
    (temperature <= -14 && abv < 30) ||
    (temperature <= -13 && abv < 28) ||
    (temperature <= -12 && abv < 26) ||
    (temperature <= -11 && abv < 25) ||
    (temperature <= -10 && abv < 23) ||
    (temperature <= -9 && abv < 21) ||
    (temperature <= -8 && abv < 20) ||
    (temperature <= -7 && abv < 18) ||
    (temperature <= -6 && abv < 16) ||
    (temperature <= -5 && abv < 14) ||
    (temperature <= -4 && abv < 12) ||
    (temperature <= -3 && abv < 9) ||
    (temperature <= -2 && abv < 6) ||
    (temperature <= -1 && abv < 3)
  );
}
export function isFrozenABM(abm: number, temperature: number) {
  return (
    (temperature <= -20 && abm < 30) ||
    (temperature <= -19 && abm < 29) ||
    (temperature <= -18 && abm < 28) ||
    (temperature <= -17 && abm < 27) ||
    (temperature <= -16 && abm < 26) ||
    (temperature <= -15 && abm < 25) ||
    (temperature <= -14 && abm < 24) ||
    (temperature <= -13 && abm < 23) ||
    (temperature <= -12 && abm < 22) ||
    (temperature <= -11 && abm < 21) ||
    (temperature <= -10 && abm < 19) ||
    (temperature <= -9 && abm < 18) ||
    (temperature <= -8 && abm < 17) ||
    (temperature <= -7 && abm < 15) ||
    (temperature <= -6 && abm < 13) ||
    (temperature <= -5 && abm < 12) ||
    (temperature <= -4 && abm < 10) ||
    (temperature <= -3 && abm < 7) ||
    (temperature <= -2 && abm < 5) ||
    (temperature <= -1 && abm < 3)
  );
}
