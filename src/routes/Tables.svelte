<script lang="ts">
  const tableChoices = [
    { no: "none", desc: "select a table to display" },
    { no: "I", desc: "I: ϱ ← p, t" },
    { no: "II", desc: "II: ϱ ← q, t" },
    { no: "IIIa", desc: "IIIa: ϱ_20°C ← p" },
    { no: "IIIb", desc: "IIIb: q ← p" },
    { no: "IVa", desc: "IVa: ϱ_20°C ← q" },
    { no: "IVb", desc: "IVb: p ← q" },
    { no: "Va", desc: "Va: p ← ϱ_20°C" },
    { no: "Vb", desc: "Vb: q ← ϱ_20°C" },
    { no: "VI", desc: "VI: p ← ϱ, t" },
    { no: "VII", desc: "VII: q ← ϱ, t" },
    { no: "VIIIa", desc: "VIIIa: p ← p_meas, t" },
    { no: "VIIIb", desc: "VIIIb: q ← q_meas, t" },
  ];

  let sel: string | undefined = $state(undefined);
</script>

<svelte:head>
  <title>OIML tables</title>
</svelte:head>

<select bind:value={sel}>
  {#each tableChoices as t}
    <option value={t.no}>{t.desc}</option>
  {/each}
</select>

{#if sel == "I"}
  {#await import(`./tables/Table${sel}.svelte`)}
    <p>Loading..</p>
  {:then { default: TableI }}
    <TableI />
  {/await}
{:else if sel == "II"}
  {#await import(`./tables/Table${sel}.svelte`)}
    <p>Loading..</p>
  {:then { default: TableII }}
    <TableII />
  {/await}
{:else if sel == "IIIa"}
  {#await import(`./tables/Table${sel}.svelte`)}
    <p>Loading..</p>
  {:then { default: TableIIIa }}
    <TableIIIa />
  {/await}
{:else if sel == "IIIb"}
  {#await import(`./tables/Table${sel}.svelte`)}
    <p>Loading..</p>
  {:then { default: TableIIIb }}
    <TableIIIb />
  {/await}
{:else if sel == "IVa"}
  {#await import(`./tables/Table${sel}.svelte`)}
    <p>Loading..</p>
  {:then { default: TableIVb }}
    <TableIVb />
  {/await}
{:else if sel == "IVb"}
  {#await import(`./tables/Table${sel}.svelte`)}
    <p>Loading..</p>
  {:then { default: TableIVa }}
    <TableIVa />
  {/await}
{:else if sel == "Va"}
  {#await import(`./tables/Table${sel}.svelte`)}
    <p>Loading..</p>
  {:then { default: TableVa }}
    <TableVa />
  {/await}
{:else if sel == "Vb"}
  {#await import(`./tables/Table${sel}.svelte`)}
    <p>Loading..</p>
  {:then { default: TableVb }}
    <TableVb />
  {/await}
{:else if sel == "VI"}
  {#await import(`./tables/Table${sel}.svelte`)}
    <p>Loading..</p>
  {:then { default: TableVI }}
    <TableVI />
  {/await}
{:else if sel == "VII"}
  {#await import(`./tables/Table${sel}.svelte`)}
    <p>Loading..</p>
  {:then { default: TableVII }}
    <TableVII />
  {/await}
{:else if sel == "VIIIa"}
  {#await import(`./tables/Table${sel}.svelte`)}
    <p>Loading..</p>
  {:then { default: TableVIIIa }}
    <TableVIIIa />
  {/await}
{:else if sel == "VIIIb"}
  {#await import(`./tables/Table${sel}.svelte`)}
    <p>Loading..</p>
  {:then { default: TableVIIIb }}
    <TableVIIIb />
  {/await}
{:else}
  <p>select a table to display</p>
{/if}
