<script lang="ts">
  import { table as calculatedTable } from "../../lib/state.svelte";
  import { isFrozenABV } from "../../lib/oiml/practical";

  const temperatures: number[] = Array.from(
    { length: 60 * 2 + 1 },
    (_, i) => i / 2 - 20,
  );
</script>

<svelte:head>
  <title>Table VIIIb: q ← q_meas, t</title>
</svelte:head>

<table>
  <thead>
    <tr>
      <td style="font-size: small;">
        <p style="white-space: nowrap">→ t (°C)</p>
        <p style="white-space: nowrap">↓ q<sub>meas.</sub> (%<sub>vol</sub>)</p>
      </td>
      {#each temperatures as temperature}
        <td
          class={{ "even-column": (temperature + 20) % 10 < 5 }}
          style="text-align: center;"
        >
          <strong>{temperature.toFixed(1)}</strong>
        </td>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each { length: 1031 }, abvDec}
      {@const abv = abvDec / 10}
      <tr
        class={{ "even-row": abv % 2 < 1 }}
        style="text-align: right; font-variant-numeric: lining-nums;"
      >
        <td>
          <strong>{abv.toFixed(1)}</strong>
        </td>
        {#each temperatures as temperature}
          {@const correctedABV = calculatedTable.getCorrectedABV(
            abv,
            temperature,
          )}
          {#if isFrozenABV(correctedABV, temperature)}
            <td
              class={{ "even-column": (temperature + 20) % 10 < 5 }}
              title={abv + " %vol, " + temperature + "°C → " + "frozen solid"}
            >
            </td>
          {:else if correctedABV < 0 || correctedABV > 100}
            <td
              class={{ "even-column": (temperature + 20) % 10 < 5 }}
              title={abv + " %vol, " + temperature + "°C → " + "impossible"}
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
                correctedABV +
                " %vol"}
            >
              {correctedABV.toFixed(1)}
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
