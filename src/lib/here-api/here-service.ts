import type { HereAutocompleteRequest } from './here-autocomplete-request';
import { of } from 'rxjs';
import type { HereAutocompleteResponse } from './here-autocomplete-response';
import { fromFetch } from 'rxjs/internal/observable/dom/fetch';
import { stringify } from 'qs';

export function hereAutocomplete(request: HereAutocompleteRequest) {

  const queryString = stringify(request, {
    addQueryPrefix: true,
    arrayFormat: 'comma',
  });

  return fromFetch<HereAutocompleteResponse>(
    `/autocomplete.search.hereapi.com/v1/autocomplete${queryString}`,
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