import {
  CollectionDirection,
  findNearestElements,
  interpolateTwoPoints,
  linearInterpolate,
} from "../../util";

const densityByABV15C = [
  10000, 9985, 9970, 9956, 9942, 9929, 9916, 9903, 9891, 9878, 9867, 9855, 9844,
  9833, 9822, 9812, 9802, 9792, 9782, 9773, 9763, 9753, 9742, 9732, 9721, 9711,
  9700, 9690, 9679, 9668, 9657, 9645, 9633, 9612, 9608, 9594, 9581, 9567, 9553,
  9538, 9523, 9507, 9491, 9474, 9457, 9440, 9422, 9404, 9386, 9367, 9348, 9329,
  9309, 9289, 9269, 9248, 9227, 9206, 9185, 9163, 9141, 9119, 9096, 9073, 9050,
  9027, 9004, 8980, 8956, 8932, 8907, 8882, 8857, 8831, 8805, 8779, 8753, 8726,
  8699, 8672, 8645, 8617, 8589, 8560, 8531, 8502, 8472, 8442, 8411, 8379, 8346,
  8312, 8278, 8242, 8206, 8168, 8128, 8086, 8042, 8096, 7947,
];

const abvCorrectionTable = [
  [
    { temp: 0, mabv: 0, abv: 0.2 },
    { temp: 0, mabv: 5, abv: 5.4 },
    { temp: 0, mabv: 10, abv: 10.9 },
    { temp: 0, mabv: 15, abv: 17.5 },
    { temp: 0, mabv: 20, abv: 24.2 },
    { temp: 0, mabv: 25, abv: 30.9 },
    { temp: 0, mabv: 30, abv: 36.3 },
    { temp: 0, mabv: 35, abv: 41.1 },
    { temp: 0, mabv: 40, abv: 45.9 },
    { temp: 0, mabv: 45, abv: 50.7 },
    { temp: 0, mabv: 50, abv: 55.4 },
    { temp: 0, mabv: 55, abv: 60.2 },
    { temp: 0, mabv: 60, abv: 65 },
    { temp: 0, mabv: 65, abv: 69.9 },
    { temp: 0, mabv: 70, abv: 74.7 },
    { temp: 0, mabv: 75, abv: 79.5 },
    { temp: 0, mabv: 80, abv: 84.3 },
    { temp: 0, mabv: 85, abv: 88.9 },
    { temp: 0, mabv: 90, abv: 93.6 },
    { temp: 0, mabv: 95, abv: 98 },
    { temp: 0, mabv: 100, abv: 102.4 },
  ],
  [
    { temp: 5, mabv: 0, abv: 0.3 },
    { temp: 5, mabv: 5, abv: 5.5 },
    { temp: 5, mabv: 10, abv: 10.9 },
    { temp: 5, mabv: 15, abv: 16.8 },
    { temp: 5, mabv: 20, abv: 22.7 },
    { temp: 5, mabv: 25, abv: 28.8 },
    { temp: 5, mabv: 30, abv: 34.1 },
    { temp: 5, mabv: 35, abv: 38.1 },
    { temp: 5, mabv: 40, abv: 44 },
    { temp: 5, mabv: 45, abv: 48.8 },
    { temp: 5, mabv: 50, abv: 53.6 },
    { temp: 5, mabv: 55, abv: 58.5 },
    { temp: 5, mabv: 60, abv: 63.4 },
    { temp: 5, mabv: 65, abv: 68.3 },
    { temp: 5, mabv: 70, abv: 73.1 },
    { temp: 5, mabv: 75, abv: 78 },
    { temp: 5, mabv: 80, abv: 82.9 },
    { temp: 5, mabv: 85, abv: 87.7 },
    { temp: 5, mabv: 90, abv: 92.4 },
    { temp: 5, mabv: 95, abv: 97 },
    { temp: 5, mabv: 100, abv: 101.5 },
  ],
  [
    { temp: 10, mabv: 0, abv: 0.4 },
    { temp: 10, mabv: 5, abv: 5.5 },
    { temp: 10, mabv: 10, abv: 10.6 },
    { temp: 10, mabv: 15, abv: 16 },
    { temp: 10, mabv: 20, abv: 21.3 },
    { temp: 10, mabv: 25, abv: 26.8 },
    { temp: 10, mabv: 30, abv: 32 },
    { temp: 10, mabv: 35, abv: 37 },
    { temp: 10, mabv: 40, abv: 42 },
    { temp: 10, mabv: 45, abv: 46.9 },
    { temp: 10, mabv: 50, abv: 51.8 },
    { temp: 10, mabv: 55, abv: 56.8 },
    { temp: 10, mabv: 60, abv: 61.7 },
    { temp: 10, mabv: 65, abv: 67 },
    { temp: 10, mabv: 70, abv: 71.6 },
    { temp: 10, mabv: 75, abv: 76.5 },
    { temp: 10, mabv: 80, abv: 81.5 },
    { temp: 10, mabv: 85, abv: 86.4 },
    { temp: 10, mabv: 90, abv: 91.2 },
    { temp: 10, mabv: 95, abv: 96 },
    { temp: 10, mabv: 100, abv: 100.9 },
  ],
  [
    { temp: 15, mabv: 0, abv: 0 },
    { temp: 15, mabv: 5, abv: 5 },
    { temp: 15, mabv: 10, abv: 10 },
    { temp: 15, mabv: 15, abv: 15 },
    { temp: 15, mabv: 20, abv: 20 },
    { temp: 15, mabv: 25, abv: 25 },
    { temp: 15, mabv: 30, abv: 30 },
    { temp: 15, mabv: 35, abv: 35 },
    { temp: 15, mabv: 40, abv: 40 },
    { temp: 15, mabv: 45, abv: 45 },
    { temp: 15, mabv: 50, abv: 50 },
    { temp: 15, mabv: 55, abv: 55 },
    { temp: 15, mabv: 60, abv: 60 },
    { temp: 15, mabv: 65, abv: 65 },
    { temp: 15, mabv: 70, abv: 70 },
    { temp: 15, mabv: 75, abv: 75 },
    { temp: 15, mabv: 80, abv: 80 },
    { temp: 15, mabv: 85, abv: 85 },
    { temp: 15, mabv: 90, abv: 90 },
    { temp: 15, mabv: 95, abv: 95 },
    { temp: 15, mabv: 100, abv: 100 },
  ],
  [
    { temp: 20, mabv: 0, abv: -0.5 },
    { temp: 20, mabv: 5, abv: 4.4 },
    { temp: 20, mabv: 10, abv: 9.3 },
    { temp: 20, mabv: 15, abv: 14 },
    { temp: 20, mabv: 20, abv: 18.5 },
    { temp: 20, mabv: 25, abv: 23.3 },
    { temp: 20, mabv: 30, abv: 28 },
    { temp: 20, mabv: 35, abv: 32.9 },
    { temp: 20, mabv: 40, abv: 37.9 },
    { temp: 20, mabv: 45, abv: 43.1 },
    { temp: 20, mabv: 50, abv: 48.2 },
    { temp: 20, mabv: 55, abv: 53.2 },
    { temp: 20, mabv: 60, abv: 58.2 },
    { temp: 20, mabv: 65, abv: 63.3 },
    { temp: 20, mabv: 70, abv: 68.4 },
    { temp: 20, mabv: 75, abv: 73.4 },
    { temp: 20, mabv: 80, abv: 78.5 },
    { temp: 20, mabv: 85, abv: 83.6 },
    { temp: 20, mabv: 90, abv: 88.7 },
    { temp: 20, mabv: 95, abv: 93.9 },
    { temp: 20, mabv: 100, abv: 99.1 },
  ],
  [
    { temp: 25, mabv: 0, abv: -1 },
    { temp: 25, mabv: 5, abv: 3.6 },
    { temp: 25, mabv: 10, abv: 8.3 },
    { temp: 25, mabv: 15, abv: 12.8 },
    { temp: 25, mabv: 20, abv: 17.1 },
    { temp: 25, mabv: 25, abv: 21.6 },
    { temp: 25, mabv: 30, abv: 26.1 },
    { temp: 25, mabv: 35, abv: 30.9 },
    { temp: 25, mabv: 40, abv: 35.9 },
    { temp: 25, mabv: 45, abv: 41.1 },
    { temp: 25, mabv: 50, abv: 46.3 },
    { temp: 25, mabv: 55, abv: 51.4 },
    { temp: 25, mabv: 60, abv: 56.5 },
    { temp: 25, mabv: 65, abv: 61.6 },
    { temp: 25, mabv: 70, abv: 66.7 },
    { temp: 25, mabv: 75, abv: 71.8 },
    { temp: 25, mabv: 80, abv: 77 },
    { temp: 25, mabv: 85, abv: 82.1 },
    { temp: 25, mabv: 90, abv: 87.4 },
    { temp: 25, mabv: 95, abv: 92.7 },
    { temp: 25, mabv: 100, abv: 98.2 },
  ],
  [
    { temp: 30, mabv: 0, abv: -1.8 },
    { temp: 30, mabv: 5, abv: 2.8 },
    { temp: 30, mabv: 10, abv: 7.3 },
    { temp: 30, mabv: 15, abv: 11.5 },
    { temp: 30, mabv: 20, abv: 15.5 },
    { temp: 30, mabv: 25, abv: 19.9 },
    { temp: 30, mabv: 30, abv: 24.2 },
    { temp: 30, mabv: 35, abv: 28.9 },
    { temp: 30, mabv: 40, abv: 33.9 },
    { temp: 30, mabv: 45, abv: 39.1 },
    { temp: 30, mabv: 50, abv: 44.3 },
    { temp: 30, mabv: 55, abv: 49.6 },
    { temp: 30, mabv: 60, abv: 54.7 },
    { temp: 30, mabv: 65, abv: 59.9 },
    { temp: 30, mabv: 70, abv: 65 },
    { temp: 30, mabv: 75, abv: 70.3 },
    { temp: 30, mabv: 80, abv: 75.4 },
    { temp: 30, mabv: 85, abv: 80.6 },
    { temp: 30, mabv: 90, abv: 86 },
    { temp: 30, mabv: 95, abv: 91.5 },
    { temp: 30, mabv: 100, abv: 97.3 },
  ],
];

