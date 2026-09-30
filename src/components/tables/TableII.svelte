<script lang="ts">
  import Table from "../Table.svelte";
  import { isFrozenABV } from "../../lib/physics/oiml/practical";
  import { model } from "../../lib/state.svelte";

  const temperatures: number[] = Array.from({ length: 61 }, (_, i) => i - 20);
  const abvs: number[] = Array.from({ length: 101 }, (_, i) => i);

  function computeCell(t: number, q: number) {
    if (isFrozenABV(q, t)) {
      return {
        title: `${q}%vol, ${t}°C → frozen solid`,
        result: null,
      };
    }
    let r = model.table.getDensityFromABV(q, t);
    return {
      title: `${q}%vol, ${t}°C → ${r}`,
      result: r.toFixed(2),
    };
  }
</script>

<svelte:head>
  <title>Table II: ϱ ← q, t</title>
</svelte:head>

<Table
  label={"→ t (°C)<br>↓ q (%<sub>vol</sub>)"}
  inputs={{ x: temperatures, y: abvs }}
  zebraStep={{ x: 5, y: 5 }}
  f={computeCell}
/>
