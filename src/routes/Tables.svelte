<script lang="ts">
  import TableI from "./tables/TableI.svelte";
  import TableII from "./tables/TableII.svelte";
  import TableIIIa from "./tables/TableIIIa.svelte";
  import TableIIIb from "./tables/TableIIIb.svelte";
  import TableIVa from "./tables/TableIVa.svelte";
  import TableIVb from "./tables/TableIVb.svelte";
  import TableVa from "./tables/TableVa.svelte";
  import TableVb from "./tables/TableVb.svelte";

  const tableChoices = [
    { no: "none", desc: "select a table to display"},
    { no: "I", desc: "I: ϱ ← p, t"},
    { no: "II", desc: "II: ϱ ← q, t"},
    { no: "IIIa", desc: "IIIa: ϱ_20°C ← p"},
    { no: "IIIb", desc: "IIIb: q ← p"},
    { no: "IVa", desc: "IVa: ϱ_20°C ← q"},
    { no: "IVb", desc: "IVb: p ← q"},
    { no: "Va", desc: "Va: p ← ϱ_20°C"},
    { no: "Vb", desc: "Vb: q ← ϱ_20°C"},
];
  
  let selectedTable: string | undefined = undefined;
</script>

<svelte:head>
   <title>OIML tables</title>
</svelte:head>


<select
    bind:value={selectedTable}
>
{#each tableChoices as t}
    <option value={t.no}>{t.desc}</option>
{/each}
</select>

{#if selectedTable == "I"}
<TableI />
{:else if selectedTable == "II"}
<TableII />
{:else if selectedTable == "IIIa"}
<TableIIIa />
{:else if selectedTable == "IIIb"}
<TableIIIb />
{:else if selectedTable == "IVa"}
<TableIVa />
{:else if selectedTable == "IVb"}
<TableIVb />
{:else if selectedTable == "Va"}
<TableVa />
{:else if selectedTable == "Vb"}
<TableVb />
{:else}
<p>select a table to display</p>
{/if}