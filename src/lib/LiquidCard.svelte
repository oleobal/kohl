<script lang="ts">
  import { isEither, type Either } from "@sweet-monads/either";
  import { normalizeLiquid, normalizeLiquidMakeup } from "./liquid";
  import type { Liquid, NormalizedLiquid, ErrorLiquid, LiquidMakeup, NormalizedLiquidMakeup } from "./liquid";
  
  let { id, liquid = $bindable(), computed = undefined } : {id: string, liquid: Liquid, computed : Either<ErrorLiquid, NormalizedLiquid> | undefined} = $props()
  let normalizedLiquid = $derived(normalizeLiquid(computed||liquid))
  let normalizedLiquidMakeup = $derived(normalizeLiquidMakeup((computed||liquid) as LiquidMakeup))
  
  let isResult = $derived(id === "result")
  let hasComputed = $derived.by(() => {
    if (isEither(computed)) { return computed.isRight() }
    return false
  })
  let errorMessage: string | false = $derived(
    (isEither(computed) && computed.isLeft() && computed.value.cause !== "uninitialized" && computed.value.cause)
    || ((normalizedLiquid.isLeft() && normalizedLiquid.value.cause !== "uninitialized" && normalizedLiquid.value.cause)
    || (normalizedLiquidMakeup.isLeft() && normalizedLiquidMakeup.value.cause !== "uninitialized" && normalizedLiquidMakeup.value.cause))
  )
  
  
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
  ::placeholder {
    color: var(--l-blue);
    opacity: 1;
  }
  
  .container-computed ::placeholder {
    color: var(--l-purple);
  }
  
  .container-result ::placeholder {
    color: var(--l-green);
  }
  
  
  .container-error  ::placeholder {
    color: var(--l-orange);
  }
  
  .container-computed{
    border-color: var(--l-purple);
  }
  .container-result {
    border-color: var(--l-green);
    color: var(--l-green);
  }
  .container-error{
    border-color: var(--l-orange);
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
  
  

  .error-message {
    padding: 10px;
    color: var(--l-orange);
    font-size: 12pt;
    overflow-y: scroll;
  }
</style>

<div class={{
  "container": true,
  "container-result": isResult,
  "container-error": errorMessage,
  "container-computed": hasComputed,
  }} >
  
  <div class="left">
    <div class="quantity">
      <label class="value-label" for="in-volume-{id}">vol</label>
      <input class="value" id="in-volume-{id}" type="number" bind:value={liquid.volume} placeholder={valueOrError("volume")}/>
      
      <label class="value-label" for="in-mass-{id}">mass</label>
      <input class="value" id="in-mass-{id}" type="number" bind:value={liquid.mass} placeholder={valueOrError("mass")}/>
    </div>
    {#if errorMessage}
      <div class="error-message">{errorMessage}</div>
    {/if}
  </div>
  <div class="right">
    <div class="makeup">
      <input class="value" id="in-abv-{id}" type="number" bind:value={liquid.ABV} placeholder={valueOrError("ABV")}/>
      
      <label class="value-label" for="in-abv-{id}" title="alcohol by volume (%)">ABV</label>
      <input class="value" id="in-lpa-{id}" type="number" bind:value={liquid.LPA} placeholder={valueOrError("LPA")}/>
      
      <label class="value-label" for="in-lpa-{id}" title="liters of pure alcohol">LPA</label>
      <input class="value" id="in-density-{id}" type="number" bind:value={liquid.density} placeholder={valueOrError("density")}/>
      
      <label class="value-label" for="in-density-{id}" title="density (kg/L)">dens</label>
      <input class="value" id="in-density-{id}" type="number" bind:value={liquid.ABM} placeholder={valueOrError("ABM")}/>
      
      <label class="value-label" for="in-density-{id}" title="alcohol by mass (%)">ABM</label>
      <input class="value" id="in-kpa-{id}" type="number" bind:value={liquid.KPA} placeholder={valueOrError("KPA")}/>
      
      <label class="value-label" for="in-kpa-{id}" title="kilograms of pure alcohol">KPA</label>
    </div>
  </div>
  
</div>