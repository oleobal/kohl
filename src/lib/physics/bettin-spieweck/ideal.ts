// Model from "A Revised Formula for the Calculation of Alcoholometric Tables"
// by Horst Bettin & Frank Spieweck
// published in PTB-Mitteilungen 6-1990 p. 457

// prettier-ignore
const ALPHA = [
   9.1376673e2,
  -2.2175948e2,
  -5.9617860e1,
   1.4682019e2,
  -5.6651750e2,
   6.2118006e2,
   3.7824439e3,
  -9.7453133e3,
  -9.5734653e3,
   3.2677808e4,
   8.7637383e3,
  -3.9026437e4,
];

// prettier-ignore
const B = [
  -7.9437550e-1,
  -1.2168407e-3,
   3.5017833e-6,
   1.7709440e-7,
  -3.4138828e-9,
  -9.9880242e-11,
];

// prettier-ignore
const C = [
  [
    -3.9158709e-1,
     1.1518337,
    -5.0416999,
     1.3381608e1,
     4.5899913,
    -1.1821000e2,
     1.9054020e2,
     3.3981954e2,
    -9.0032344e2,
    -3.4932012e2,
     1.2859318e3,
  ],

  [
    -1.2083196e-4,
    -5.7466248e-3,
     1.2030894e-1,
    -2.3519694e-1,
    -1.0362738,
     2.1804505,
     4.2763108,
    -6.8624848,
    -6.9384031,
     7.4460428,
  ],

  [
    -3.8683211e-5,
    -2.0911429e-4,
     2.6713888e-3,
     4.1042045e-3,
    -4.9364385e-2,
    -1.7952946e-2,
     2.9012506e-1,
     2.3001712e-2,
    -5.4150139e-1,
  ],

  [
    -5.6024906e-7,
    -1.2649169e-6,
     3.4863950e-6,
    -1.5168726e-6,
  ],

  [
    -1.4441741e-8,
     1.3470542e-8,
  ],
];

const M = [11, 10, 9, 4, 2];

export function computeDensity(p: number, t: number): number {
  return (
    ALPHA[0] +
    Array.from({ length: 11 })
      .map((_, k) => ALPHA[k + 1] * Math.pow(p - 0.5, k + 1))
      .reduce((s, term) => s + term, 0) +
    Array.from({ length: 6 })
      .map((_, k) => B[k] * Math.pow(t - 20, k + 1))
      .reduce((s, term) => s + term, 0) +
    Array.from({ length: 5 })
      .flatMap((_, i) =>
        Array.from({ length: M[i] }).map(
          (_, k) =>
            C[i][k] * Math.pow(p - 0.5, k + 1) * Math.pow(t - 20, i + 1),
        ),
      )
      .reduce((s, term) => s + term, 0)
  );
}
