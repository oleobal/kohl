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
  import { getArray } from "../lib/util";
  import { model } from "../lib/state.svelte";
  import { MeasuredQuantities, PointQuantities } from "../lib/physics/density";
  import { KnownModels } from "../lib/physics/models";
  import type { MeasuredPoint } from "../lib/physics/density";
  import { localize } from "../lib/content/locales";
  import { GlassExpansionCoefficient } from "../lib/physics/oiml/practical";
  import { homeIcon } from "../lib/content/icons";

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
  let temps = $derived(
    tempsStr
      .split(",")
      .filter((it) => it != "")
      .map((it) => Number(it)),
  );

  let models = $state([[model.id, "SODA_LIME"]]) as [
    keyof typeof KnownModels,
    keyof typeof GlassExpansionCoefficient,
  ][];

  function getScale(quantity: keyof MeasuredPoint) {
    if (quantity == "dens" || quantity == "mdens") {
      return getArray(780, 1005, 1);
    }
    return getArray(0, 100, 0.5);
  }
  let xScale = $derived(getScale(from));

  let d = $derived(
    models.map(([id, glassAlpha]) => {
      let m = model.load(id, glassAlpha);
      return {
        label: `${id}–${glassAlpha}`,
        values: temps.map((temp) =>
          getScale(from).map((q) => m.get(to, from, q, temp)),
        ),
      };
    }),
  );

  function getHue(dl: number, di: number, vl: number): [number, number] {
    return [(360 / dl) * di, 360 / dl / vl / 4];
  }
  let data = $derived({
    labels: xScale,
    datasets: d.flatMap(({ label, values }, di) => {
      let [colorBase, colorWidth] = getHue(d.length, di, values.length);
      return values.map((v, vi) => {
        let color = colorBase + colorWidth * vi;
        return {
          label: `${label}, ${temps[vi]}C`,
          backgroundColor: `hsla(${color},50%,50%, 0.2)`,
          borderColor: `hsla(${color},50%,50%, 1)`,
          data: v,
        };
      });
    }),
  });
</script>

<div
  style="display: flex; flex-direction: row; gap: 10px; align-items: center;"
>
  <button
    class="round-btn"
    style="height: 24px"
    onclick={() => {
      location.href = "#/";
    }}>{@html homeIcon}</button
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
  <label for={`in-model-${id}`} style="font-size: 75%; user-select: none;"
    >{localize("models") + localize(":")}</label
  >
  <span>
    {#each models as _, i}
      <span
        style={`border-bottom: 3px solid hsl(${getHue(models.length, i, 0)[0]}, 50%, 50%)`}
      >
        <select bind:value={models[i][0]}>
          {#each Object.keys(KnownModels) as mid}
            <option value={mid}>
              {KnownModels[mid as keyof typeof KnownModels].name}
            </option>
          {/each}
        </select>
        <select bind:value={models[i][1]}>
          {#each Object.keys(GlassExpansionCoefficient).filter( (it) => isNaN(Number(it)), ) as g}
            <option value={g}>
              {localize(`glass_${g.toLowerCase()}_name`)}
            </option>
          {/each}
        </select>
      </span>
    {/each}
    <button onclick={() => models.push([model.id, "SODA_LIME"])}> + </button>
  </span>
</div>
<Line {data} options={{ responsive: true, animation: false }} />
