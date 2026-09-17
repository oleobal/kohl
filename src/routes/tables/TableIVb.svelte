<script lang="ts">
  import { table as calculatedTable } from "../../lib/state.svelte";

  const decimals: number[] = Array.from({ length: 10 }, (_, i) => i);
</script>

<svelte:head>
  <title>Table IVb: p ← q</title>
</svelte:head>

<table>
  <thead>
    <tr>
      <td style="font-size: small;"> q&nbsp(%<sub>vol</sub>) </td>
      {#each decimals as decimal}
        <td
          class={{ "even-column": decimal % 2 < 1 }}
          style="text-align: center;"
        >
          <strong>0.{decimal}</strong>
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
        {#each decimals as decimal}
          {#if abv == 100 && decimal > 0}
            <td class={{ "even-column": decimal % 2 < 1 }}></td>
          {:else}
            <td
              class={{ "even-column": decimal % 2 < 1 }}
              style="text-align: right; font-variant-numeric: lining-nums;"
              title={abv +
                decimal / 10 +
                " %vol → " +
                calculatedTable.getABMFromABV(abv + decimal / 10, 20) +
                " %mass"}
            >
              {calculatedTable.getABMFromABV(abv + decimal / 10, 20).toFixed(2)}
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
