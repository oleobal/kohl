<script lang="ts">
  import { Line } from "svelte-chartjs";
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    CategoryScale,
  } from "chart.js";
  import Settings from "../components/modals/Settings.svelte";
  import { modals } from "svelte-modals";
  import { wrenchIcon } from "../lib/content/icons";
  import { getArray } from "../lib/util";
  import { model } from "../lib/state.svelte";
  import { MeasuredQuantities, PointQuantities } from "../lib/physics/density";
  import type { MeasuredPoint } from "../lib/physics/density";
  import { localize } from "../lib/content/locales";

  ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    CategoryScale,
  );

  const quantities = PointQuantities.concat(MeasuredQuantities);

  let id = $props.id();
  let from: keyof MeasuredPoint = $state("mabv");
  let to: keyof MeasuredPoint = $state("abv");
  let tempsStr = $state("0,10,20,30");
  let temps = $derived(tempsStr.split(",").map((it) => Number(it)));

  function getScale(quantity: keyof MeasuredPoint) {
    if (quantity == "dens" || quantity == "mdens") {
      return getArray(780, 1005, 1);
    }
    return getArray(0, 100, 1);
  }
  let xScale = $derived(getScale(from));

  let d = $derived(
    temps.map((temp) =>
      getScale(from).map((q) => model.table.get(to, from, q, temp)),
    ),
  );

  let data = $derived({
    labels: xScale,
    datasets: d.map((v, i) => {
      return {
        label: `${temps[i]}C`,
        fill: true,
        backgroundColor: `hsla(${(360 / d.length) * i},50%,50%, 0.2)`,
        borderColor: `hsla(${(360 / d.length) * i},50%,50%, 1)`,
        data: v,
      };
    }),
  });
</script>

<div
  style="display: flex; flex-direction: row; gap: 10px; align-items: center;"
>
  <select bind:value={from}>
    {#each quantities as q}
      <option value={q}>
        {q}
      </option>
    {/each}
  </select>
  <span style="user-select: none;">→</span>
  <select bind:value={to}>
    {#each quantities as q}
      <option value={q}>
        {q}
      </option>
    {/each}
  </select>
  <label for={`in-temp-${id}`} style="font-size: 75%; user-select: none;"
    >{localize("temps") + localize(":")}</label
  >
  <input id={`in-temp-${id}`} bind:value={tempsStr} />
  <span style="font-size: 75%;">
    {localize("model") + localize(":")}
    {model.id}
  </span>
  <button
    class="round-btn"
    style="height: 24px"
    onclick={() => {
      modals.open(Settings, {});
    }}>{@html wrenchIcon}</button
  >
</div>
<Line {data} options={{ responsive: true }} />
