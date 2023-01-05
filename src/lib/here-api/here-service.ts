import type { HereAutocompleteRequest } from './here-autocomplete-request';
import { of } from 'rxjs';
import type { HereAutocompleteResponse } from './here-autocomplete-response';
import { fromFetch } from 'rxjs/internal/observable/dom/fetch';
import { stringify } from 'qs';
import type { IStringifyOptions } from 'qs';
import type { HereLookupRequest } from './here-lookup-request';
import type { HereLookupResponse } from './here-lookup-response';
import type { HereAutosuggestRequest } from './here-autosuggest-request';
import type { HereAutosuggestResponse } from './here-autosuggest-response';

const qsStringifyOptions = Object.freeze({
  addQueryPrefix: true,
  arrayFormat: 'comma',
} as IStringifyOptions);

export function hereAutosuggest(request: HereAutosuggestRequest) {
  let inSerialized: string | undefined = undefined;
  switch (request.in?.type) {
    case 'countryCode': {
      inSerialized = `countryCode:${request.in.codes.join(',')}`;
      break;
    }
    case 'circle': {
      inSerialized = `circle:${[request.in.center.lat, request.in.center.lng].join(',')};r=${request.in.radius}`;
      break;
    }
    case 'bbox': {
      inSerialized = `bbox:${[request.in.box.west, request.in.box.south, request.in.box.east, request.in.box.north].join(',')}`;
      break;
    }
  }

  const requestWithSerializedIn = {
    ...request,
    in: inSerialized,
  };

  const queryString = stringify(requestWithSerializedIn, qsStringifyOptions);

  return fromFetch<HereAutosuggestResponse>(
    `/autosuggest.search.hereapi.com/v1/autosuggest${queryString}`,
    {
      method: 'GET',
      selector: (response) => {
        if (response.ok) {
          return response.json();
        }
        return of({
            items: [],
            queryTerms: [],
          } as HereAutosuggestResponse,
        );
      },
    },
  );
}

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

export function hereAutosuggestFollowUp(followUpUrl: string) {

  const url = new URL(followUpUrl);
  const realUrl = `/autosuggest.search.hereapi.com${url.pathname}${url.search}`;

  return fromFetch<HereAutosuggestResponse>(
    realUrl,
    {
      method: 'GET',
      selector: (response) => {
        if (response.ok) {
          return response.json();
        }
        return of({
            items: [],
            queryTerms: [],
          } as HereAutosuggestResponse,
        );
      },
    },
  );
}
