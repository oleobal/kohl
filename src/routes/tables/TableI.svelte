<script lang="ts">
  import Table from "../../components/Table.svelte";
  import { table as calculatedTable } from "../../lib/state.svelte";

  const temperatures: number[] = Array.from({ length: 61 }, (_, i) => i - 20);
  const abms: number[] = Array.from({ length: 101 }, (_, i) => i);

  function isFrozen(abm: number, temperature: number) {
    return (
      (temperature <= -20 && abm < 30) ||
      (temperature <= -19 && abm < 29) ||
      (temperature <= -18 && abm < 28) ||
      (temperature <= -17 && abm < 27) ||
      (temperature <= -16 && abm < 26) ||
      (temperature <= -15 && abm < 25) ||
      (temperature <= -14 && abm < 24) ||
      (temperature <= -13 && abm < 23) ||
      (temperature <= -12 && abm < 22) ||
      (temperature <= -11 && abm < 21) ||
      (temperature <= -10 && abm < 19) ||
      (temperature <= -9 && abm < 18) ||
      (temperature <= -8 && abm < 17) ||
      (temperature <= -7 && abm < 15) ||
      (temperature <= -6 && abm < 13) ||
      (temperature <= -5 && abm < 12) ||
      (temperature <= -4 && abm < 10) ||
      (temperature <= -3 && abm < 7) ||
      (temperature <= -2 && abm < 5) ||
      (temperature <= -1 && abm < 3)
    );
  }

  function computeCell(t: number, p: number) {
    if (isFrozen(p, t)) {
      return {
        title: `${p}%mass, ${t}°C → frozen solid`,
        result: null,
      };
    }
    let r = calculatedTable.getDensityFromABM(p, t);
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
