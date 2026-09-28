export const choices = ["en", "fr"];
import { appSettings } from "../state.svelte";
import { capitalize } from "../util";
import { pages } from "../machine-made/locales/pages";
import { strings } from "../machine-made/locales/strings";

/**
 * ISO 639 two-letter code
 */
export const knownLanguages = ["en", "fr"];

export function localizePage(
  key: string,
  locale: string | null = null,
): string {
  return pages[key][(locale || appSettings?.locale || "en") as string];
}

export function localize(key: string, locale: string | null = null): string {
  return strings[key][(locale || appSettings?.locale || "en") as string];
}

export function localizeCap(key: string, locale: string | null = null): string {
  return capitalize(localize(key, locale));
}
