<script lang="ts">
  import { measureElementDimension, measureHiddenElementDimension, waitForNextAnimationFrame } from '../utils/dom';

  export let collapsed = false;

  const transitionProps = 'top 500ms ease';

  let _collapsedIntern = collapsed;
  let transitionIn = false;
  let collapsedElement: HTMLElement;

  $: collapsedChanged(collapsed);

  async function collapsedChanged(collapsedValue) {

    if (!collapsedElement) {
      return;
    }

    const {style} = collapsedElement;
    // Keep element style
    const initialStyle = {
      transition: style.getPropertyValue('transition'),
      top: style.getPropertyValue('top'),
    };
    const listeners = {
      transitionend: handleTransitionEndOrCancel,
      transitioncancel: handleTransitionEndOrCancel,
    }

    // mark that transition starts
    transitionIn = true;

    if (!collapsed) {
      // measure
      const contentHeight = await measureHiddenElementDimension(collapsedElement, 'height');
      style.setProperty('top', `-${contentHeight}px`);
      Object.entries(listeners).forEach(([ev, listener]) => {
        collapsedElement.addEventListener(ev, listener);
      });
      await waitForNextAnimationFrame(2);
      // and begin animation
      style.setProperty('transition', transitionProps);
      style.setProperty('top', '0');
    } else {
      // transition out
      Object.entries(listeners).forEach(([ev, listener]) => {
        collapsedElement.addEventListener(ev, listener);
      });
      const contentHeight = measureElementDimension(collapsedElement, 'height');
      style.setProperty('transition', transitionProps);
      style.setProperty('top', `-${contentHeight}px`);
    }

    function handleTransitionEndOrCancel(this: HTMLElement, event: TransitionEvent) {
      const {style} = collapsedElement;
      // remove listeners
      Object.entries(listeners).forEach(([ev, listener]) => {
        collapsedElement.removeEventListener(ev, listener);
      });
      event.target.removeEventListener('transitionend', handleTransitionEndOrCancel);
      event.target.removeEventListener('transitioncancel', handleTransitionEndOrCancel);
      // restore style only if transition in process.
      // Else when transition cancels we will restore incorrect style
      if(transitionIn) {
        Object.entries(initialStyle).forEach(([key, value]) => {
          style.setProperty(key, value);
        });
      }
      // remove transition mark
      transitionIn = false;
      // and set collapsed (or not) class
      _collapsedIntern = collapsed;
    }
  }

</script>

<div
        class="aside-collapsable"
        class:collapsed={_collapsedIntern}
        class:transition-in={transitionIn}
        bind:this={collapsedElement}
>
  <slot></slot>
</div>

<style>
  .aside-collapsable {
    position: fixed;
    z-index: 450;
    background-color: #ffffffdd;
    top: 0;
    left: 0;
    right: 0;
    box-shadow: 0px 8px 8px 4px rgb(0 0 0 / 25%);
  }

  .aside-collapsable.collapsed:not(.transition-in) {
    display: none;
  }

</style>