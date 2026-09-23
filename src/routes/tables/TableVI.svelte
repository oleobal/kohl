<script lang="ts">
  import { table as calculatedTable } from "../../lib/state.svelte";

  const temperatures: number[] = Array.from({ length: 61 }, (_, i) => i - 20);

  const STARTING_DENSITY = 780;
  const densities: number[] = Array.from(
    { length: 1000 - STARTING_DENSITY },
    (_, i) => i + STARTING_DENSITY,
  );
</script>

<svelte:head>
  <title>Table VI: p ← ϱ, t</title>
</svelte:head>

<table>
  <thead>
    <tr>
      <td style="font-size: small;">
        <p style="white-space: nowrap">→ t (°C)</p>
        <p style="white-space: nowrap">↓ ϱ (g/L)</p>
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
    {#each densities as density}
      <tr
        class={{ "even-row": density % 10 < 5 }}
        style="text-align: right; font-variant-numeric: lining-nums;"
      >
        <td>
          <strong>{density}</strong>
        </td>
        {#each temperatures as temperature}
          {@const ABM = calculatedTable.getABMFromDensity(density, temperature)}
          {#if ABM < 0 || ABM > 100}
            <td
              class={{ "even-column": (temperature + 20) % 10 < 5 }}
              title={density + " g/L, " + temperature + "°C: " + "undefined"}
            >
            </td>
          {:else}
            <td
              class={{ "even-column": (temperature + 20) % 10 < 5 }}
              style="text-align: right; font-variant-numeric: lining-nums;"
              title={density +
                " g/L, " +
                temperature +
                "°C → " +
                ABM +
                " %mass"}
            >
              {ABM.toFixed(2)}
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
