<script lang="ts">
  import Table from "../../components/Table.svelte";
  import { table as calculatedTable } from "../../lib/state.svelte";

  const abms: number[] = Array.from({ length: 101 }, (_, i) => i);
  const decimals: number[] = Array.from({ length: 10 }, (_, i) => i);

  function displayFunc(decimal: number, p: number) {
    const abm = p + Number(decimal);
    if (abm > 100) {
      return {
        title: null,
        result: null,
      };
    }
    let r = calculatedTable.getABVFromABM(abm, 20);
    return {
      title: `${abm}%mass → ${r}%vol`,
      result: r.toFixed(2),
    };
  }
</script>

<svelte:head>
  <title>Table IIIb: q ← p</title>
</svelte:head>

<Table
  label={"p (%<sub>mass</sub>)"}
  inputs={{
    x: decimals.map((i) => `0.${i}`),
    y: abms,
  }}
  zebraStep={{ x: 1, y: 5 }}
  f={displayFunc}
/>
