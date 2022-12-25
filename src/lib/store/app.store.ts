import { SvelteSubject } from '../utils/rx';
import { debounceTime, distinctUntilChanged, filter, map, of, switchMap, take, withLatestFrom } from 'rxjs';
import type { LatLng, LatLngBounds } from 'leaflet';
import type { HereAutocompleteResponse } from '../here-api/here-autocomplete-response';
import { hereAutocomplete, hereLookup } from '../here-api/here-service';
import type { HereLookupResponse } from '../here-api/here-lookup-response';

export const asideCollapsed = new SvelteSubject(true);

export function toggleAsideCollapsed() {
  asideCollapsed.pipe(
    take(1),
  ).subscribe((collapsed) => {
    asideCollapsed.next(!collapsed);
  });
}

export const mapBounds = new SvelteSubject<{ center: LatLng, zoom: number, bounds: LatLngBounds } | null>(null);

export const geoSearchQuery = new SvelteSubject<string | null>(null);

export const geoSearchAutocompleteItems = new SvelteSubject<HereAutocompleteResponse['items']>([]);

// wire up changes of autocomplete search field
geoSearchQuery.pipe(
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

export const chosenAutocompleteItem = new SvelteSubject<HereAutocompleteResponse['items'][number] | null>(null);

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
