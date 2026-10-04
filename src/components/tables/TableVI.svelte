<script lang="ts">
  import Table from "../Table.svelte";
  import { model } from "../../lib/state.svelte";
  import { getArray } from "../../lib/util";

  const temperatures: number[] = getArray(
    model.table.tempRange.min,
    model.table.tempRange.max,
    1,
  );
  const densities = getArray(780, 999, 1);

  function computeCell(temperature: number, density: number) {
    const ABM = model.table.getABMFromDensity(density, temperature);
    if (ABM < 0 || ABM > 100) {
      return {
        title: null,
        result: null,
      };
    }
    return {
      title: `${density}g/L, ${temperature}°C → ${ABM}%mass`,
      result: ABM.toFixed(2),
    };
  }
</script>

<svelte:head>
  <title>Table VI: p ← ϱ, t</title>
</svelte:head>

<Table
  label={"→ t (°C)<br>↓ ϱ (g/L)"}
  inputs={{
    x: temperatures,
    y: densities,
  }}
  zebraStep={{ x: 5, y: 5 }}
  f={computeCell}
/>
