/**
 * HERE Geocoding & Search API  v7
 * See https://developer.here.com/documentation/geocoding-search-api/api-reference-swagger.html
 */
import type { HereResultType } from './here-result-type';
import type { HereHouseNumberType } from './here-house-number-type';
import type { HereLocalityTypes } from './here-locality-types';
import type { HereAdministrativeAreaType } from './here-administrative-area-type';
import type { HereAddress } from './here-address';
import type { HereHighlightRange } from './here-highlight-range';
import type { HereStreetInfo } from './here-street-info';

/**
 * https://developer.here.com/documentation/geocoding-search-api/api-reference-swagger.html
 */
export interface HereAutocompleteResponse {
    items: {
        title: string;
        id: string;
        language?: string;
        politicalView?: string;
        resultType?: HereResultType;
        houseNumberType?: HereHouseNumberType;
        localityType?: HereLocalityTypes;
        administrativeAreaType?: HereAdministrativeAreaType;
        address: HereAddress;
        distance?: number;
        highlights?: {
            title?: HereHighlightRange[];
        };
        streetInfo?: HereStreetInfo[];
    }[];
}
