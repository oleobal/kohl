<script lang="ts">
  import { Modals } from "svelte-modals";
  import Calculator from "./routes/Calculator.svelte";
  import NotFound from "./routes/NotFound.svelte";
  import Tables from "./routes/Tables.svelte";
  import Charts from "./routes/Charts.svelte";
  import { model } from "./lib/state.svelte";
  import Router from "svelte-spa-router";
  import Table from "./routes/Table.svelte";

  $effect(() => {
    model.loadAndSelect(model.id, model.glassAlpha);
  });

  const routes = {
    "/": Calculator,

    "/table/": Tables,
    "/table/:no": Table,

    "/chart/": Charts,

    "*": NotFound,
  };
</script>

<Modals>
  <!-- shown when any modal is opened -->
  {#snippet backdrop({ close })}
    <!-- not made accessible as there already is an "OK" button which does the same thing -->
    <div role="none" class="modal-backdrop" onclick={() => close()}></div>
  {/snippet}
</Modals>

<Router {routes} />

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
