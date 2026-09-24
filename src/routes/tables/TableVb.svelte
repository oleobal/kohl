<script lang="ts">
  import Table from "../../components/Table.svelte";
  import { table as calculatedTable } from "../../lib/state.svelte";

  const STARTING_DENSITY = 780; // the original document starts at 750 for consistency between pages
  const densities: number[] = Array.from(
    { length: 999 - STARTING_DENSITY },
    (_, i) => i + STARTING_DENSITY,
  );
  const decimals: number[] = Array.from({ length: 10 }, (_, i) => i);

  function computeCell(decimal: number, integer: number) {
    const density = integer + Number(decimal);
    if (density < 789.3 || density > 998.2) {
      return {
        title: null,
        result: null,
      };
    }
    let r = calculatedTable.getABVFromDensity(density, 20);
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
