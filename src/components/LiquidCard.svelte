<script lang="ts">
  import { isEither, type Either } from "@sweet-monads/either";
  import { normalizeLiquid, normalizeLiquidMakeup } from "../lib/liquid";
  import type {
    Liquid,
    NormalizedLiquid,
    ErrorLiquid,
    LiquidMakeup,
    NormalizedLiquidMakeup,
  } from "../lib/liquid";
  import { localize, localizeCap } from "../lib/content/locales";
  import { liquids, model } from "../lib/state.svelte";
  import {
    doubleChevronDownIcon,
    doubleChevronUpIcon,
    trashIcon,
  } from "../lib/content/icons";

  let {
    id,
    liquid = $bindable(),
    computed = undefined,
  }: {
    id: string;
    liquid: Liquid;
    computed: Either<ErrorLiquid, NormalizedLiquid> | undefined;
  } = $props();
  let normalizedLiquid = $derived(normalizeLiquid(computed || liquid));
  let normalizedLiquidMakeup = $derived(
    normalizeLiquidMakeup((computed || liquid) as LiquidMakeup),
  );

  let isResult = $derived(id === "result");
  let hasComputed = $derived.by(() => {
    if (isEither(computed)) {
      return computed.isRight();
    }
    return false;
  });
  let errorMessage: string | false = $derived(
    (isEither(computed) &&
      computed.isLeft() &&
      computed.value.cause !== "uninitialized" &&
      computed.value.cause) ||
      (normalizedLiquid.isLeft() &&
        normalizedLiquid.value.cause !== "uninitialized" &&
        normalizedLiquid.value.cause) ||
      (normalizedLiquidMakeup.isLeft() &&
        normalizedLiquidMakeup.value.cause !== "uninitialized" &&
        normalizedLiquidMakeup.value.cause),
  );

  let proMode = $state(false);
  let tempIs20C = $derived(
    liquid.temp === undefined || liquid.temp === null || liquid.temp === 20,
  );

  function deleteSelf() {
    if (confirm(localizeCap("deleteQuestion"))) {
      liquids.ids.splice(liquids.ids.indexOf(id), 1);
    }
  }

  function getNbOfDisplayDigits(keyName: string): number {
    switch (keyName) {
      case "temp":
        return 0;
      case "dens":
      case "mdens":
        return 2;
      default:
        return 3;
    }
  }

  function getLocalizationKey(name: string): string {
    if (
      name == "dens" ||
      name == "abm" ||
      name == "mass" ||
      name == "lpa" ||
      name == "kpa"
    )
      return name;
    if (name[0] == "m") {
      return name.slice(1) + (tempIs20C ? "" : "_meas");
    } else {
      return name + (tempIs20C ? "" : "_20C");
    }
  }

  function valueOrError(keyName: string): string {
    if (normalizedLiquid.isRight()) {
      const l = normalizedLiquid.value;
      if (typeof l[keyName as keyof NormalizedLiquid] === "number") {
        return (l[keyName as keyof NormalizedLiquid] as number).toFixed(
          getNbOfDisplayDigits(keyName),
        );
      }
    } else if (normalizedLiquidMakeup.isRight()) {
      const l = normalizedLiquidMakeup.value;
      if (typeof l[keyName as keyof NormalizedLiquidMakeup] === "number") {
        return (l[keyName as keyof NormalizedLiquidMakeup] as number).toFixed(
          getNbOfDisplayDigits(keyName),
        );
      }
    } else {
      const e = normalizedLiquid.value;
      if (e[keyName as keyof ErrorLiquid]) {
        return e[keyName as keyof ErrorLiquid];
      }
    }
    if (keyName == "temp") {
      return String(model.table.tempRange.reference);
    } else {
      return "—";
    }
  }
</script>

