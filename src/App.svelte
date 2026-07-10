<script lang="ts">
  import { onMount } from 'svelte';
  import { normalizeLiquid, normalizeLiquidMakeup, solveWithFinalQuantity, solveWithStartingQuantity, sumLiquids, type ErrorLiquid, type Liquid, type NormalizedLiquid } from './lib/liquid';
  import LiquidCard from './lib/LiquidCard.svelte';
  import { StateObject } from './lib/proto/marshall';
  import { left, right, type Either } from '@sweet-monads/either';
  
  import {appSettings, liquids} from "./lib/state.svelte"
  import { countNonNullKeys, removeNullValues } from './lib/util';
  import { choices as localeChoices, localize } from './lib/locales';
  
  let title: string = $state(localize("compiling_calculator", true))
  
  let forcedResult: Liquid = $state({})
  
  let computed: {[key: string]: Either<ErrorLiquid, NormalizedLiquid>} = $derived.by(() => {
    if (countNonNullKeys(forcedResult) != 0) {
      let completeLiquids: Liquid[] = []
      let liquidMakeups: {[key: string]: Liquid} = {}
      let underdefinedLiquids: Liquid[] = []
      Object.entries(liquids.data).forEach(([id, l]) => {
        if (normalizeLiquid(l).isRight()) {
          completeLiquids.push(l)
        } else if (normalizeLiquidMakeup(l).isRight()) {
          liquidMakeups[id] = l
        } else {
          underdefinedLiquids.push(l)
        }
      })
      if (underdefinedLiquids.length > 0) {
        return {"result": left({cause: "underdefined parameters"} as ErrorLiquid)}
      } else if (Object.entries(liquidMakeups).length == 1) {
        let base = sumLiquids(completeLiquids)
        if (normalizeLiquid(forcedResult).isRight()) {
          return {"result": left({cause: "overdefined parameters"} as ErrorLiquid)}
        }
        let rect = Object.entries(liquidMakeups)[0]
        let solution = solveWithStartingQuantity(base, rect[1], forcedResult)
        if (solution.isRight()) {
          let r : {[key:string]: any} = {
            "result": right<ErrorLiquid, Liquid>(solution.value.final)
          }
          r[rect[0]] = right<ErrorLiquid, Liquid>(solution.value.rectifier)
          return r;
        } else {
          return {"result": solution.value}
        }
      } else if (Object.entries(liquidMakeups).length == 2 && completeLiquids.length == 0) {
        let base = Object.entries(liquidMakeups)[0]
        let rect = Object.entries(liquidMakeups)[1]
        let solution = solveWithFinalQuantity(base[1], rect[1], forcedResult)
        if (solution.isRight()) {
          let r : {[key:string]: any} = {}
          r[rect[0]] = right<ErrorLiquid, Liquid>(solution.value.rectifier)
          r[base[0]] = right<ErrorLiquid, Liquid>(solution.value.base)
          return r;
        } else {
          return {"result": solution.value}
        }
      } else {
        return {"result": left({cause: "overdefined parameters"} as ErrorLiquid)}
      }
    } else {
      return {"result": sumLiquids(Object.values(liquids.data))}
    }
  })
  
  function addLiquid(l?: any) {
    let elementID=crypto.randomUUID()
    liquids.data[elementID] = l?l:{}
    liquids.ids.push(elementID)
  }
  
  
  onMount(() => {
    if (window.location.hash) {
      const loadedState = StateObject.decode(Uint8Array.fromBase64(window.location.hash.substring(1)))
      console.debug("loaded app state", loadedState)
      title = loadedState.title;
      loadedState.liquids.forEach((l) => {addLiquid(l)})
    } else {
      addLiquid()
    }
    
    if (localeChoices.indexOf(navigator.language) != -1) {
        appSettings.locale = navigator.language;
      }
  })
  $effect(() => {
    if (title != "Compiling Calculator" || Object.keys(liquids).length != 0) {
      let l = $state.snapshot(liquids)
      let exportObject: StateObject = {
        title: title,
        liquids: $state.snapshot(liquids.ids).map((id) => removeNullValues(l.data[id])),
      }
      
      window.location.hash = "#" + StateObject.encode(exportObject).finish().toBase64()
    }
  })
  
  
  window.onbeforeunload = (event) => {
    if (
      liquids.ids.length == 0
      || (
        liquids.ids.length == 1
        && (
          "undefined" === typeof liquids.data[liquids.ids[0]].volume
          && "undefined" === typeof liquids.data[liquids.ids[0]].mass
          && "undefined" === typeof liquids.data[liquids.ids[0]].ABM
          && "undefined" === typeof liquids.data[liquids.ids[0]].ABV
          && "undefined" === typeof liquids.data[liquids.ids[0]].density
          && "undefined" === typeof liquids.data[liquids.ids[0]].LPA
          && "undefined" === typeof liquids.data[liquids.ids[0]].KPA
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
    <h1 class="title" bind:textContent={title} contenteditable="true"></h1>
    {#each liquids.ids as id}<LiquidCard id={id} bind:liquid={liquids.data[id]} computed={computed[id]}/>{/each}
    <div style="flex-grow: 1; display: flex; justify-content: center;">
      <button onclick={() => {addLiquid()}} style="width: 40px; height: 40px;">+</button>
    </div>
    <div>
      <LiquidCard id="result" bind:liquid={forcedResult} computed={computed["result"]}/>
    </div>
  </div>


</div>