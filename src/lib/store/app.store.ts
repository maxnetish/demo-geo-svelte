import { SvelteSubject } from '../utils/rx';
import { debounceTime, distinctUntilChanged, filter, map, of, switchMap, take, withLatestFrom } from 'rxjs';
import type { LatLng, LatLngBounds } from 'leaflet';
import type { HereAutocompleteResponse } from '../here-api/here-autocomplete-response';
import { hereAutocomplete, hereAutosuggest, hereAutosuggestFollowUp, hereLookup } from '../here-api/here-service';
import type { HereLookupResponse } from '../here-api/here-lookup-response';
import type { HereAutosuggestResponse } from '../here-api/here-autosuggest-response';
import { isEntityResult, isQueryResult } from '../here-api/here-autosuggest-response';

function isAutosuggestResponse(value: HereAutosuggestResponse | HereLookupResponse): value is HereAutosuggestResponse {
  if (value) {
    return !!(value as any).items;
  }
  return false;
}

function isLookupResponse(value: HereAutosuggestResponse | HereLookupResponse): value is HereLookupResponse {
  if (value) {
    return !!(value as any).id;
  }
  return false;
}

export const asideCollapsed = new SvelteSubject(true);

export function toggleAsideCollapsed() {
  asideCollapsed.pipe(
    take(1),
  ).subscribe((collapsed) => {
    asideCollapsed.next(!collapsed);
  });
}

export const mapBounds = new SvelteSubject<{ center: LatLng, zoom: number, bounds: LatLngBounds } | null>(null);

export const geoSearchAutocompleteQuery = new SvelteSubject<string | null>(null);

export const geoSearchAutocompleteItems = new SvelteSubject<HereAutocompleteResponse['items']>([]);

export const geoSearchAutosuggestQuery = new SvelteSubject<string | null>(null);

export const geoSearchAutosuggestItems = new SvelteSubject<HereAutosuggestResponse['items']>([]);

// wire up changes of autocomplete search field
geoSearchAutocompleteQuery.pipe(
  debounceTime(500),
  distinctUntilChanged(),
  withLatestFrom(mapBounds),
  switchMap(([query, mapBounds]) => {
    if (query && query.length) {
      return hereAutocomplete({
        q: query,
        limit: 16,
        at: [mapBounds.center.lat, mapBounds.center.lng],
      });
    }
    return of({items: []} as HereAutocompleteResponse);
  }),
  map((response) => {
    return response.items;
  }),
).subscribe((autocompleteItems) => {
  geoSearchAutocompleteItems.next(autocompleteItems);
});

// Wire up changes in autosuggest search field
geoSearchAutosuggestQuery.pipe(
  debounceTime(250),
  distinctUntilChanged(),
  withLatestFrom(mapBounds),
  switchMap(([query, mapBounds]) => {
    if (query && query.length) {
      return hereAutosuggest({
        q: query,
        limit: 16,
        in: {
          type: 'bbox',
          box: {
            north: mapBounds.bounds.getNorth(),
            east: mapBounds.bounds.getEast(),
            south: mapBounds.bounds.getSouth(),
            west: mapBounds.bounds.getWest(),
          },
        },
      });
    }
    return of({items: [], queryTerms: []} as HereAutosuggestResponse);
  }),
).subscribe((response) => {
  geoSearchAutosuggestItems.next(response.items);
});

export const chosenAutocompleteItem = new SvelteSubject<HereAutocompleteResponse['items'][number] | null>(null);

export const chosenAutosuggestItem = new SvelteSubject<HereAutosuggestResponse['items'][number] | null>(null);

export const chosenItemDetails = new SvelteSubject<HereLookupResponse | null>(null);

chosenAutocompleteItem.pipe(
  switchMap((autocompleteItemOrNull) => {
    if (autocompleteItemOrNull) {
      return hereLookup({
        id: autocompleteItemOrNull.id,
        show: ['tz', 'streetInfo', 'countryInfo'],
      });
    }
    return of(null);
  }),
).subscribe((details) => {
  chosenItemDetails.next(details);
});


chosenAutosuggestItem.pipe(
  switchMap((autosuggestItemOrNull) => {
    if (autosuggestItemOrNull) {
      if (isQueryResult(autosuggestItemOrNull)) {
        return hereAutosuggestFollowUp(autosuggestItemOrNull.href);
      } else if (isEntityResult(autosuggestItemOrNull)) {
        return hereLookup({
          id: autosuggestItemOrNull.id,
          show: ['tz', 'streetInfo', 'countryInfo'],
        });
      }
    }
    return of(null);
  }),
).subscribe((detailsOrChainResults) => {
  if (isLookupResponse(detailsOrChainResults)) {
    chosenItemDetails.next(detailsOrChainResults);
  } else if (isAutosuggestResponse(detailsOrChainResults)) {
    geoSearchAutosuggestItems.next(detailsOrChainResults.items);
  }
});
