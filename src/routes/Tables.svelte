<script lang="ts">
  import TableLoader from "../components/TableLoader.svelte";
  import { localize, localizeCap } from "../lib/content/locales";

  const tableChoices = {
    none: localize("select_a_table"),
    I: "I: ϱ ← p, t",
    II: "II: ϱ ← q, t",
    IIIa: "IIIa: ϱ_20°C ← p",
    IIIb: "IIIb: q ← p",
    IVa: "IVa: ϱ_20°C ← q",
    IVb: "IVb: p ← q",
    Va: "Va: p ← ϱ_20°C",
    Vb: "Vb: q ← ϱ_20°C",
    VI: "VI: p ← ϱ, t",
    VII: "VII: q ← ϱ, t",
    VIIIa: "VIIIa: p ← p_meas, t",
    VIIIb: "VIIIb: q ← q_meas, t",
  };

  let sel: string = "none";

</script>

<svelte:head>
  <title>{localizeCap("oiml_tables")}</title>
</svelte:head>

<div>
  <select bind:value={sel}>
    {#each Object.keys(tableChoices) as t}
    {const v = tableChoices[t as keyof typeof tableChoices]}
      <option value={t}
        >{v}</option
      >
    {/each}
  </select>
  {#if sel != "none"}
    <a href={`/table/${sel}`} style="font-size: 70%">direct link</a>
  {/if}
</div>

{#if sel != "none"}
  <TableLoader no={sel} />
{:else}
  <p>{localize("select_a_table")}</p>
{/if}
