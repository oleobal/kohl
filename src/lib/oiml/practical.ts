// implementation of "practical" tables from OIML R22

import { kdTree } from "kd-tree-javascript";
import { interpolateFourPoints, interpolateTwoPoints } from "../util";

/**
 * get 20C density from observed density by correcting for glass expansion
 */
export function adjustForGlassExpansion(
  observedDensity: number,
  t: number,
): number {
  // formula from annex I intro
  const alpha = 0.000025; // cubic expansion coefficient of glass per degree celsius (OIML R44)
  return observedDensity / (1 - alpha * (t - 20));
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
  interface GammaPoint {
    p: number;
    t: number;
    g: number;
    [key: string]: number;
  }

  function gammaDistance(a: GammaPoint, b: GammaPoint): number {
    return Math.sqrt(Math.pow(b.p - a.p, 2) + Math.pow(b.t - a.t, 2));
  }

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
  const points: GammaPoint[] = [
    { p: 0, t: 0, g: 75.6 },
    { p: 0, t: 10, g: 74.1 },
    { p: 0, t: 20, g: 72.6 },
    { p: 0, t: 30, g: 71.1 },
    { p: 0, t: 40, g: 69.6 },
    { p: 10, t: 0, g: 51.4 },
    { p: 10, t: 10, g: 49.7 },
    { p: 10, t: 20, g: 47.9 },
    { p: 10, t: 30, g: 46.1 },
    { p: 10, t: 40, g: 44.4 },
    { p: 20, t: -10, g: 42.7 },
    { p: 20, t: 0, g: 41.3 },
    { p: 20, t: 10, g: 39.8 },
    { p: 20, t: 20, g: 38.4 },
    { p: 20, t: 30, g: 37 },
    { p: 20, t: 40, g: 35.6 },
    { p: 30, t: -20, g: 36.5 },
    { p: 30, t: -10, g: 35.6 },
    { p: 30, t: 0, g: 34.7 },
    { p: 30, t: 10, g: 33.7 },
    { p: 30, t: 20, g: 32.8 },
    { p: 30, t: 30, g: 31.9 },
    { p: 30, t: 40, g: 31 },
    { p: 40, t: -20, g: 32.7 },
    { p: 40, t: -10, g: 32 },
    { p: 40, t: 0, g: 31.3 },
    { p: 40, t: 10, g: 30.6 },
    { p: 40, t: 20, g: 29.9 },
    { p: 40, t: 30, g: 29.2 },
    { p: 40, t: 40, g: 28.5 },
    { p: 50, t: -20, g: 31 },
    { p: 50, t: -10, g: 30.3 },
    { p: 50, t: 0, g: 29.6 },
    { p: 50, t: 10, g: 28.9 },
    { p: 50, t: 20, g: 28.2 },
    { p: 50, t: 30, g: 27.5 },
    { p: 50, t: 40, g: 26.8 },
    { p: 60, t: -20, g: 29.8 },
    { p: 60, t: -10, g: 29.1 },
    { p: 60, t: 0, g: 28.4 },
    { p: 60, t: 10, g: 27.7 },
    { p: 60, t: 20, g: 27 },
    { p: 60, t: 30, g: 26.3 },
    { p: 60, t: 40, g: 25.6 },
    { p: 70, t: -20, g: 28.8 },
    { p: 70, t: -10, g: 28.1 },
    { p: 70, t: 0, g: 27.4 },
    { p: 70, t: 10, g: 26.7 },
    { p: 70, t: 20, g: 26 },
    { p: 70, t: 30, g: 25.3 },
    { p: 70, t: 40, g: 24.6 },
    { p: 80, t: -20, g: 27.8 },
    { p: 80, t: -10, g: 27 },
    { p: 80, t: 0, g: 26.3 },
    { p: 80, t: 10, g: 25.6 },
    { p: 80, t: 20, g: 24.8 },
    { p: 80, t: 30, g: 24.1 },
    { p: 80, t: 40, g: 23.4 },
    { p: 90, t: -20, g: 26.8 },
    { p: 90, t: -10, g: 26.1 },
    { p: 90, t: 0, g: 25.3 },
    { p: 90, t: 10, g: 24.5 },
    { p: 90, t: 20, g: 23.7 },
    { p: 90, t: 30, g: 22.9 },
    { p: 90, t: 40, g: 22.2 },
    { p: 100, t: -20, g: 25.8 },
    { p: 100, t: -10, g: 25 },
    { p: 100, t: 0, g: 24.1 },
    { p: 100, t: 10, g: 23.3 },
    { p: 100, t: 20, g: 22.4 },
    { p: 100, t: 30, g: 21.6 },
    { p: 100, t: 40, g: 20.7 },
  ];

  const tree = new kdTree<GammaPoint>(points, gammaDistance, ["p", "t"]);

  let nearestPoints = tree.nearest({ p: abm, t: t } as GammaPoint, 4);
  nearestPoints.sort((a, b) => {
    return a[1] - b[1];
  });
  if (nearestPoints[0][1] == 0) {
    return nearestPoints[0][0].g; // exact match
  }
  if (nearestPoints[0][0].p == abm) {
    // linear match (p is known)
    return interpolateTwoPoints(
      [nearestPoints[0][0], nearestPoints[1][0]],
      "t",
      t,
      "g",
    );
  }
  if (nearestPoints[0][0].t == t) {
    // linear match (t is known)
    return interpolateTwoPoints(
      [nearestPoints[0][0], nearestPoints[1][0]],
      "p",
      abm,
      "g",
    );
  }
  return interpolateFourPoints(
    nearestPoints.map((p) => p[0]),
    "p",
    abm,
    "t",
    t,
    "g",
  );
}
