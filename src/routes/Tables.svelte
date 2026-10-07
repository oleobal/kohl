<script lang="ts">
  import {  modals } from "svelte-modals";
  import TableLoader from "../components/TableLoader.svelte";
  import { localize, localizeCap } from "../lib/content/locales";
  import { homeIcon, wrenchIcon } from "../lib/content/icons";
  import Settings from "../components/modals/Settings.svelte";

  const tableChoices = {
    none: localize("select_a_table"),
    I: "ϱ ← p, t",
    II: "ϱ ← q, t",
    IIIa: "ϱ_20°C ← p",
    IIIb: "q ← p",
    IVa: "ϱ_20°C ← q",
    IVb: "p ← q",
    Va: "p ← ϱ_20°C",
    Vb: "q ← ϱ_20°C",
    VI: "p ← ϱ, t",
    VII: "q ← ϱ, t",
    VIIIa: "p ← p_meas, t",
    VIIIb: "q ← q_meas, t",
    IXa: "p ← ϱ_meas, t",
    IXb: "q ← ϱ_meas, t",
  };

  let sel: string = $state("none");
</script>

<svelte:head>
  <title>{localizeCap("oiml_tables")}</title>
</svelte:head>

<div style="display: flex; width: 100%; justify-content: space-between;">
  <button
    class="round-btn"
    style="height: 24px"
    onclick={() => {
      location.href="#/"
    }}>{@html homeIcon}</button
  >
  <div>
    <select bind:value={sel}>
      {#each Object.keys(tableChoices) as t}
      {const v = tableChoices[t as keyof typeof tableChoices]}
      <option value={t}
          >{t=="none"?"":t+":"} {v}</option
        >
        {/each}
    </select>
    {#if sel != "none"}
    <a href={`#/table/${sel}`} style="font-size: 70%">direct link</a>
    {/if}
  </div>
  <button
    class="round-btn"
    style="height: 24px"
    onclick={() => {
      modals.open(Settings, {});
    }}>{@html wrenchIcon}</button
  >
</div>

{#if sel != "none"}
  <TableLoader no={sel} />
{:else}
  <p>{localize("select_a_table")}</p>
{/if}
