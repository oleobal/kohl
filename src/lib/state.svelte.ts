import type { Liquid } from "./liquid";

export let liquids: {
  ids: string[];
  data: { [key: string]: Liquid };
} = $state({
  ids: [],
  data: {},
});
