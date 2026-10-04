<script lang="ts">
  import Table from "../Table.svelte";
  import { model } from "../../lib/state.svelte";
  import { getArray } from "../../lib/util";

  const densities = getArray(780, 999, 1);
  const decimals: number[] = Array.from({ length: 10 }, (_, i) => i);

  function computeCell(decimal: number, integer: number) {
    const density = integer + Number(decimal);
    if (density < 789.3 || density > 998.2) {
      return {
        title: null,
        result: null,
      };
    }
    let r = model.table.getABVFromDensity(density, 20);
    return {
      title: `${density} g/L → ${r}%vol`,
      result: r.toFixed(2),
    };
  }
</script>

<svelte:head>
  <title>Table Vb: q ← ϱ_20°C</title>
</svelte:head>

<Table
  label={"ϱ<sub>20°C</sub> (g/L)"}
  inputs={{
    x: decimals.map((i) => `0.${i}`),
    y: densities,
  }}
  zebraStep={{ x: 1, y: 5 }}
  f={computeCell}
/>
