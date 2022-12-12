<script lang="ts">
  import Map from './lib/map/Map.svelte';
  import Aside from './lib/aside/Aside.svelte';
  import { toggleAsideCollapsed } from './lib/store/app.store';
  import { asideCollapsed, geoSearchAutocompleteItems, geoSearchQuery } from './lib/store/app.store.js';
  import Button from './lib/button/Button.svelte';

  function toggleAsideButtonClick(event) {
    toggleAsideCollapsed();
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
          <input type="text" bind:value={$geoSearchQuery}/>
        </div>
        <div class="section-favorites">
          {#each $geoSearchAutocompleteItems || [] as autocompleteItem}
            <div>{autocompleteItem.title}</div>
          {/each}
        </div>
        <img style="height:200px;"
             src="https://upload.wikimedia.org/wikipedia/ru/2/23/%D0%9F%D0%BE%D1%81%D1%82%D0%B5%D1%80_%D1%84%D0%B8%D0%BB%D1%8C%D0%BC%D0%B0_%C2%AB%D0%9F%D0%BE%D0%B8%D1%81%D0%BA%C2%BB.jpg"/>
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
