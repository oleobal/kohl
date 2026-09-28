<script lang="ts">
  import {
    knownLanguages,
    localize,
    localizeCap,
    localizePage,
  } from "../../lib/content/locales";
  import { Table } from "../../lib/physics/density";
  import type { KnownModels } from "../../lib/physics/models";
  import { knownModels } from "../../lib/physics/models";
  import { GlassExpansionCoefficient } from "../../lib/physics/oiml/practical";
  import { appSettings, model } from "../../lib/state.svelte";

  const {
    // provided by <Modals />
    isOpen,
    close,
  } = $props();

  let chosenModel: keyof KnownModels = $state(model.id);
  const modelChoices = Object.keys(knownModels) as (keyof KnownModels)[];
  let chosenGlassAlpha: keyof typeof GlassExpansionCoefficient | number =
    $state(model.glassAlpha);
  const glassAlphaChoices = Object.keys(GlassExpansionCoefficient).filter(
    (it) => isNaN(Number(it)),
  );
  $effect(() => {
    model.id = chosenModel;
    model.glassAlpha = chosenGlassAlpha;
    model.table = new Table(
      knownModels[chosenModel],
      Number(GlassExpansionCoefficient[chosenGlassAlpha]),
    );
  });
</script>

{#if isOpen}
  <div role="dialog" class="modal">
    <div class="contents">
      <div class="title-box">
        <h1 style="color: white; padding: 0;">{localizeCap("settings")}</h1>
      </div>
      <div class="text">
        <h2>{localizeCap("parameters_ui")}</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr;">
          <label for="settings-select-language">{localizeCap("language")}</label
          >
          <select bind:value={appSettings.locale} id="settings-select-language">
            {#each knownLanguages as l}
              <option value={l}>{l} ({localize("_language_endonym", l)})</option
              >
            {/each}
          </select>
          <!-- <label>theme</label>-->
        </div>
        <!--x<p>quantity visibility</p>-->
        <h2>{localizeCap("parameters_model")}</h2>

        <div style="display: grid; grid-template-columns: 1fr 1fr;">
          <label for="settings-select-model">{localizeCap("model")}</label>
          <select bind:value={chosenModel} id="settings-select-model">
            {#each modelChoices as m}
              <option value={m}>{knownModels[m].name}</option>
            {/each}
          </select>
          <div></div>
          <div style="font-size: 80%">
            {localizeCap(`model_${chosenModel.toLowerCase()}_desc`)}
          </div>
          <label for="settings-select-glass-alpha"
            >{localizeCap("glass_exp_coeff")}</label
          >
          <select
            bind:value={chosenGlassAlpha}
            id="settings-select-glass-alpha"
          >
            {#each glassAlphaChoices as g}
              <option value={g}
                >{localize(`glass_${g.toLowerCase()}_name`)}</option
              >
            {/each}
          </select>
          <div></div>
          <div style="font-size: 80%">
            {localizeCap(
              `glass_${String(chosenGlassAlpha).toLowerCase()}_desc`,
            )}
          </div>
        </div>
        {@html localizePage("about")}
      </div>
      <div class="actions">
        <button class="round-btn" style="height: 35px;" onclick={() => close()}
          >OK</button
        >
      </div>
    </div>
  </div>
{/if}

<style>
  .modal {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    /* allow click-through to backdrop */
    pointer-events: none;
    z-index: 101;
  }

  .contents {
    width: min(calc(100vw - 30px), 800px);
    max-height: calc(100vh - 30px);
    display: flex;
    flex-direction: column;
  }

  .title-box,
  .actions {
    padding: 0;
    display: flex;
    justify-content: space-around;
    background-color: #0005;
    border: 1px solid white;
  }

  .text {
    padding: 16px;
    padding-top: 0;
    background: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    pointer-events: auto;
    font-size: 75%;
    overflow: scroll;
  }
  .text > :global(p) {
    margin: 7px 0;
  }
  .text > :global(ul) {
    margin: 0;
  }
  .text > :global(:is(h1, h2, h3, h4, h5, h6)) {
    margin-bottom: 3px;
  }

  .actions {
    padding: 16px;
    display: flex;
    justify-content: flex-end;
  }
</style>
