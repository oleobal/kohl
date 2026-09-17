<script lang="ts">
  import { table as calculatedTable } from "../../lib/state.svelte";

  const temperatures: number[] = Array.from({ length: 61 }, (_, i) => i - 20);

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
</script>

<svelte:head>
  <title>Table II: ϱ ← q, t</title>
</svelte:head>

<table>
  <thead>
    <tr>
      <td style="font-size: small;">
        <p>→ t (°C)</p>
        <p>↓ q (%vol)</p>
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
    {#each { length: 101 }, abv}
      <tr
        class={{ "even-row": abv % 10 < 5 }}
        style="text-align: right; font-variant-numeric: lining-nums;"
      >
        <td>
          <strong>{abv}</strong>
        </td>
        {#each temperatures as temperature}
          {#if isFrozen(abv, temperature)}
            <td
              class={{ "even-column": (temperature + 20) % 10 < 5 }}
              title={abv + "%, " + temperature + "°C: " + "frozen solid"}
            >
            </td>
          {:else}
            <td
              class={{ "even-column": (temperature + 20) % 10 < 5 }}
              style="text-align: right; font-variant-numeric: lining-nums;"
              title={abv +
                " %vol, " +
                temperature +
                "°C → " +
                calculatedTable.getDensityFromABV(abv, temperature) +
                " g/L"}
            >
              {calculatedTable.getDensityFromABV(abv, temperature).toFixed(2)}
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
