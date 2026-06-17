<script lang="ts">
  import { normalizeLiquid } from "./liquid";
  import type { Liquid, NormalizedLiquid } from "./liquid";
  let { liquid = $bindable(), inert = false } : { liquid : Liquid, inert : boolean } = $props()
  let normalizedLiquid = $derived(normalizeLiquid(liquid))
  
  function valueOrError(keyName: string) : string {
    if (normalizedLiquid && typeof normalizedLiquid[keyName as keyof NormalizedLiquid] === "number") { return (normalizedLiquid[keyName as keyof NormalizedLiquid] as number).toFixed(keyName == "density" ? 5 : 3) }
    else if (normalizedLiquid.error && normalizedLiquid.error[keyName as keyof NormalizedLiquid["error"]]) { return normalizedLiquid?.error[keyName as keyof NormalizedLiquid["error"]] }
    return "—"
  }
</script>

<style>
  .field {
    display: flex;
    justify-content: space-between;
    gap: 5px;
  }
  .container {
    display: flex;
    gap: 5px;
    border: 1px solid black;
    padding: 5px;
    justify-content: space-between;
    
  }
  .container-inert {
    border: 1px solid green;
    color: green;
  }
  
  ::placeholder {
    color: blue;
    opacity: 1; /* Firefox */
  }
</style>

<div class={{"container": true, "container-inert": inert}} >
  <div class="quantity" style="display: flex; flex-direction: column;">
    <div class="field">
      vol
      
      {#if inert}
        {normalizedLiquid?.volume?normalizedLiquid.volume.toFixed(3):"—"}
      {:else}
        <input type="number" bind:value={liquid.volume} placeholder={valueOrError("volume")}/>
      {/if}
    </div>
    <div class="field">
      mass
      
      {#if inert}
        {normalizedLiquid?.mass?normalizedLiquid.mass.toFixed(3):"—"}
      {:else}
        <input type="number" bind:value={liquid.mass} placeholder={valueOrError("mass")}/>
      {/if}
    </div>
    
  </div>
  <div class="makeup" style="display: flex; flex-direction: column;">
    <div class="field">
      {#if inert}
        {normalizedLiquid?.ABV?normalizedLiquid.ABV.toFixed(3):"—"}
      {:else}
        <input type="number" bind:value={liquid.ABV} placeholder={valueOrError("ABV")}/>
      {/if}
      
      <span title="alcohol by volume (%)">ABV</span>
    </div>
    <div class="field">
      {#if inert}
        {normalizedLiquid?.LPA?normalizedLiquid.LPA.toFixed(3):"—"}
      {:else}
        <input type="number" bind:value={liquid.LPA} placeholder={valueOrError("LPA")}/>
      {/if}
      <span title="liters of pure alcohol">LPA</span>
    </div>
    <div class="field">
      {#if inert}
        {normalizedLiquid?.density?normalizedLiquid.density.toFixed(3):"—"}
      {:else}
        <input type="number" bind:value={liquid.density} placeholder={valueOrError("density")}/>
      {/if}
      
      <span title="density (kg/L)">dens</span>
    </div>
    <div class="field">
      {#if inert}
        {normalizedLiquid?.ABM?normalizedLiquid.ABM.toFixed(3):"—"}
      {:else}
        <input type="number" bind:value={liquid.ABM} placeholder={valueOrError("ABM")}/>
      {/if}
      
      <span title="alcohol by mass (%)">ABM</span>
    </div>
    <div class="field">
      {#if inert}
        {normalizedLiquid?.KPA?normalizedLiquid.KPA.toFixed(3):"—"}
      {:else}
        <input type="number" bind:value={liquid.KPA} placeholder={valueOrError("KPA")}/>
      {/if}
      
      <span title="kilograms of pure alcohol">KPA</span>
    </div>
  </div>
</div>