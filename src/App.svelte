<script lang="ts">
  import Calculator from "./routes/Calculator.svelte";
  import NotFound from "./routes/NotFound.svelte";
  import Tables from "./routes/Tables.svelte";
  import TableI from "./routes/tables/TableI.svelte";
  import TableII from "./routes/tables/TableII.svelte";
  import TableIIIa from "./routes/tables/TableIIIa.svelte";
  import TableIIIb from "./routes/tables/TableIIIb.svelte";
  import TableIVa from "./routes/tables/TableIVa.svelte";
  import TableIVb from "./routes/tables/TableIVb.svelte";
  import TableVa from "./routes/tables/TableVa.svelte";

  const path = window.location.pathname;
</script>

{#if path == "/table" || path == "/table/"}
  <Tables />
{:else if path == "/table/I"}
  <TableI />
{:else if path == "/table/II"}
  <TableII />
{:else if path == "/table/IIIa"}
  <TableIIIa />
{:else if path == "/table/IIIb"}
  <TableIIIb />
{:else if path == "/table/IVa"}
  <TableIVa />
{:else if path == "/table/IVb"}
  <TableIVb />
{:else if path == "/table/Va"}
  <TableVa />
{:else if path == "/" || path == ""}
  <Calculator />
{:else}
  <NotFound />
{/if}