function correctDensity(measuredDensity: number, temp: number): number {
  return measuredDensity * (1 - 25e-6 * (temp - 15));
}

export function computeTables(): {
  densRange: { min: number; max: number };
  tables: { [key: number]: { abv: number; abm: number; dens: number }[] };
} {
  let densRange = {
    min: 100000,
    max: -1,
  };
  const tables = abvCorrectionTable
    .map((t) => {
      return t.map((p) => {
        let [abvDown, abvUp] = [Math.floor(p.mabv), Math.ceil(p.mabv)];
        if (abvUp >= densityByABV15C.length) {
          [abvDown, abvUp] = [
            densityByABV15C.length - 2,
            densityByABV15C.length - 1,
          ];
        } else if (abvDown <= 0) {
          [abvDown, abvUp] = [0, 1];
        }
        const mdens =
          linearInterpolate(
            abvDown,
            densityByABV15C[abvDown],
            abvUp,
            densityByABV15C[abvUp],
            p.mabv,
          ) * 0.1;
        const dens = correctDensity(mdens, p.temp);
        densRange.max = Math.max(densRange.max, dens);
        densRange.min = Math.min(densRange.min, dens);
        const densityAt15C = interpolateTwoPoints(
          findNearestElements(
            densityByABV15C.map((d, i) => {
              return { dens: d, abv: i };
            }),
            "abv",
            p.abv,
            2,
            CollectionDirection.ASC,
          ).map((e) => e.p),
          "abv",
          p.abv,
          "dens",
        );
        return {
          ...p,
          ...{
            dens: dens,
            mdens: mdens,
            abm: (p.abv * densityByABV15C[100]) / densityAt15C,
          },
        };
      });
    })
    .reduce((o: { [key: number]: any }, t) => {
      o[t[0].temp] = t;
      return o;
    }, {});

  return { densRange: densRange, tables: tables };
}
