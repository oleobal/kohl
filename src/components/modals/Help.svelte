<script>
  import {
    localize,
    localizeCap,
    localizePage,
  } from "../../lib/content/locales";

  const {
    // provided by <Modals />
    isOpen,
    close,
  } = $props();
</script>

{#if isOpen}
  <div role="dialog" class="modal">
    <div class="contents">
      <div class="title-box">
        <h1 style="color: white; padding: 0;">{localizeCap("help")}</h1>
      </div>
      <div class="text">
        {@html localizePage("help")}
      </div>
      <div class="actions">
        <button onclick={() => close()}>OK</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    /* allow click-through to backdrop */
    pointer-events: none;
    z-index: 101;
  }

  .contents {
    width: min(calc(100vw - 50px), 800px);
    max-height: calc(100vh - 50px);
    display: flex;
    flex-direction: column;
  }

  .title-box,
  .actions {
    padding: 0;
    display: flex;
    justify-content: space-around;
    background-color: #0005;
    border: 1px solid white;
  }

  .text {
    padding: 16px;
    padding-top: 0;
    background: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    pointer-events: auto;
    font-size: 75%;
    overflow: scroll;
  }
  .text > :global(p) {
    margin: 7px 0;
  }
  .text > :global(ul) {
    margin: 0;
  }
  .text > :global(:is(h1, h2, h3, h4, h5, h6)) {
    margin-bottom: 3px;
  }

  .actions {
    padding: 16px;
    display: flex;
    justify-content: flex-end;
  }
</style>
