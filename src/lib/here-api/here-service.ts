import type { HereAutocompleteRequest } from './here-autocomplete-request';
import { of } from 'rxjs';
import type { HereAutocompleteResponse } from './here-autocomplete-response';
import { fromFetch } from 'rxjs/internal/observable/dom/fetch';
import { stringify } from 'qs';
import type { IStringifyOptions } from 'qs';
import type { HereLookupRequest } from './here-lookup-request';
import type { HereLookupResponse } from './here-lookup-response';

const qsStringifyOptions = Object.freeze({
  addQueryPrefix: true,
  arrayFormat: 'comma',
} as IStringifyOptions);

export function hereAutocomplete(request: HereAutocompleteRequest) {

  const queryString = stringify(request, qsStringifyOptions);

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
          } as HereAutocompleteResponse,
        );
      },
    },
  );
}

export function hereLookup(request: HereLookupRequest) {
  const queryString = stringify(request, qsStringifyOptions);

  return fromFetch<HereLookupResponse>(
    `/lookup.search.hereapi.com/v1/lookup${queryString}`,
    {
      method: 'GET',
      selector: (response) => {
        if (response.ok) {
          return response.json();
        }
        return of(null);
      },
    },
  );
}