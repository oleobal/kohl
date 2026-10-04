<script lang="ts">
  import { model } from "../../lib/state.svelte";
  import { isFrozenABV } from "../../lib/physics/ec/practical";
  import Table from "../Table.svelte";
  import { getArray } from "../../lib/util";

  const abvs = getArray(0, 103, 0.1);
  const temperatures: number[] = getArray(
    model.table.tempRange.min,
    model.table.tempRange.max,
    0.5,
  );

  function computeCell(temperature: number, mabv: number) {
    const trueABV = model.table.getCorrectedABV(
      Number(mabv),
      Number(temperature),
    );
    if (isFrozenABV(trueABV, temperature)) {
      return {
        title: `${mabv}%vol, ${temperature}°C → frozen solid`,
        result: null,
      };
    } else if (trueABV < 0 || trueABV > 100) {
      return {
        title: null,
        result: null,
      };
    }
    return {
      title: `${mabv}%vol, ${temperature}°C → ${trueABV}%vol`,
      result: trueABV.toFixed(2),
    };
  }
</script>

<svelte:head>
  <title>Table VIIIb: q ← q_meas, t</title>
</svelte:head>

<Table
  label={"→ t (°C)<br>↓ q<sub>meas.</sub> (%<sub>mass</sub>)"}
  inputs={{
    x: temperatures.map((it) => it.toFixed(1)),
    y: abvs.map((it) => it.toFixed(1)),
  }}
  zebraStep={{ x: 10, y: 10 }}
  f={computeCell}
/>
