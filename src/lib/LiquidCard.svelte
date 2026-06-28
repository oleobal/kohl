<script lang="ts">
  import type { Either } from "@sweet-monads/either";
  import { normalizeLiquid, normalizeLiquidMakeup } from "./liquid";
  import type { Liquid, NormalizedLiquid, ErrorLiquid, LiquidMakeup, NormalizedLiquidMakeup } from "./liquid";
  
  let { liquid = $bindable(), inertLiquid = undefined } : { liquid : Liquid, inertLiquid : Either<ErrorLiquid, NormalizedLiquid> | undefined} = $props()
  let normalizedLiquid = $derived(normalizeLiquid(inertLiquid?inertLiquid:liquid))
  let normalizedLiquidMakeup = $derived(normalizeLiquidMakeup((inertLiquid?inertLiquid:liquid) as LiquidMakeup))
  let inert = $derived(inertLiquid?true:false)
  
  let errorMessage: string | false = $derived(!inert && ((normalizedLiquid.isLeft() && normalizedLiquid.value.cause !== "uninitialized" && normalizedLiquid.value.cause) || (normalizedLiquidMakeup.isLeft() && normalizedLiquidMakeup.value.cause !== "uninitialized" && normalizedLiquidMakeup.value.cause)))
  
  let elementID=crypto.randomUUID()
  
  function valueOrError(keyName: string) : string {
    if (normalizedLiquid.isRight()) {
      const l = normalizedLiquid.value;
      if (typeof l[keyName as keyof NormalizedLiquid] === "number") { return (l[keyName as keyof NormalizedLiquid] as number).toFixed(keyName == "density" ? 5 : 3) }
    } else if (normalizedLiquidMakeup.isRight()) {
      const l = normalizedLiquidMakeup.value;
      if (typeof l[keyName as keyof NormalizedLiquidMakeup] === "number") { return (l[keyName as keyof NormalizedLiquidMakeup] as number).toFixed(keyName == "density" ? 5 : 3) }
  } else {
      const e = normalizedLiquid.value;
      if (e[keyName as keyof ErrorLiquid]) {return e[keyName as keyof ErrorLiquid] }
    }
    return "—"
  }
  
</script>

<style>
  .container {
    display: flex;
    gap: 20px;
    border: 1px solid black;
    padding: 5px 10px;
    justify-content: space-between;
  }
  .container-inert {
    border: 1px solid green;
    color: green;
  }
  .container-error{
    border-color: hsl(34, 100%, 40%);
  }
  
  .left, .right {
    flex-grow: 1;
    flex-basis: 0;
  }
  .quantity, .makeup {
    display: grid;
    gap: 2px 10px;
    grid-auto-rows: min-content;
  }
  .quantity {
    grid-template-columns: min-content 1fr;
    justify-items: start;
  }
  .makeup {
    grid-template-columns: 1fr min-content;
    justify-items: end;
  }
  
  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type="number"] {
    appearance: textfield;
    box-sizing: border-box;
    font-family: inherit;
    font-size: inherit;
  }
  
  .value {
    width: 100%;
    height: 100%;
  }
  
  .value-label {
    align-self: center;
  }
  
  
  ::placeholder {
    color: blue;
    opacity: 1;
  }
  
  .container-error  ::placeholder {
    color: hsl(34, 100%, 40%);
  }
  .error-message {
    padding: 10px;
    color: hsl(34, 100%, 40%);
    font-size: 12pt;
    overflow-y: scroll;
  }
</style>

<div class={{
  "container": true,
  "container-inert": inert,
  "container-error": errorMessage
  }} >
  
  <div class="left">
    <div class="quantity">
      <label class="value-label" for="in-volume-{elementID}">vol</label>
      
      {#if inert}
        <span class="value">{normalizedLiquid.fold(() => "—", v => v.volume.toFixed(3))}</span>
      {:else}
        <input class="value" id="in-volume-{elementID}" type="number" bind:value={liquid.volume} placeholder={valueOrError("volume")}/>
      {/if}
      
      
      <label class="value-label" for="in-mass-{elementID}">mass</label>
      
      {#if inert}
        <span class="value">{normalizedLiquid.fold(() => "—", v => v.mass.toFixed(3))}</span>
      {:else}
        <input class="value" id="in-mass-{elementID}" type="number" bind:value={liquid.mass} placeholder={valueOrError("mass")}/>
      {/if}
      
    </div>
    {#if errorMessage}
      <div class="error-message">{errorMessage}</div>
    {/if}
  </div>
  <div class="right">
    <div class="makeup">
      {#if inert}
        <span class="value">{normalizedLiquid.fold(() => "—", v => v.ABV.toFixed(3))}</span>
      {:else}
        <input class="value" id="in-abv-{elementID}" type="number" bind:value={liquid.ABV} placeholder={valueOrError("ABV")}/>
      {/if}
      
      <label class="value-label" for="in-abv-{elementID}" title="alcohol by volume (%)">ABV</label>

      {#if inert}
        <span class="value">{normalizedLiquid.fold(() => "—", v => v.LPA.toFixed(3))}</span>
      {:else}
        <input class="value" id="in-lpa-{elementID}" type="number" bind:value={liquid.LPA} placeholder={valueOrError("LPA")}/>
      {/if}
      <label class="value-label" for="in-lpa-{elementID}" title="liters of pure alcohol">LPA</label>

      {#if inert}
        <span class="value">{normalizedLiquid.fold(() => "—", v => v.density.toFixed(3))}</span>
      {:else}
        <input class="value" id="in-density-{elementID}" type="number" bind:value={liquid.density} placeholder={valueOrError("density")}/>
      {/if}
      
      <label class="value-label" for="in-density-{elementID}" title="density (kg/L)">dens</label>

      {#if inert}
        <span class="value">{normalizedLiquid.fold(() => "—", v => v.ABM.toFixed(3))}</span>
      {:else}
        <input class="value" id="in-density-{elementID}" type="number" bind:value={liquid.ABM} placeholder={valueOrError("ABM")}/>
      {/if}
      
      <label class="value-label" for="in-density-{elementID}" title="alcohol by mass (%)">ABM</label>

      {#if inert}
        <span class="value">{normalizedLiquid.fold(() => "—", v => v.KPA.toFixed(3))}</span>
      {:else}
        <input class="value" id="in-kpa-{elementID}" type="number" bind:value={liquid.KPA} placeholder={valueOrError("KPA")}/>
      {/if}
      
      <label class="value-label" for="in-kpa-{elementID}" title="kilograms of pure alcohol">KPA</label>
    </div>
  </div>
  
</div>