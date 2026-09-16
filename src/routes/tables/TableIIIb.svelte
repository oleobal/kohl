<script lang="ts">
  import { table as calculatedTable} from "../../lib/state.svelte";
  
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
   <title>Table IIIb: q ← p</title>
</svelte:head>

<table>
<thead>
<tr>
  <td style="font-size: small;">
    p
  </td>
  {#each decimals as decimal}
    <td class={{"even-column": ((decimal)%2<1)}} style="text-align: center;">
      <strong>0.{decimal}</strong>
    </td>
  {/each}
</tr>
</thead>
<tbody>
{#each {length: 101}, abm}
  <tr class={{ "even-row": (abm%10<5)}} style="text-align: right; font-variant-numeric: lining-nums;">
  <td>
    <strong>{abm}</strong>
  </td>
  {#each decimals as decimal}
      {#if abm == 100 && decimal > 0}
      <td class={{"even-column": ((decimal)%2<1)}}></td>
      {:else}
      <td
        class={{"even-column": ((decimal)%2<1)}}
        style="text-align: right; font-variant-numeric: lining-nums;"
        title={abm+decimal/10+ " %mas → " + calculatedTable.getABVFromABM(abm+decimal/10, 20)+" %vol"}
      >
        {calculatedTable.getABVFromABM(abm+decimal/10, 20).toFixed(2)}
      </td>
      {/if}

  {/each}
  </tr>
{/each}
</tbody>
</table>