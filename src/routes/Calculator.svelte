<script lang="ts">
  import { onMount } from "svelte";
  import {
    normalizeLiquid,
    normalizeLiquidMakeup,
    solveWithFinalQuantity,
    solveWithStartingQuantity,
    sumLiquids,
    type ErrorLiquid,
    type Liquid,
    type NormalizedLiquid,
  } from "../lib/liquid";
  import LiquidCard from "../components/LiquidCard.svelte";
  import { StateObject } from "../lib/machine-made/protobuf/marshall";
  import { left, right, type Either } from "@sweet-monads/either";

  import { appSettings, liquids } from "../lib/state.svelte";
  import { countNonNullKeys, removeNullValues } from "../lib/util";
  import {
    choices as localeChoices,
    localizeCap,
  } from "../lib/content/locales";
  import { plusIcon, wrenchIcon } from "../lib/content/icons";
  import { modals, Modals } from "svelte-modals";
  import Help from "../components/modals/Help.svelte";
  import Settings from "../components/modals/Settings.svelte";

  let title: string = $state(localizeCap("compiling_calculator"));
  let originalTitle = [appSettings.locale, localizeCap("compiling_calculator")];
  $effect(() => {
    if (originalTitle[0] != appSettings.locale && originalTitle[1] == title) {
      title = localizeCap("compiling_calculator");
      originalTitle = [appSettings.locale, localizeCap("compiling_calculator")];
    }
  });

  let forcedResult: Liquid = $state({});

  let computed: { [key: string]: Either<ErrorLiquid, NormalizedLiquid> } =
    $derived.by(() => {
      if (countNonNullKeys(forcedResult) != 0) {
        let completeLiquids: Liquid[] = [];
        let liquidMakeups: { [key: string]: Liquid } = {};
        let underdefinedLiquids: Liquid[] = [];
        Object.entries(liquids.data).forEach(([id, l]) => {
          if (normalizeLiquid(l).isRight()) {
            completeLiquids.push(l);
          } else if (normalizeLiquidMakeup(l).isRight()) {
            liquidMakeups[id] = l;
          } else {
            underdefinedLiquids.push(l);
          }
        });
        if (underdefinedLiquids.length > 0) {
          return {
            result: left({ cause: "underdefined parameters" } as ErrorLiquid),
          };
        } else if (Object.entries(liquidMakeups).length == 1) {
          let base = sumLiquids(completeLiquids);
          if (normalizeLiquid(forcedResult).isRight()) {
            return {
              result: left({ cause: "overdefined parameters" } as ErrorLiquid),
            };
          }
          let rect = Object.entries(liquidMakeups)[0];
          let solution = solveWithStartingQuantity(base, rect[1], forcedResult);
          if (solution.isRight()) {
            let r: { [key: string]: any } = {
              result: right<ErrorLiquid, Liquid>(solution.value.final),
            };
            r[rect[0]] = right<ErrorLiquid, Liquid>(solution.value.rectifier);
            return r;
          } else {
            return { result: solution };
          }
        } else if (
          Object.entries(liquidMakeups).length == 2 &&
          completeLiquids.length == 0
        ) {
          let base = Object.entries(liquidMakeups)[0];
          let rect = Object.entries(liquidMakeups)[1];
          let solution = solveWithFinalQuantity(base[1], rect[1], forcedResult);
          if (solution.isRight()) {
            let r: { [key: string]: any } = {};
            r[rect[0]] = right<ErrorLiquid, Liquid>(solution.value.rectifier);
            r[base[0]] = right<ErrorLiquid, Liquid>(solution.value.base);
            return r;
          } else {
            return { result: solution.value };
          }
        } else {
          return {
            result: left({ cause: "overdefined parameters" } as ErrorLiquid),
          };
        }
      } else {
        return {
          result: sumLiquids(
            Object.values(liquids.ids.map((id) => liquids.data[id])),
          ),
        };
      }
    });

  function addLiquid(id?: string, l?: any) {
    let elementID = id || crypto.randomUUID();
    liquids.data[elementID] = l || {};
    liquids.ids.push(elementID);
  }

  onMount(() => {
    if (liquids.ids.length == 0) {
      if (window.location.hash) {
        const loadedState = StateObject.decode(
          Uint8Array.fromBase64(window.location.hash.substring(1)),
        );
        console.debug("loaded app state", loadedState);
        title = loadedState.title;
        loadedState.liquids.forEach((l) => {
          addLiquid(undefined, l);
        });
      } else {
        addLiquid();
      }
    }

    if (localeChoices.indexOf(navigator.language) != -1) {
      appSettings.locale = navigator.language;
    }
  });
  $effect(() => {
    if (title != "Compiling Calculator" || Object.keys(liquids).length != 0) {
      let l = $state.snapshot(liquids);
      let exportObject: StateObject = {
        title: title,
        liquids: $state
          .snapshot(liquids.ids)
          .map((id) => removeNullValues(l.data[id])),
      };

      window.location.hash =
        "#" + StateObject.encode(exportObject).finish().toBase64();
    }
  });

  window.onbeforeunload = (event) => {
    if (
      liquids.ids.length == 0 ||
      (liquids.ids.length == 1 &&
        "undefined" === typeof liquids.data[liquids.ids[0]].vol &&
        "undefined" === typeof liquids.data[liquids.ids[0]].mvol &&
        "undefined" === typeof liquids.data[liquids.ids[0]].mass &&
        "undefined" === typeof liquids.data[liquids.ids[0]].abm &&
        "undefined" === typeof liquids.data[liquids.ids[0]].abv &&
        "undefined" === typeof liquids.data[liquids.ids[0]].dens &&
        "undefined" === typeof liquids.data[liquids.ids[0]].mabm &&
        "undefined" === typeof liquids.data[liquids.ids[0]].mabv &&
        "undefined" === typeof liquids.data[liquids.ids[0]].mdens &&
        "undefined" === typeof liquids.data[liquids.ids[0]].lpa &&
        "undefined" === typeof liquids.data[liquids.ids[0]].kpa)
    ) {
      return;
    } else {
      event.preventDefault();
      return true;
    }
  };
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<Modals>
  <!-- shown when any modal is opened -->
  {#snippet backdrop({ close })}
    <div class="modal-backdrop" onclick={() => close()} />
  {/snippet}
</Modals>

<div class="container">
  <div>
    <div class="topbar">
      <button
        class="round-btn top-btn"
        onclick={() => {
          modals.open(Help, {});
        }}>?</button
      >
      <button
        class="round-btn top-btn"
        onclick={() => {
          modals.open(Settings, {});
        }}>{@html wrenchIcon}</button
      >
    </div>
    <div class="liquids">
      <h1 class="title" bind:textContent={title} contenteditable="true"></h1>
      {#each liquids.ids as id}<LiquidCard
          {id}
          bind:liquid={liquids.data[id]}
          computed={computed[id]}
        />{/each}
      <div style="flex-grow: 1; display: flex; justify-content: center;">
        <button
          onclick={() => {
            addLiquid();
          }}
          class="round-btn btn-add">{@html plusIcon}</button
        >
      </div>
      <div>
        <LiquidCard
          id="result"
          bind:liquid={forcedResult}
          computed={computed["result"]}
        />
      </div>
    </div>
  </div>
</div>

<style>
  .topbar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .top-btn {
    height: 24px;
  }

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

  .btn-add {
    padding: 10px;
    aspect-ratio: 1;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background-color: white;
    border: 1px solid black;

    height: 50px;
  }
  .btn-add:hover {
    color: var(--l-green);
    border-color: var(--l-green);
  }
  .btn-add:active {
    background-color: #ffe;
    box-shadow: 0 0 10px var(--l-green);
  }

  .title {
    text-align: center;
    padding: 0;
    margin: 0;
  }

  .modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(3px);
    z-index: 100;
  }
</style>
