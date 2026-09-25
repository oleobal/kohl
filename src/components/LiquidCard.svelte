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
  import { localize } from "../lib/locales";

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

  function getNbOfDisplayDigits(keyName: string): number {
    switch (keyName) {
      case "density":
        return 5;
      case "temp":
        return 0;
      default:
        return 3;
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
      return "20";
    } else {
      return "—";
    }
  }
</script>

<div class="container">
  {#if !isResult}
    <div class="top-bar">
      <div style="flex: 2"></div>
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
      <button id="btn-close-{id}" class="btn-close">✖</button>
    </div>
  {/if}
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
        <label
          class="value-label"
          for="in-volume-{id}"
          title={localize("vol_long")}>{localize("vol_short")}</label
        >
        <input
          class="value"
          id="in-volume-{id}"
          type="number"
          bind:value={liquid.volume}
          placeholder={valueOrError("volume")}
        />

        <label
          class="value-label"
          for="in-mass-{id}"
          title={localize("mass_long")}>{localize("mass_short")}</label
        >
        <input
          class="value"
          id="in-mass-{id}"
          type="number"
          bind:value={liquid.mass}
          placeholder={valueOrError("mass")}
        />
      </div>
      {#if errorMessage}
        <div class="error-message">{errorMessage}</div>
      {/if}
    </div>
    <div class="right">
      <div class="makeup">
        <input
          class="value"
          id="in-abv-{id}"
          type="number"
          bind:value={liquid.ABV}
          placeholder={valueOrError("ABV")}
        />
        <label
          class="value-label"
          for="in-abv-{id}"
          title={localize("abv_long")}>{localize("abv_short")}</label
        >

        <input
          class="value"
          id="in-lpa-{id}"
          type="number"
          bind:value={liquid.LPA}
          placeholder={valueOrError("LPA")}
        />
        <label
          class="value-label"
          for="in-lpa-{id}"
          title={localize("lpa_long")}>{localize("lpa_short")}</label
        >

        <input
          class="value"
          id="in-density-{id}"
          type="number"
          bind:value={liquid.density}
          placeholder={valueOrError("density")}
        />
        <label
          class="value-label"
          for="in-density-{id}"
          title={localize("dens_long")}>{localize("dens_short")}</label
        >

        <input
          class="value"
          id="in-density-{id}"
          type="number"
          bind:value={liquid.ABM}
          placeholder={valueOrError("ABM")}
        />
        <label
          class="value-label"
          for="in-density-{id}"
          title={localize("abm_long")}>{localize("abm_short")}</label
        >

        <input
          class="value"
          id="in-kpa-{id}"
          type="number"
          bind:value={liquid.KPA}
          placeholder={valueOrError("KPA")}
        />
        <label
          class="value-label"
          for="in-kpa-{id}"
          title={localize("kpa_long")}>{localize("kpa_short")}</label
        >
      </div>
    </div>
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
  .btn-close {
    padding: 0;
    flex: none;
    aspect-ratio: 1;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background-color: white;
    border: 1px solid black;

    height: 50px; /* hack */
    position: absolute;
    top: -10px;
    right: -25px;
  }
  .btn-close:hover {
    color: red;
    border-color: red;
  }
  .btn-close:active {
    background-color: #ffe;
  }
  .inside {
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
