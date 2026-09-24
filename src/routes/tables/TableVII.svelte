<script lang="ts">
  import Table from "../../components/Table.svelte";
  import { table as calculatedTable } from "../../lib/state.svelte";

  const temperatures: number[] = Array.from({ length: 61 }, (_, i) => i - 20);

  const STARTING_DENSITY = 780;
  const densities: number[] = Array.from(
    { length: 1000 - STARTING_DENSITY },
    (_, i) => i + STARTING_DENSITY,
  );

  function computeCell(temperature: number, density: number) {
    const ABV = calculatedTable.getABMFromDensity(density, temperature);
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
