<script lang="ts">
  import Table from "../../components/Table.svelte";
  import { table as calculatedTable } from "../../lib/state.svelte";

  const abvs: number[] = Array.from({ length: 101 }, (_, i) => i);
  const decimals: number[] = Array.from({ length: 10 }, (_, i) => i);

  function computeCell(decimal: number, p: number) {
    const abv = p + Number(decimal);
    if (abv > 100) {
      return {
        title: null,
        result: null,
      };
    }
    let r = calculatedTable.getDensityFromABV(abv, 20);
    return {
      title: `${abv}%vol → ${r} g/L`,
      result: r.toFixed(2),
    };
  }
</script>

<svelte:head>
  <title>Table IVa: ϱ_20°C ← q</title>
</svelte:head>

<Table
  label={"q (%<sub>vol</sub>)"}
  inputs={{
    x: decimals.map((i) => `0.${i}`),
    y: abvs,
  }}
  zebraStep={{ x: 1, y: 5 }}
  f={computeCell}
/>