{#snippet leftInput(name: keyof Liquid)}
  <label
    class="value-label"
    for="in-{name}-{id}"
    title={localize(`${getLocalizationKey(name)}_long`)}
    >{@html localize(`${getLocalizationKey(name)}_short`)}</label
  >
  <input
    class="value"
    id="in-{name}-{id}"
    type="number"
    bind:value={liquid[name]}
    placeholder={valueOrError(name)}
  />
{/snippet}
{#snippet rightInput(name: keyof Liquid)}
  <input
    class="value"
    id="in-{name}-{id}"
    type="number"
    bind:value={liquid[name]}
    placeholder={valueOrError(name)}
  />
  <label
    class="value-label"
    for="in-{name}-{id}"
    title={localize(`${getLocalizationKey(name)}_long`)}
    >{@html localize(`${getLocalizationKey(name)}_short`)}</label
  >
{/snippet}

<div class="container">
  <div class="top-bar">
    {#if !isResult}
      <div style="display: flex;">
        <label
          class="value-label"
          for="in-temp-{id}"
          title={localize("temp_long")}>{localize("temp_short")}</label
        >

        <div style="width: 10px;"></div>
        <input
          style="width: 50px;"
          class="value"
          id="in-temp-{id}"
          type="number"
          bind:value={liquid.temp}
          placeholder={valueOrError("temp")}
        />
      </div>
      <div style="width: 40px;"></div>
      <button
        id="btn-close-{id}"
        class="btn-close round-btn"
        title={localize("delete")}
        onclick={deleteSelf}>{@html trashIcon}</button
      >
    {:else}
      <span style="color: var(--l-green);">20°C</span>
      <span style="flex: 2"></span>
      <span style="font-weight: bold; color: var(--l-green);"
        >{localizeCap("result")}</span
      >
      <span style="color: transparent; user-select: none;">20°C</span>
      <!-- easy centering-->
    {/if}
    <div style="flex: 2"></div>
  </div>
  <div
    class={{
      inside: true,
      "inside-result": isResult,
      "inside-error": errorMessage,
      "inside-computed": hasComputed,
    }}
  >
    <div class="left">
      <div class="quantity">
        {@render leftInput("mvol")}
        {#if !tempIs20C}
          {@render leftInput("vol")}
        {/if}
        {@render leftInput("mass")}
      </div>
      {#if errorMessage}
        <div class="error-message">{errorMessage}</div>
      {/if}
    </div>
    <div class="right">
      <div class="makeup">
        {@render rightInput("mabv")}
        {#if !tempIs20C}
          {@render rightInput("abv")}
        {/if}
        {@render rightInput("lpa")}
        {#if proMode}
          <!-- {@render rightInput("mdens")} -->
          <!-- I don't think it's interesting to anyone using the site honestly, let's just display the true density at all times -->
          {@render rightInput("dens")}
          {@render rightInput("mabm")}
          {#if !tempIs20C}
            {@render rightInput("abm")}
          {/if}
          {@render rightInput("kpa")}
        {/if}
      </div>
    </div>
  </div>
  <div class="bottom-bar">
    <button
      id="btn-pro-{id}"
      class={["btn-pro", "round-btn", isResult && "btn-pro-result"]}
      title={localize(proMode ? "fold" : "unfold")}
      onclick={() => {
        proMode = !proMode;
      }}>{@html proMode ? doubleChevronUpIcon : doubleChevronDownIcon}</button
    >
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
  }
  .top-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    padding-bottom: 3px;
    margin-top: 5px;
  }

  .bottom-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    padding-top: 3px;
    margin-bottom: 5px;
  }

  .btn-close {
    height: 24px;
    position: absolute;
    bottom: -12px;
    right: 0;
  }
  .btn-close:hover {
    color: red;
    border-color: red;
  }
  .btn-close:active {
    background-color: #ffe;
    box-shadow: 0 0 10px red;
  }
  .btn-pro {
    height: 24px;
    position: absolute;
    top: -12px;
    right: 0;
  }
  .btn-pro-result {
    color: var(--l-green);
    border-color: var(--l-green);
  }
  .inside {
    display: flex;
    gap: 20px;
    border: 1px solid black;
    padding: 5px 10px;
    justify-content: space-between;
    margin: 0 12px;
  }
  ::placeholder {
    color: var(--l-blue);
    opacity: 1;
  }

  .inside-computed ::placeholder {
    color: var(--l-purple);
  }

  .inside-result ::placeholder {
    color: var(--l-green);
  }

  .inside-error ::placeholder {
    color: var(--l-orange);
  }

  .inside-computed {
    border-color: var(--l-purple);
  }
  .inside-result {
    border-color: var(--l-green);
    color: var(--l-green);
  }
  .inside-error {
    border-color: var(--l-orange);
  }

  .left,
  .right {
    flex-grow: 1;
    flex-basis: 0;
  }
  .quantity,
  .makeup {
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
