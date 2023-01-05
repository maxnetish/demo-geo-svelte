<script lang="ts">
  import dlv from 'dlv';
  import { computePosition, flip, offset, shift } from '@floating-ui/dom';
  import { createEventDispatcher } from 'svelte';

  enum PopperState {
    HIDDEN_IN = 'hidden-in',
    HIDDEN = 'hidden',
    VISIBLE_IN = 'visible-in',
    VISIBLE = 'visible'
  }

  export let items: unknown[] = [];
  export let value: string | null = null;
  export let bindItemText: string | (string | number)[] = [];
  export let bindItemKey: string | (string | number)[] = [];
  export let placeholder: string = '';

  let inputRef: HTMLInputElement;
  let popperRef: HTMLElement;

  let popperState: PopperState = PopperState.HIDDEN;
  let itemsInternal: unknown[] = [];

  const dispatcher = createEventDispatcher();

  $: setItemsInteral(items);

  async function setItemsInteral(itemsLocal: unknown[]) {
    if(items && items.length) {
      await makePopperVisible(itemsLocal);
    } else {
      await makePopperHidden(itemsLocal);
    }
  }

  async function makePopperHidden(itemsLocal: unknown[]) {
    return new Promise((resolve, reject) => {
      if (!(inputRef && popperRef)) {
        console.log('skip makePopperHidden: elements not ready');
        resolve();
        return;
      }

      if(([PopperState.HIDDEN, PopperState.HIDDEN_IN] as PopperState[]).includes(popperState)) {
        console.log('Skip makePopperHidden: already hidden or hidden-in');
        resolve();
        return;
      }

      popperRef.addEventListener('transitionend', handleTransitionEnd);
      popperRef.addEventListener('transitioncancel', handleTransitionCancel);

      popperState = PopperState.HIDDEN_IN;

      function handleTransitionEnd() {
        popperState = PopperState.HIDDEN;
        popperRef.removeEventListener('transitionend', handleTransitionEnd);
        popperRef.removeEventListener('transitioncancel', handleTransitionCancel);
        itemsInternal = itemsLocal ? [...itemsLocal] : [];
        resolve();
      }

      function handleTransitionCancel() {
        popperState = PopperState.VISIBLE;
        popperRef.removeEventListener('transitionend', handleTransitionEnd);
        popperRef.removeEventListener('transitioncancel', handleTransitionCancel);
        resolve();
      }
    });
  }

  async function makePopperVisible(itemsLocal: unknown[]) {
    return new Promise(async (resolve) => {
      itemsInternal = [...itemsLocal];

      if (!(inputRef && popperRef)) {
        console.log('skip makePopperVisible: elements not ready');
        resolve();
        return;
      }

      if(([PopperState.VISIBLE, PopperState.VISIBLE_IN] as PopperState[]).includes(popperState)) {
        console.log('Skip makePopperVisible: already visible or visible-in');
        resolve();
        return;
      }

      popperRef.addEventListener('transitionend', handleTransitionEnd);
      popperRef.addEventListener('transitioncancel', handleTransitionCancel);

      popperState = PopperState.VISIBLE_IN;

      const popperPosition = await computePosition(inputRef, popperRef, {
        placement: 'bottom-start',
        middleware: [
          offset(4),
          shift(),
          flip(),
        ],
      });
      const inputBox = inputRef.getBoundingClientRect();

      Object.assign(popperRef.style, {
        transform: `
      translate3d(
        ${Math.round(popperPosition.x)}px,
        ${Math.round(popperPosition.y)}px,
        0
      )
      `,
        width: `${inputBox.width + 1}px`,
      });

      function handleTransitionEnd() {
        popperState = PopperState.VISIBLE;
        popperRef.removeEventListener('transitionend', handleTransitionEnd);
        popperRef.removeEventListener('transitioncancel', handleTransitionCancel);
        resolve();
      }

      function handleTransitionCancel() {
        popperState = PopperState.HIDDEN;
        popperRef.removeEventListener('transitionend', handleTransitionEnd);
        popperRef.removeEventListener('transitioncancel', handleTransitionCancel);
        resolve();
      }
    });
  }

  function clickItem(item: unknown, itemIndex: number) {
    dispatcher('chooseItem', {item, itemIndex});
  }

  function keydownItem(ev: KeyboardEvent, item: unknown, itemIndex: number) {
    if([' ', 'Enter'].includes(ev.key)) {
      clickItem(item, itemIndex);
    }
  }

</script>

<div class="app-autocomplete-ct">
  <input
    type=text
    class="app-autocomplete-input"
    bind:value
    bind:this={inputRef}
    placeholder={placeholder}
  />
  <div
    class="app-autocomplete-popper"
    class:popper-visible={popperState === PopperState.VISIBLE}
    class:popper-visible-in={popperState === PopperState.VISIBLE_IN}
    class:popper-hidden={popperState===PopperState.HIDDEN}
    class:popper-hidden-in={popperState===PopperState.HIDDEN_IN}
    bind:this={popperRef}
  >
    <ul role="menu" class="app-autocomplete-dropdown_list">
      {#each itemsInternal as item, itemIndex (dlv(item, bindItemKey, item))}
        <li
          role="menuitem"
          class="app-autocomplete-dropdown_list_item"
          tabindex="0"
          on:click={() => clickItem(item, itemIndex)}
          on:keydown={(ev) => keydownItem(ev, item, itemIndex)}
        >
          <slot name="itemTemplate" {item}>
            {dlv(item, bindItemText, item)}
          </slot>
        </li>
      {/each}
    </ul>
  </div>
</div>

<style>
  .app-autocomplete-input {
    width: 100%;
    font-size: 1rem;
    padding: 0.25rem 0.5rem;
  }
  .app-autocomplete-input:focus-visible {
    outline: var(--color-accent-bg) 1px dashed;
    outline-offset: 2px;
  }

  .app-autocomplete-ct {
    position: relative;
  }

  .app-autocomplete-popper {
    display: block;
    width: max-content;
    position: absolute;
    left: 0;
    background-color: var(--color-dropdowm-bg);
    color: var(--color-text);
    transition: top 200ms ease, opacity 200ms ease;
    max-height: calc(100vh - 128px);
    max-width: calc(100vw - 32px);
    overflow: auto;
    border: var(--border-dropdown);
    border-radius: var(--border-dropdown-radius);
    box-shadow: 0 4px 8px 1px rgb(0 0 0 / 50%);
    z-index: 100;
  }

  .app-autocomplete-popper.popper-hidden {
    visibility: hidden;
    opacity: 0;
    top: -5px;
  }

  .app-autocomplete-popper.popper-hidden-in {
    visibility: visible;
    opacity: 0;
    top: -5px;
  }

  .app-autocomplete-popper.popper-visible-in,
  .app-autocomplete-popper.popper-visible {
    top: 0;
    visibility: visible;
    opacity: 1;
  }

  .app-autocomplete-dropdown_list_item {
    padding: 0.5rem;
    cursor: pointer;
  }
  .app-autocomplete-dropdown_list_item:hover {
    background-color: var(--color-accent-bg);
    color: var(--color-accent-text);
  }

  .app-autocomplete-dropdown_list_item:hover :global(*:not(mark)) {
    color: var(--color-accent-text);
  }

  .app-autocomplete-dropdown_list_item:focus-visible {
    outline: var(--color-accent-bg) 1px dashed;
    outline-offset: -2px;
  }

</style>