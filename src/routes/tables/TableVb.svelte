<script lang="ts">
  import { table as calculatedTable} from "../../lib/state.svelte";
  
  const STARTING_DENSITY=780 // the original document starts at 750 for consistency between pages
  const densities: number[] = Array.from({length: 999-STARTING_DENSITY}, (_, i) => i + STARTING_DENSITY)
  const decimals: number[] = Array.from({length: 10}, (_, i) => i)
</script>

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

<svelte:head>
   <title>Table Vb: q ← ϱ_20°C</title>
</svelte:head>

<table>
<thead>
<tr>
  <td style="font-size: small;">
    ϱ<sub>20°C</sub>
  </td>
  {#each decimals as decimal}
    <td class={{"even-column": ((decimal)%2<1)}} style="text-align: center;">
      <strong>0.{decimal}</strong>
    </td>
  {/each}
</tr>
</thead>
<tbody>
{#each densities as density}
  <tr class={{ "even-row": (density%10<5)}} style="text-align: right; font-variant-numeric: lining-nums;">
  <td>
    <strong>{density}</strong>
  </td>
  {#each decimals as decimal}
    {@const preciseDensity = density + decimal/10}
    {#if preciseDensity < 789.3 || preciseDensity > 998.2}
    <td class={{"even-column": ((decimal)%2<1)}}></td>
    {:else}
    <td
      class={{"even-column": ((decimal)%2<1)}}
      style="text-align: right; font-variant-numeric: lining-nums;"
      title={preciseDensity+ " g/L → " + calculatedTable.getABVFromDensity(preciseDensity, 20)+" %vol"}
    >
      {calculatedTable.getABVFromDensity(preciseDensity, 20).toFixed(2)}
    </td>
    {/if}
  {/each}
  </tr>
{/each}
</tbody>
</table>