<script lang="ts">

  import type { HereLookupResponse } from '../here-api/here-lookup-response';

  export let data: HereLookupResponse | null = null;

</script>


{#if data}
  <div class="details">
    <div class="details-attr">
      <div class="details-attr-name">
        {data.resultType}:
      </div>
      <div class="details-attr-value">
        {data.title}
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
    width: 96px;
    flex-shrink: 0;
    text-align: end;
    font-size: small;
    color: var(--color-text-secondary);
  }

  .details-attr-value {
  }
</style>