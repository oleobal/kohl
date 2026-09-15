<script lang="ts">
  import Calculator from "./routes/Calculator.svelte";
  import TableI from "./routes/tables/TableI.svelte";
  
  const path = window.location.pathname
</script>

{#if path == "/table/I"}
  <TableI />
{:else}
  <Calculator />
{/if}