<script lang="ts">
  import { sumLiquids, type Liquid } from './lib/liquid';
  import LiquidCard from './lib/LiquidCard.svelte';
  
  let liquids : Liquid[] = $state([{}])
  
  let sumOfLiquids : Liquid = $derived(sumLiquids(liquids))
  
  function addLiquid() {
    liquids.push({})
  }
  
  
  window.onbeforeunload = (event) => {
    if (
      liquids.length == 0
      || (
        liquids.length == 1
        && (
          "undefined" === typeof liquids[0].volume
          && "undefined" === typeof liquids[0].mass
          && "undefined" === typeof liquids[0].ABM
          && "undefined" === typeof liquids[0].ABV
          && "undefined" === typeof liquids[0].density
          && "undefined" === typeof liquids[0].LPA
          && "undefined" === typeof liquids[0].KPA
        )
      )) {
      return
    } else {
      event.preventDefault();
      return true;
    }
  }
</script>

<style>
  .container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 10px 0;
  }
</style>

<div class="container">
  {#each liquids as _, i}<LiquidCard bind:liquid={liquids[i]} inert={false}/>{/each}
  <div style="flex-grow: 1; display: flex; justify-content: center;">
    <button onclick={addLiquid}>+</button>
  </div>
  
</div>

<div>
  <LiquidCard liquid={sumOfLiquids} inert={true}/>
</div>