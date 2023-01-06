<script lang="ts">

  import type { HereLookupResponse } from '../here-api/here-lookup-response';
  import { HereResultTypeMap } from '../here-api/here-result-type.js';
  import { chosenItemDetails } from '../store/app.store';

  export let data: HereLookupResponse | null = null;

  function handleTitleClick() {
    chosenItemDetails.next(data);
  }

  function mapWeblinks(dataLocal: HereLookupResponse | null) {
    const result: { label?: string, url: string }[] = [];
    if (dataLocal && dataLocal.contacts && dataLocal.contacts.length) {
      dataLocal.contacts.forEach((contact) => {
        if (contact.www) {
          contact.www.forEach((contactWww) => {
            result.push({
              label: contactWww.label,
              url: contactWww.value,
            });
          });
        }
      });
    }
    return result;
  }

  function mapOpeningHours(dataLocal: HereLookupResponse | null) {
    const result: string[] = [];
    if (dataLocal && dataLocal.openingHours && dataLocal.openingHours[0] && dataLocal.openingHours[0].text && dataLocal.openingHours[0].text.length) {
      return dataLocal.openingHours[0].text;
    }
    return result;
  }

  function mapFoodTypes(dataLocal: HereLookupResponse | null) {
    const result: string[] = [];
    if (dataLocal && dataLocal.foodTypes && dataLocal.foodTypes.length) {
      return data.foodTypes
        .map((foodType) => {
          return foodType.name;
        })
        .filter(typeOrEmpty => !!typeOrEmpty);
    }
    return result;
  }

  $: weblinks = mapWeblinks(data);
  $: openingHoursView = mapOpeningHours(data);
  $: foodTypesView = mapFoodTypes(data);

</script>


{#if data}
  <div class="details">
    <div class="details-attr">
      <div class="details-attr-name">
        {HereResultTypeMap[data.resultType].label}
      </div>
      <div class="details-attr-value">
        <a class="map-link" role="button" href="javascript:void 0" on:click={handleTitleClick}>
          {data.title}
        </a>
      </div>
    </div>
    {#if data.address && data.address.label && data.address.label !== data.title}
      <div class="details-attr">
        <div class="details-attr-name">
          Address:
        </div>
        <div class="details-attr-value">
          {data.address.label}
        </div>
      </div>
    {/if}
    {#if data.categories && data.categories.length}
      <div class="details-attr">
        <div class="details-attr-name">
          Categories:
        </div>
        <div class="details-attr-value badges">
          {#each data.categories as categ}
            <span class="badge">{categ.name}</span>
          {/each}
        </div>
      </div>
    {/if}
    {#if foodTypesView.length}
      <div class="details-attr">
        <div class="details-attr-name">
          Food types:
        </div>
        <div class="details-attr-value badges">
          {#each foodTypesView as foodType}
            <div class="badge">
              <span class="material-symbols-rounded attr-icon">restaurant</span>
              {foodType}
            </div>
          {/each}
        </div>
      </div>
    {/if}
    {#if openingHoursView.length}
      <div class="details-attr">
        <div class="details-attr-name">
          Opening hours:
        </div>
        <div class="details-attr-value opening-hours">
          {#each openingHoursView as openingHoursItem}
            <div>
              <span class="material-symbols-rounded attr-icon attr-icon-grayed">schedule</span>
              {openingHoursItem}
            </div>
          {/each}
        </div>
      </div>
    {/if}
    {#if weblinks.length}
      <div class="details-attr">
        <div class="details-attr-name">
          Links:
        </div>
        <div class="details-attr-value links">
          {#each weblinks as weblink}
            <div>
              <a target="_blank" rel="noopener noreferrer" href={weblink.url}>
                {weblink.label || weblink.url}
                <span class="material-symbols-rounded link-icon">open_in_new</span>
              </a>
            </div>
          {/each}
        </div>
      </div>
    {/if}
    {#if data.timeZone}
      <div class="details-attr">
        <div class="details-attr-name">
          Timezone:
        </div>
        <div class="details-attr-value">
          {data.timeZone.name}: {data.timeZone.utcOffset}
        </div>
      </div>
    {/if}
    {#if data.countryInfo}
      <div class="details-attr">
        <div class="details-attr-name">
          Country:
        </div>
        <div class="details-attr-value">
          {data.countryInfo.alpha2}
        </div>
      </div>
    {/if}
  </div>
{/if}


<style>
  .details {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .details-attr {
    display: flex;
    gap: 0.5rem;
    align-items: baseline;
  }

  .details-attr-name {
    width: 128px;
    flex-shrink: 0;
    text-align: end;
    font-size: small;
    color: var(--color-text-secondary);
  }

  .details-attr-value {
  }

  .badges {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
  }

  .badge {
    font-size: smaller;
    padding: 2px 4px;
    background-color: var(--color-accent-bg);
    border-radius: 4px;
    color: var(--color-accent-text);
  }

  .links {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }

  .link-icon {
    font-size: small;
    position: relative;
    top: 2px;
  }

  .opening-hours {
    display: flex;
    gap: 4px 16px;
    flex-wrap: wrap;
  }

  .attr-icon {
    font-size: small;
    position: relative;
    top: 1px;
  }

  .attr-icon-grayed {
    color: var(--color-text-secondary);
  }
</style>