<script lang="ts">
  import { table as calculatedTable } from "../../lib/state.svelte";

  const temperatures: number[] = Array.from({ length: 61 }, (_, i) => i - 20);

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
</script>

<svelte:head>
  <title>Table I: ϱ ← p, t</title>
</svelte:head>

<table>
  <thead>
    <tr>
      <td style="font-size: small;">
        <p style="white-space: nowrap">→ t (°C)</p>
        <p style="white-space: nowrap">↓ p (%<sub>mass</sub>)</p>
      </td>
      {#each temperatures as temperature}
        <td
          class={{ "even-column": (temperature + 20) % 10 < 5 }}
          style="text-align: center;"
        >
          <strong>{temperature}</strong>
        </td>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each { length: 101 }, abm}
      <tr
        class={{ "even-row": abm % 10 < 5 }}
        style="text-align: right; font-variant-numeric: lining-nums;"
      >
        <td>
          <strong>{abm}</strong>
        </td>
        {#each temperatures as temperature}
          {#if isFrozen(abm, temperature)}
            <td
              class={{ "even-column": (temperature + 20) % 10 < 5 }}
              title={abm + " %mass, " + temperature + "°C: " + "frozen solid"}
            >
            </td>
          {:else}
            <td
              class={{ "even-column": (temperature + 20) % 10 < 5 }}
              style="text-align: right; font-variant-numeric: lining-nums;"
              title={abm +
                " %mass, " +
                temperature +
                "°C → " +
                calculatedTable.getDensityFromABM(abm, temperature) +
                " g/L"}
            >
              {calculatedTable.getDensityFromABM(abm, temperature).toFixed(2)}
            </td>
          {/if}
        {/each}
      </tr>
    {/each}
  </tbody>
</table>

<style>
  td {
    padding: 5px;
  }
  .even-row {
    background-color: #feea;
  }
  .even-column {
    background-color: #eefa;
  }
</style>
