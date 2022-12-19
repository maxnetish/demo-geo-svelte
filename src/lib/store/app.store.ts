import { SvelteSubject } from '../utils/rx';
import { debounceTime, distinctUntilChanged, map, Observable, of, switchMap, take, withLatestFrom } from 'rxjs';
import type { LatLng, LatLngBounds } from 'leaflet';
import { fromFetch } from 'rxjs/internal/observable/dom/fetch';
import type { HereAutocompleteResponse } from '../here-api/here-autocomplete-response';

export const asideCollapsed = new SvelteSubject(true);

export function toggleAsideCollapsed() {
  asideCollapsed.pipe(
    take(1),
  ).subscribe((collapsed) => {
    asideCollapsed.next(!collapsed);
  });
};

export const mapBounds = new SvelteSubject<{center: LatLng, zoom: number, bounds: LatLngBounds} | null>(null);

export const geoSearchQuery = new SvelteSubject<string | null>(null);

export const geoSearchAutocompleteItems = new SvelteSubject<HereAutocompleteResponse['items']>([]);

// wire up changes of autocomplete search field
geoSearchQuery.pipe(
  debounceTime(500),
  distinctUntilChanged(),
  withLatestFrom(mapBounds),
  switchMap(([query, mapBounds]) => {
    if(query && query.length) {
      return fromFetch<HereAutocompleteResponse>(
        `/autocomplete.search.hereapi.com/v1/autocomplete?q=${encodeURI(query)}&limit=16&at=${mapBounds.center.lat},${mapBounds.center.lng}`,
        {
          method: 'GET',
          selector: (response) => {
            if (response.ok) {
              return response.json();
            }
            return of({
                items: [],
              } as HereAutocompleteResponse
            );
          },
        }
      );
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
