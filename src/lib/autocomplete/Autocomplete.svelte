<script lang="ts">
  import dlv from 'dlv';
  import { computePosition, flip, offset, shift } from '@floating-ui/dom';

  export let items: unknown[] = [];
  export let value: string | null = null;
  export let bindItemText: string | (string | number)[] = [];

  let inputRef: HTMLInputElement;
  let popperRef: HTMLElement;

  $: itemsLength = items.length;

  $: togglePopper(!!itemsLength);

  async function togglePopper(show: boolean) {
    console.log('togglePopper: ', show);

    if (!show) {
      console.log('skip computePosition: not needed');
      return;
    }

    if (!(inputRef && popperRef)) {
      console.log('skip computePosition: elements not ready');
      return;
    }


    const popperPosition = await computePosition(inputRef, popperRef, {
      placement: 'bottom-start',
      middleware: [
        offset(4),
        shift(),
        flip(),
      ],
    });

    Object.assign(popperRef.style, {
      transform: `translate3d(${Math.round(popperPosition.x)}px,${Math.round(popperPosition.y)}px, 0`,
    });
  }

</script>

<input type=text class="app-autocomplete-input" bind:value bind:this={inputRef}/>
<div class="app-autocomplete-popper" class:popper-visible={items && items.length} bind:this={popperRef}>
  <ul class="app-autocomplete-dropdown_list">
    {#each items as item}
      <li class="app-autocomplete-dropdown_list_item">
        {dlv(item, bindItemText, item)}
      </li>
    {/each}
  </ul>
</div>

<style>
  .app-autocomplete-input {

  }

  .app-autocomplete-popper {
    display: block;
    visibility: hidden;
    opacity: 0;
    width: max-content;
    position: absolute;
    top: -5px;
    left: 0;
    background: #999;
    color: white;
    padding: 5px;
    border-radius: 4px;
    transition: top 200ms ease, opacity 200ms ease;
  }

  .app-autocomplete-popper.popper-visible {
    top: 0;
    visibility: visible;
    opacity: 1;
  }

</style>