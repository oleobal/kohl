<script lang="ts">
  import TableLoader from "../components/TableLoader.svelte";
  import NotFound from "./NotFound.svelte";

  let { params = {} } = $props();
  let no = $derived(params.no);
</script>

{#if no}
  <TableLoader {no} />
{:else}
  <NotFound />
{/if}
