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

export interface HereAutosuggestEntityResultItem {
  title: string;
  id: string;
  resultType: HereResultType;
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
    };
  };
}
