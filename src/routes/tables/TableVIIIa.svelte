<script lang="ts">
  import { table as calculatedTable } from "../../lib/state.svelte";
  import { isFrozenABM } from "../../lib/oiml/practical";
  import Table from "../../components/Table.svelte";

  const temperatures: number[] = Array.from(
    { length: 60 * 2 + 1 },
    (_, i) => i / 2 - 20,
  );

  const abms = Array.from({ length: 1031 }, (_, i) => i / 10);

  function computeCell(temperature: number, mabm: number) {
    const trueABM = calculatedTable.getCorrectedABM(
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
