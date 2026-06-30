import type { Liquid } from "./liquid";

export let appSettings: { [key: string]: any } = $state({
  locale: "en",
});

export let liquids: {
  ids: string[];
  data: { [key: string]: Liquid };
} = $state({
  ids: [],
  data: {},
});
