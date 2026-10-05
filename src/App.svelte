<script lang="ts">
  import { Modals } from "svelte-modals";
  import TableLoader from "./components/TableLoader.svelte";
  import Calculator from "./routes/Calculator.svelte";
  import NotFound from "./routes/NotFound.svelte";
  import Tables from "./routes/Tables.svelte";
  import Charts from "./routes/Charts.svelte";

  const path = window.location.pathname.slice(import.meta.env.BASE_URL.length);
</script>

<Modals>
  <!-- shown when any modal is opened -->
  {#snippet backdrop({ close })}
    <!-- not made accessible as there already is an "OK" button which does the same thing -->
    <div role="none" class="modal-backdrop" onclick={() => close()}></div>
  {/snippet}
</Modals>

{#if path == "table/"}
  <Tables />
{:else if path.startsWith("table/")}
  <TableLoader no={path.slice("table/".length)} />
{:else if path == "chart/"}
  <Charts />
{:else if path == "/" || path == ""}
  <Calculator />
{:else}
  <NotFound />
{/if}

<style>
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
