<script lang="ts">

  import type { HereLookupResponse } from '../here-api/here-lookup-response';
  import { HereResultTypeMap } from '../here-api/here-result-type.js';
  import { chosenItemDetails } from '../store/app.store';

  export let data: HereLookupResponse | null = null;

  function handleTitleClick() {
    chosenItemDetails.next(data);
  }

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
</style>