<script>
  import { localizeCap, localizePage } from "../../lib/content/locales";
  import BaseModal from "./BaseModal.svelte";

  const {
    // provided by <Modals />
    isOpen,
    close,
  } = $props();
</script>

<BaseModal {isOpen} {close} title={localizeCap("help")}>
  {@html localizePage("help")}
</BaseModal>

<style>
  :global(p) {
    margin: 7px 0;
  }
  :global(ul) {
    margin: 0;
  }
  :global(:is(h1, h2, h3, h4, h5, h6)) {
    margin-bottom: 3px;
  }
</style>
