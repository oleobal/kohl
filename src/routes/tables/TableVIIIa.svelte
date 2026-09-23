<script lang="ts">
  import { table as calculatedTable } from "../../lib/state.svelte";
  import { isFrozenABM } from "../../lib/oiml/practical";

  const temperatures: number[] = Array.from(
    { length: 60 * 2 + 1 },
    (_, i) => i / 2 - 20,
  );
</script>

<svelte:head>
  <title>Table VIIIa: p ← p_meas, t</title>
</svelte:head>

<table>
  <thead>
    <tr>
      <td style="font-size: small;">
        <p style="white-space: nowrap">→ t (°C)</p>
        <p style="white-space: nowrap">↓ p<sub>meas.</sub> (%<sub>vol</sub>)</p>
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
    {#each { length: 1031 }, abmDec}
      <!-- values above 100% have no real basis since the reference table I am using does not include them -->
      {@const abm = abmDec / 10}
      <tr
        class={{ "even-row": abm % 2 < 1 }}
        style="text-align: right; font-variant-numeric: lining-nums;"
      >
        <td>
          <strong>{abm.toFixed(1)}</strong>
        </td>
        {#each temperatures as temperature}
          {@const correctedABM = calculatedTable.getCorrectedABM(
            abm,
            temperature,
          )}
          {#if isFrozenABM(correctedABM, temperature)}
            <td
              class={{ "even-column": (temperature + 20) % 10 < 5 }}
              title={abm + " %mass, " + temperature + "°C → " + "frozen solid"}
            >
            </td>
          {:else if correctedABM < 0 || correctedABM > 100}
            <td
              class={{ "even-column": (temperature + 20) % 10 < 5 }}
              title={abm + " %mass, " + temperature + "°C → " + "impossible"}
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
                correctedABM +
                " %mass"}
            >
              {correctedABM.toFixed(1)}
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
