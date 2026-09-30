<script lang="ts">
  import { localizeCap } from "../lib/content/locales";

  const { no } = $props();
  let computingMsg = localizeCap("computing") + "..";
</script>

{#await import(`./tables/Table${no}.svelte`)}
  <p>{computingMsg}</p>
{:then { default: It }}
  <It />
{/await}
