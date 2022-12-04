<script lang="ts">
import Map from './lib/map/Map.svelte';
import Aside from './lib/aside/Aside.svelte';

let collapsedAside = true;

function toggleAsideButtonClick(event) {
  collapsedAside = !collapsedAside;
}

</script>

<main>
  <div class="main-wrapper">
    <button class="toggle-aside-button"  on:click={toggleAsideButtonClick}>...</button>
    <Aside collapsed={collapsedAside}>
      <div class="aside-content">
      <div class="section-search">SEARCH</div>
      <div class="section-favorites">FAVOURITES</div>
      <img style="height:200px;" src="https://upload.wikimedia.org/wikipedia/ru/2/23/%D0%9F%D0%BE%D1%81%D1%82%D0%B5%D1%80_%D1%84%D0%B8%D0%BB%D1%8C%D0%BC%D0%B0_%C2%AB%D0%9F%D0%BE%D0%B8%D1%81%D0%BA%C2%BB.jpg"/>
      </div>
    </Aside>
    <div class="area-map">
      <Map />
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
    border: gray 1px solid;
    border-radius: 4px;
    width: 32px;
    height: 32px;
    background-image: linear-gradient(45deg, #c7c7c7, transparent);
    box-shadow: 0px 4px 8px 1px rgb(0 0 0 / 50%);
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
