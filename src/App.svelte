<script lang="ts">
  import Map from './lib/map/Map.svelte';
  import Aside from './lib/aside/Aside.svelte';
  import { chosenAutocompleteItem, chosenAutosuggestItem, toggleAsideCollapsed } from './lib/store/app.store';
  import {
    asideCollapsed,
    chosenItemDetails,
    geoSearchAutocompleteItems,
    geoSearchAutocompleteQuery, geoSearchAutosuggestItems, geoSearchAutosuggestQuery,
  } from './lib/store/app.store.js';
  import Button from './lib/button/Button.svelte';
  import Autocomplete from './lib/autocomplete/Autocomplete.svelte';
  import { markByPositions } from './lib/utils/highlight.js';
  import DOMPurify from 'dompurify';
  import Details from './lib/details/Details.svelte';
  import { HereResultTypeMap } from './lib/here-api/here-result-type.js';
  import { HereQueryResultType } from './lib/here-api/here-query-result-type.js';

  function toggleAsideButtonClick(event) {
    toggleAsideCollapsed();
  }

  function geoSearchAutocompleteChooseItem(ev: CustomEvent) {
    const {item} = ev.detail;
    chosenAutocompleteItem.next(item);
    geoSearchAutocompleteItems.next([]);
  }

  function geoSearchAutosuggestChooseItem(ev: CustomEvent) {
    const {item} = ev.detail;
    chosenAutosuggestItem.next(item);
    geoSearchAutosuggestItems.next([]);
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
            bind:value="{$geoSearchAutocompleteQuery}"
            items="{$geoSearchAutocompleteItems || []}"
            bindItemText="title"
            bindItemKey="id"
            on:chooseItem={geoSearchAutocompleteChooseItem}
            placeholder="Autocomplete address"
          >
            <svelte:fragment slot="itemTemplate" let:item={item}>
              <span class="material-symbols-rounded _fix_top_4">{HereResultTypeMap[item.resultType]?.icon}</span>
              {@html DOMPurify.sanitize(markByPositions(item.title, item.highlights?.title))}
            </svelte:fragment>
          </Autocomplete>
        </div>
        <div class="section-search">
          <Autocomplete
            bind:value="{$geoSearchAutosuggestQuery}"
            items="{$geoSearchAutosuggestItems || []}"
            bindItemText="title"
            bindItemKey="id"
            on:chooseItem={geoSearchAutosuggestChooseItem}
            placeholder="Autosuggest places"
          >
            <svelte:fragment slot="itemTemplate" let:item={item}>
              <div class="autosuggest-entity">
                {#if item.resultType === HereQueryResultType.categoryQuery}
                  <div class="autosuggest-entity_icon">
                    <span class="material-symbols-rounded _fix_top_4">category</span>
                  </div>
                  <div>
                    Search in
                    <b><q>{@html DOMPurify.sanitize(markByPositions(item.title, item.highlights?.title))}</q></b>
                  </div>
                {:else if item.resultType === HereQueryResultType.chainQuery}
                  <div class="autosuggest-entity_icon">
                    <span class="material-symbols-rounded _fix_top_4">clarify</span>
                  </div>
                  <div>
                    Continue with
                    <b><q>{@html DOMPurify.sanitize(markByPositions(item.title, item.highlights?.title))}</q></b>
                  </div>
                {:else}
                  <div class="autosuggest-entity_icon">
                    <span class="material-symbols-rounded _fix_top_4">{HereResultTypeMap[item.resultType]?.icon}</span>
                  </div>
                  <div>
                    {#if item.categories?.[0]}
                      <div class="autosuggest-entity_secondary-attr">
                        {item.categories[0].name}
                      </div>
                    {/if}
                    <div>{@html DOMPurify.sanitize(markByPositions(item.title, item.highlights?.title))}</div>
                    {#if item.address?.label}
                      <div class="autosuggest-entity_secondary-attr">
                        {item.address.label}
                      </div>
                    {/if}
                  </div>
                {/if}
              </div>
            </svelte:fragment>
          </Autocomplete>
        </div>
        {#if $chosenItemDetails}
          <div class="chosen-item">
            <Details data={$chosenItemDetails}></Details>
          </div>
        {/if}
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
    padding: 1rem 1rem 0.5rem 0;
  }

  .chosen-item {
    padding: 0.5rem 1rem 1rem 0;
  }

  ._fix_top_4 {
    position: relative;
    top: 4px;
  }

  .autosuggest-entity {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .autosuggest-entity_icon {
    flex-shrink: 0;
  }

  .autosuggest-entity_secondary-attr {
    font-size: small;
    color: var(--color-text-secondary);
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
