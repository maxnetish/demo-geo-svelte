import type { HereResultType } from './here-result-type';
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

/**
 * https://developer.here.com/documentation/geocoding-search-api/api-reference-swagger.html
 */
export interface HereLookupResponse {
  title: string;
  id: string;
  politicalView?: string;
  resultType?: HereResultType;
  houseNumberType?: HereHouseNumberType;
  addressBlockType?: HereAddressBlockType;
  localityType?: HereLocalityType;
  administrativeAreaType?: HereAdministrativeAreaType;
  houseNumberFallback?: boolean;
  address: HereAddress;
  /**
   * a representative geo-position (WGS 84) of the result.
   * this is to be used to display the result on a map
   */
  position: HerePosition;
  /**
   * the geo-position of the access to the result (for instance the entrance)
   */
  access?: HerePosition[];
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
  extended?: Record<string, any>;
  phonemes?: Partial<Record<HerePhonemeType, HerePhoneme[]>>;
  streetInfo?: HereStreetInfo[];
  countryInfo?: {
    alpha2?: string;
    alpha3?: string;
  };
}
