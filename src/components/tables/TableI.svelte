<script lang="ts">
  import Table from "../Table.svelte";
  import { isFrozenABM } from "../../lib/physics/oiml/practical";
  import { model } from "../../lib/state.svelte";

  const temperatures: number[] = Array.from({ length: 61 }, (_, i) => i - 20);
  const abms: number[] = Array.from({ length: 101 }, (_, i) => i);

  function computeCell(t: number, p: number) {
    if (isFrozenABM(p, t)) {
      return {
        title: `${p}%mass, ${t}°C → frozen solid`,
        result: null,
      };
    }
    let r = model.table.getDensityFromABM(p, t);
    return {
      title: `${p}%mass, ${t}°C → ${r}`,
      result: r.toFixed(2),
    };
  }
</script>

<svelte:head>
  <title>Table I: ϱ ← p, t</title>
</svelte:head>

<Table
  label={"→ t (°C)<br>↓ p (%<sub>mass</sub>)"}
  inputs={{ x: temperatures, y: abms }}
  zebraStep={{ x: 5, y: 5 }}
  f={computeCell}
/>
