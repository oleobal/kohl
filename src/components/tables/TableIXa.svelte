<script lang="ts">
  import { model } from "../../lib/state.svelte";
  import { isFrozenABM } from "../../lib/physics/ec/practical";
  import Table from "../Table.svelte";

  const temperatures: number[] = Array.from(
    { length: 60 * 2 + 1 },
    (_, i) => i / 2 - 20,
  );
  const STARTING_DENSITY = 770;
  const densities: number[] = Array.from(
    { length: (1000 - STARTING_DENSITY) * 5 },
    (_, i) => i / 5 + STARTING_DENSITY,
  );

  function computeCell(temperature: number, mdens: number) {
    const abm = model.table.getABMFromDensity(
      model.table.getCorrectedDensity(mdens, temperature),
      temperature,
    );
    if (isFrozenABM(abm, temperature)) {
      return {
        title: `${mdens}g/L, ${temperature}°C → frozen solid`,
        result: null,
      };
    } else if (abm < 0 || abm > 100) {
      return {
        title: null,
        result: null,
      };
    }
    return {
      title: `${mdens}g/L, ${temperature}°C → ${abm}%mass`,
      result: abm.toFixed(1),
    };
  }
</script>

<svelte:head>
  <title>Table IXa: p ← ϱ_meas, t</title>
</svelte:head>

<Table
  label={"→ t (°C)<br>↓ ϱ<sub>meas.</sub> (g/L)"}
  inputs={{
    x: temperatures.map((it) => it.toFixed(1)),
    y: densities.map((it) => it.toFixed(1)),
  }}
  zebraStep={{ x: 10, y: 10 }}
  f={computeCell}
/>
