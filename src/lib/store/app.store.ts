import { SvelteSubject } from '../utils/rx';
import { debounceTime, map, Observable, of, switchMap, take, withLatestFrom } from 'rxjs';
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

export const geoSearchAutocompleteItems: Observable<HereAutocompleteResponse['items']> = geoSearchQuery.pipe(
  debounceTime(1000),
  withLatestFrom(mapBounds),
  switchMap(([query, mapBounds]) => {
    if(query && query.length) {
      return fromFetch<HereAutocompleteResponse>(
        `/autocomplete.search.hereapi.com/v1/autocomplete?q=${query}&limit=10&at=${mapBounds.center.lat},${mapBounds.center.lng}`,
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
)