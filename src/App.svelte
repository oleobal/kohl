<script lang="ts">
  import { onMount } from 'svelte';
  import { sumLiquids, type Liquid } from './lib/liquid';
  import LiquidCard from './lib/LiquidCard.svelte';
  import { StateObject } from './lib/proto/marshall';
  
  let title: string = $state("Compiling Calculator")
  
  let liquids : Liquid[] = $state([{}])
  
  let sumOfLiquids = $derived(sumLiquids(liquids))
  
  function addLiquid() {
    liquids.push({})
  }
  
  
  onMount(() => {
    if (window.location.hash) {
      const loadedState = StateObject.decode(Uint8Array.fromBase64(window.location.hash.substring(1)))
      console.debug("loaded timers", loadedState)
      title = loadedState.title;
      liquids = loadedState.liquids;
      
    }
  })
  $effect(() => {
    if (title != "Compiling Calculator" || Object.keys(liquids[0]).length != 0) {
      let exportObject: StateObject = {
        title: title,
        liquids: $state.snapshot(liquids),
      }
      
      window.location.hash = "#" + StateObject.encode(exportObject).finish().toBase64()
    }
  })
  
  
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
    justify-content: center;
    
  }
  .liquids {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 10px 0;
    max-width: 500px;
    flex-grow: 1;
  }
  
  .title {
    text-align: center;
    padding: 0;
    margin: 0;
  }
</style>


<svelte:head>
   <title>{title}</title>
</svelte:head>


<div class="container">
  
  <div class="liquids">
    <h1 class="title" bind:textContent={title} contenteditable="true">Liquid Calculator</h1>
    {#each liquids as _, i}<LiquidCard bind:liquid={liquids[i]} inertLiquid={undefined}/>{/each}
    <div style="flex-grow: 1; display: flex; justify-content: center;">
      <button onclick={addLiquid} style="width: 40px; height: 40px;">+</button>
    </div>
    <div>
      <LiquidCard liquid={{}} inertLiquid={sumOfLiquids}/>
    </div>
  </div>


</div>