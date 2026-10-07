<script lang="ts">
  import {
    knownLanguages,
    localize,
    localizeCap,
    localizePage,
  } from "../../lib/content/locales";
  import { KnownModels } from "../../lib/physics/models";
  import { GlassExpansionCoefficient } from "../../lib/physics/oiml/practical";
  import { appSettings, model } from "../../lib/state.svelte";
  import BaseModal from "./BaseModal.svelte";

  const {
    // provided by <Modals />
    isOpen,
    close,
  } = $props();

  let chosenModel: keyof typeof KnownModels = $state(model.id);
  const modelChoices = Object.keys(KnownModels) as (keyof typeof KnownModels)[];
  let chosenGlassAlpha: keyof typeof GlassExpansionCoefficient | number =
    $state(model.glassAlpha);
  const glassAlphaChoices = Object.keys(GlassExpansionCoefficient).filter(
    (it) => isNaN(Number(it)),
  );
  $effect(() => {
    model.id = chosenModel;
    model.glassAlpha = chosenGlassAlpha;
  });
</script>

<BaseModal {isOpen} {close} title={localizeCap("settings")}>
  <h2>{localizeCap("parameters_ui")}</h2>
  <div style="display: grid; grid-template-columns: 1fr 1fr;">
    <label for="settings-select-language">{localizeCap("language")}</label>
    <select bind:value={appSettings.locale} id="settings-select-language">
      {#each knownLanguages as l}
        <option value={l}>{l} ({localize("_language_endonym", l)})</option>
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
        <option value={m}>{KnownModels[m].name}</option>
      {/each}
    </select>
    <div></div>
    <div style="font-size: 80%">
      {localizeCap(`model_${chosenModel.toLowerCase()}_desc`)}
    </div>
    <label for="settings-select-glass-alpha"
      >{localizeCap("glass_exp_coeff")}</label
    >
    <select bind:value={chosenGlassAlpha} id="settings-select-glass-alpha">
      {#each glassAlphaChoices as g}
        <option value={g}>{localize(`glass_${g.toLowerCase()}_name`)}</option>
      {/each}
    </select>
    <div></div>
    <div style="font-size: 80%">
      α={GlassExpansionCoefficient[
        chosenGlassAlpha as keyof typeof GlassExpansionCoefficient
      ].toExponential()} — {localize(
        `glass_${String(chosenGlassAlpha).toLowerCase()}_desc`,
      )}
    </div>
  </div>
  <details>
    <summary
      >{localizeCap("model_details")}{localize(":")}
      <i>{KnownModels[model.id].name}</i></summary
    >
    {@html localizePage("model_details_" + String(model.id).toLowerCase())}
  </details>
  {@html localizePage("about")}
</BaseModal>
