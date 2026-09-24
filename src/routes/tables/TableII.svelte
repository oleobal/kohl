<script lang="ts">
  import Table from "../../components/Table.svelte";
  import { table as calculatedTable } from "../../lib/state.svelte";

  const temperatures: number[] = Array.from({ length: 61 }, (_, i) => i - 20);
  const abvs: number[] = Array.from({ length: 101 }, (_, i) => i);

  function isFrozen(abv: number, temperature: number) {
    return (
      (temperature <= -20 && abv < 36) ||
      (temperature <= -19 && abv < 35) ||
      (temperature <= -18 && abv < 34) ||
      (temperature <= -17 && abv < 33) ||
      (temperature <= -16 && abv < 32) ||
      (temperature <= -15 && abv < 31) ||
      (temperature <= -14 && abv < 30) ||
      (temperature <= -13 && abv < 28) ||
      (temperature <= -12 && abv < 26) ||
      (temperature <= -11 && abv < 25) ||
      (temperature <= -10 && abv < 23) ||
      (temperature <= -9 && abv < 21) ||
      (temperature <= -8 && abv < 20) ||
      (temperature <= -7 && abv < 18) ||
      (temperature <= -6 && abv < 16) ||
      (temperature <= -5 && abv < 14) ||
      (temperature <= -4 && abv < 12) ||
      (temperature <= -3 && abv < 9) ||
      (temperature <= -2 && abv < 6) ||
      (temperature <= -1 && abv < 3)
    );
  }

  function computeCell(t: number, q: number) {
    if (isFrozen(q, t)) {
      return {
        title: `${q}%vol, ${t}°C → frozen solid`,
        result: null,
      };
    }
    let r = calculatedTable.getDensityFromABV(q, t);
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
