<script lang="ts">
  import TableLoader from "./components/TableLoader.svelte";
  import Calculator from "./routes/Calculator.svelte";
  import NotFound from "./routes/NotFound.svelte";
  import Tables from "./routes/Tables.svelte";

  const path = window.location.pathname.slice(import.meta.env.BASE_URL.length);
</script>

{#if path == "table/"}
  <Tables />
{:else if path.startsWith("table/")}
  <TableLoader no={path.slice("table/".length)} />
{:else if path == "/" || path == ""}
  <Calculator />
{:else}
  <NotFound />
{/if}
