// data from the European Commission's practical alcohol tables

export function isFrozenABV(abv: number, temperature: number) {
  return (
    (temperature <= -20 && abv <= 36) ||
    (temperature <= -19.5 && abv <= 35.3) ||
    (temperature <= -19 && abv <= 34.8) ||
    (temperature <= -18.5 && abv <= 34.1) ||
    (temperature <= -18 && abv <= 33.6) ||
    (temperature <= -17.5 && abv <= 33.1) ||
    (temperature <= -17 && abv <= 32.3) ||
    (temperature <= -16.5 && abv <= 31.8) ||
    (temperature <= -16 && abv <= 31.3) ||
    (temperature <= -15.5 && abv <= 30.5) ||
    (temperature <= -15 && abv <= 29.9) ||
    (temperature <= -14.5 && abv <= 29.4) ||
    (temperature <= -14 && abv <= 28.8) ||
    (temperature <= -13.5 && abv <= 28.0) ||
    (temperature <= -13 && abv <= 27.5) ||
    (temperature <= -12.5 && abv <= 26.7) ||
    (temperature <= -12 && abv <= 26.0) ||
    (temperature <= -11.5 && abv <= 25.3) ||
    (temperature <= -11 && abv <= 24.5) ||
    (temperature <= -10.5 && abv <= 23.8) ||
    (temperature <= -10 && abv <= 23.2) ||
    (temperature <= -9.5 && abv <= 22.3) ||
    (temperature <= -9 && abv <= 21.5) ||
    (temperature <= -8.5 && abv <= 20.6) ||
    (temperature <= -8 && abv <= 19.6) ||
    (temperature <= -7.5 && abv <= 18.8) ||
    (temperature <= -7 && abv <= 17.8) ||
    (temperature <= -6.5 && abv <= 16.9) ||
    (temperature <= -6 && abv <= 15.9) ||
    (temperature <= -5.5 && abv <= 14.8) ||
    (temperature <= -5 && abv <= 13.8) ||
    (temperature <= -4.5 && abv <= 12.5) ||
    (temperature <= -4 && abv <= 11.3) ||
    (temperature <= -3.5 && abv <= 10.0) ||
    (temperature <= -3 && abv <= 8.7) ||
    (temperature <= -2.5 && abv <= 7.2) ||
    (temperature <= -2 && abv <= 5.8) ||
    (temperature <= -1.5 && abv <= 4.3) ||
    (temperature <= -1 && abv <= 2.9) ||
    (temperature <= -0.5 && abv <= 1.3)
  );
}

export function isFrozenABM(abm: number, temperature: number) {
  return (
    (temperature <= -20 && abm <= 29.8) ||
    (temperature <= -19.5 && abm <= 29.2) ||
    (temperature <= -19 && abm <= 28.7) ||
    (temperature <= -18.5 && abm <= 28.1) ||
    (temperature <= -18 && abm <= 27.7) ||
    (temperature <= -17.5 && abm <= 27.3) ||
    (temperature <= -17 && abm <= 26.6) ||
    (temperature <= -16.5 && abm <= 26.1) ||
    (temperature <= -16 && abm <= 25.7) ||
    (temperature <= -15.5 && abm <= 25.0) ||
    (temperature <= -15 && abm <= 24.5) ||
    (temperature <= -14.5 && abm <= 24.1) ||
    (temperature <= -14 && abm <= 23.6) ||
    (temperature <= -13.5 && abm <= 22.9) ||
    (temperature <= -13 && abm <= 22.5) ||
    (temperature <= -12.5 && abm <= 21.8) ||
    (temperature <= -12 && abm <= 21.2) ||
    (temperature <= -11.5 && abm <= 20.6) ||
    (temperature <= -11 && abm <= 20.0) ||
    (temperature <= -10.5 && abm <= 19.4) ||
    (temperature <= -10 && abm <= 18.9) ||
    (temperature <= -9.5 && abm <= 18.1) ||
    (temperature <= -9 && abm <= 17.5) ||
    (temperature <= -8.5 && abm <= 16.7) ||
    (temperature <= -8 && abm <= 15.9) ||
    (temperature <= -7.5 && abm <= 15.2) ||
    (temperature <= -7 && abm <= 14.4) ||
    (temperature <= -6.5 && abm <= 13.7) ||
    (temperature <= -6 && abm <= 12.8) ||
    (temperature <= -5.5 && abm <= 11.9) ||
    (temperature <= -5 && abm <= 11.1) ||
    (temperature <= -4.5 && abm <= 10.0) ||
    (temperature <= -4 && abm <= 9.1) ||
    (temperature <= -3.5 && abm <= 8.0) ||
    (temperature <= -3 && abm <= 7.0) ||
    (temperature <= -2.5 && abm <= 5.8) ||
    (temperature <= -2 && abm <= 4.6) ||
    (temperature <= -1.5 && abm <= 3.4) ||
    (temperature <= -1 && abm <= 2.3) ||
    (temperature <= -0.5 && abm <= 1.0)
  );
}
