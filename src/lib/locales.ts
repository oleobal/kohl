export const choices = ["en", "fr"];
import { appSettings } from "./state.svelte";
import { capitalize } from "./util";

export function localize(
  key: string,
  doCapitalize: boolean = false,
  locale: string | null = null,
): string {
  if (!locale) {
    locale = appSettings.locale;
  }
  const str = text[key][String(locale || "en")];
  return doCapitalize ? capitalize(str) : str;
}

export const text: { [key: string]: { [key: string]: string } } = {
  abv_long: {
    en: "alcohol by volume (%)",
    fr: "taux d'alcool volumique (%)",
  },
  abv_short: {
    en: "ABV",
    fr: "TAV",
  },
  abm_long: {
    en: "alcohol by mass (%)",
    fr: "taux d'alcool massique (%)",
  },
  abm_short: {
    en: "ABM",
    fr: "TAM",
  },
  compiling_calculator: {
    en: "compiling calculator",
    fr: "calcul de compilation",
  },
  dens_long: {
    en: "density (kg/L)",
    fr: "densité (kg/L)",
  },
  dens_short: {
    en: "dens",
    fr: "dens",
  },
  kpa_long: {
    en: "kilograms of pure alcohol (kg)",
    fr: "kilogrammes d'alcool pur (kg)",
  },
  kpa_short: {
    en: "KPA",
    fr: "KAP",
  },
  lpa_long: {
    en: "liters of pure alcohol (L)",
    fr: "litres d'alcool pur (L)",
  },
  lpa_short: {
    en: "LPA",
    fr: "LAP",
  },
  mass_long: {
    en: "mass (kg)",
    fr: "masse (kg)",
  },
  mass_short: {
    en: "mass",
    fr: "mass",
  },
  vol_long: {
    en: "volume (L)",
    fr: "volume (L)",
  },
  vol_short: {
    en: "vol",
    fr: "vol",
  },
};
