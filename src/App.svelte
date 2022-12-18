<script lang="ts">
  import Map from './lib/map/Map.svelte';
  import Aside from './lib/aside/Aside.svelte';
  import { chosenAutocompleteItem, toggleAsideCollapsed } from './lib/store/app.store';
  import { asideCollapsed, geoSearchAutocompleteItems, geoSearchQuery } from './lib/store/app.store.js';
  import Button from './lib/button/Button.svelte';
  import Autocomplete from './lib/autocomplete/Autocomplete.svelte';

  function toggleAsideButtonClick(event) {
    toggleAsideCollapsed();
  }

  function geoSearchAutocompleteChooseItem(ev: CustomEvent) {
    const { item } = ev.detail;
    chosenAutocompleteItem.next(item);
    geoSearchQuery.next(null);
  }

</script>

<main>
  <div class="main-wrapper">
    <div class="toggle-aside-button">
      <Button on:click={toggleAsideButtonClick}>
        <span class="material-symbols-rounded">
          menu
        </span>
      </Button>
    </div>
    <Aside collapsed={$asideCollapsed}>
      <div class="aside-content">
        <div class="section-search">
          <Autocomplete
            bind:value="{$geoSearchQuery}"
            items="{$geoSearchAutocompleteItems || []}"
            bindItemText="title"
            bindItemKey="id"
            on:chooseItem={geoSearchAutocompleteChooseItem}
          />
        </div>
        <div class="chosen-item">
          {$chosenAutocompleteItem.title}
        </div>
      </div>
    </Aside>
    <div class="area-map">
      <Map/>
    </div>
  </div>
</main>

<style>
  .main-wrapper {
    width: 100vw;
    height: 100vh;
  }

  .area-map {
    box-shadow: -8px 0 16px #c7c7c7cc;
    height: 100%;
  }

  .toggle-aside-button {
    position: fixed;
    top: 1rem;
    left: 1rem;
    z-index: 500;
    max-width: 30px;
  }

  .aside-content {
    padding: 0 0 0 64px;
  }

  .section-search {
    max-width: 50%;
  }

  @media screen and (min-width: 800px) {
    .main-wrapper {
      grid-template-columns: minmax(0, 1fr) minmax(0, 3fr);
      grid-template-rows: none;
    }

    .area-info {
      padding: 32px;
    }
  }
</style>
