<script lang="ts">
  import { table as calculatedTable } from "../../lib/state.svelte";
  import { isFrozenABV } from "../../lib/oiml/practical";
  import Table from "../../components/Table.svelte";

  const abvs = Array.from({ length: 1031 }, (_, i) => i / 10);
  const temperatures: number[] = Array.from(
    { length: 60 * 2 + 1 },
    (_, i) => i / 2 - 20,
  );

  function computeCell(temperature: number, mabm: number) {
    const trueABV = calculatedTable.getCorrectedABV(
      Number(mabm),
      Number(temperature),
    );
    if (isFrozenABV(trueABV, temperature)) {
      return {
        title: `${mabm}%vol, ${temperature}°C → frozen solid`,
        result: null,
      };
    } else if (trueABV < 0 || trueABV > 100) {
      return {
        title: null,
        result: null,
      };
    }
    return {
      title: `${mabm}%vol, ${temperature}°C → ${trueABV}%vol`,
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
