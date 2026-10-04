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
    const ABV = model.table.getABMFromDensity(density, temperature);
    if (ABV < 0 || ABV > 100) {
      return {
        title: null,
        result: null,
      };
    }
    return {
      title: `${density}g/L, ${temperature}°C → ${ABV}%vol`,
      result: ABV.toFixed(2),
    };
  }
</script>

<svelte:head>
  <title>Table VII: q ← ϱ, t</title>
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
