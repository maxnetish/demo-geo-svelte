import type { HereQueryResultType } from './here-query-result-type';
import type { HereResultType } from './here-result-type';
import type { HereHighlightRange } from './here-highlight-range';
import type { HereHouseNumberType } from './here-house-number-type';
import type { HereAddressBlockType } from './here-address-block-type';
import type { HereLocalityType } from './here-locality-type';
import type { HereAdministrativeAreaType } from './here-administrative-area-type';
import type { HereAddress } from './here-address';
import type { HerePosition } from './here-position';
import type { HereBoundingBox } from './here-bounding-box';
import type { HereCategory } from './here-category';
import type { HereContactType } from './here-contact-type';
import type { HereContact } from './here-contact';
import type { HereOpeningHours } from './here-opening-hours';
import type { HereTimezone } from './here-timezone';
import type { HerePhonemeType } from './here-phoneme-type';
import type { HerePhoneme } from './here-phoneme';
import type { HereStreetInfo } from './here-street-info';

export interface HereAutosuggestResponse {
  items: {
    title: string;
    id: string;
    resultType?: HereQueryResultType | HereResultType;
    /**
     * URL of the follow-up query
     */
    href?: string;
    highlights?: {
      title?: HereHighlightRange[];
    };
    politicalView?: string;
    ontologyId?: string;
    houseNumberType?: HereHouseNumberType;
    addressBlockType?: HereAddressBlockType;
    localityType?: HereLocalityType;
    administrativeAreaType?: HereAdministrativeAreaType;
    address?: HereAddress;
    position?: HerePosition;
    access?: HerePosition[];
    distance?: number;
    excursionDistance?: number;
    mapView?: HereBoundingBox;
    categories?: HereCategory[];
    chains?: { id: string }[];
    references?: {
      /**
       * Identifier of the place as provided by the supplier.
       */
      id: string;
      supplier: {
        /**
         * An identifier for the supplier.
         * "core" "yelp" "tripadvisor" "parkopedia" "venues" "vinfast" "ryd" "booking.com" "nsr"
         */
        id: string;
      }
    }[];
    foodTypes?: HereCategory[];
    contacts?: Partial<Record<HereContactType, HereContact[]>>[];
    openingHours?: HereOpeningHours[];
    timeZone?: HereTimezone;
    phonemes?: Partial<Record<HerePhonemeType, HerePhoneme[]>>;
    streetInfo?: HereStreetInfo[];
  }[];
  queryTerms: {
    term: string;
    replaces: string;
    start: number;
    end: number;
  }[];
}
