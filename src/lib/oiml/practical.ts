// implementation of "practical" tables from OIML R22

/**
 * get 20C density from observed density
 * (corrects for glass expansion in instruments)
 */
export function adjustDensity(observedDensity: number, t: number): number {
  // formula from annex I intro
  const alpha = 0.000025; // cubic expansion coefficient of glass in C^-1
  return observedDensity / (1 - alpha * (t - 20));
}
