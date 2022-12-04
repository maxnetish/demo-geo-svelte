<script lang="ts">
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

    if (!collapsed) {
      // transition in
      transitionIn = true;
      const contentHeight = await measureHiddenElementHeight(collapsedElement);
      style.setProperty('top', `-${contentHeight}px`);
      await waitForNextAnimationFrame(2);
      style.setProperty('transition', transitionProps);
      style.setProperty('top', '0');
    } else {
      // transition out
      const contentHeight = measureElementHeight(collapsedElement);
      style.setProperty('transition', transitionProps);
      style.setProperty('top', `-${contentHeight}px`);
    }
  }

  function handleTransitionEnd(event: TransitionEvent) {
    if (event.propertyName === 'top') {
      resetAfterTransition();
    }
  }

  function handleTransitionCancel(event: TransitionEvent) {
    if (event.propertyName === 'top') {
      resetAfterTransition();
    }
  }

  function resetAfterTransition() {
    const {style} = collapsedElement;
    style.removeProperty('top');
    style.removeProperty('transition');
    transitionIn = false;
    _collapsedIntern = collapsed;
  }

  function measureElementHeight(elem: HTMLElement) {
    if (elem) {
      return elem.getBoundingClientRect().height;
    } else {
      return 0;
    }
  }

  async function measureHiddenElementHeight(elem: HTMLElement) {

    if (elem) {
      const {style} = elem;
      style.setProperty('position', 'absolute');
      style.setProperty('visibility', 'hidden');
      await waitForNextAnimationFrame(2);
      let result = measureElementHeight(elem);
      style.removeProperty('position');
      style.removeProperty('visibility');
      return result;
    } else {
      return 0;
    }
  }

  async function waitForNextAnimationFrame(count = 1) {
    for (let i = 0; i < count; i++) {
      await new Promise((resolve) => window.requestAnimationFrame(resolve));
    }
  }

</script>

<div
        class="aside-collapsable"
        class:collapsed={_collapsedIntern}
        class:transition-in={transitionIn}
        bind:this={collapsedElement}
        on:transitionend={handleTransitionEnd}
        on:transitioncancel={handleTransitionCancel}
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