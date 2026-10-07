<script lang="ts">
  import { on } from "svelte/events";

  const {
    // provided by <Modals />
    isOpen,
    close,
    title,
    children,
  } = $props();

  function closeIfLink(e: any) {
    if (e.target.localName == "a") {
      close();
    }
  }
</script>

{#if isOpen}
  <div role="dialog" class="modal">
    <div class="contents">
      <div class="title-box">
        <h1 style="color: white; padding: 0;">{title}</h1>
      </div>
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div class="text" onclick={closeIfLink}>
        {@render children?.()}
      </div>
      <div class="actions">
        <button class="round-btn" style="height: 35px;" onclick={() => close()}
          >OK</button
        >
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

    z-index: 101;
    /* allow click-through to backdrop */
    pointer-events: none;
  }

  .contents {
    pointer-events: auto;
    width: min(calc(100vw - 30px), 800px);
    max-height: calc(100vh - 30px);
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
  .title-box > h1 {
    margin: 16px 0;
  }

  .text {
    padding: 16px;
    padding-top: 0;
    background: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    font-size: 75%;
    overflow: scroll;
  }

  .actions {
    padding: 16px;
    display: flex;
    justify-content: flex-end;
  }
</style>
