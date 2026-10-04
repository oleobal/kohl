<script lang="ts">
  import { model } from "../../lib/state.svelte";
  import { isFrozenABM } from "../../lib/physics/ec/practical";
  import Table from "../Table.svelte";
  import { getArray } from "../../lib/util";

  const abms = getArray(0, 103, 0.1);
  const temperatures: number[] = getArray(
    model.table.tempRange.min,
    model.table.tempRange.max,
    0.5,
  );

  function computeCell(temperature: number, mabm: number) {
    const trueABM = model.table.getCorrectedABM(
      Number(mabm),
      Number(temperature),
    );
    if (isFrozenABM(trueABM, temperature)) {
      return {
        title: `${mabm}%mass, ${temperature}°C → frozen solid`,
        result: null,
      };
    } else if (trueABM < 0 || trueABM > 100) {
      return {
        title: null,
        result: null,
      };
    }
    return {
      title: `${mabm}%mass, ${temperature}°C → ${trueABM}%mass`,
      result: trueABM.toFixed(2),
    };
  }
</script>

<svelte:head>
  <title>Table VIIIa: p ← p_meas, t</title>
</svelte:head>

<Table
  label={"→ t (°C)<br>↓ p<sub>meas.</sub> (%<sub>mass</sub>)"}
  inputs={{
    x: temperatures.map((it) => it.toFixed(1)),
    y: abms.map((it) => it.toFixed(1)),
  }}
  zebraStep={{ x: 10, y: 10 }}
  f={computeCell}
/>
