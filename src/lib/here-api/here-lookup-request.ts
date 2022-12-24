/**
 * HERE Geocoding & Search API  v7
 * See https://developer.here.com/documentation/geocoding-search-api/api-reference-swagger.html
 */
export interface HereLookupRequest {
  /**
   * HERE object id, required
   */
  id: string;
  /**
   * Select the language to be used for result rendering from a list of BCP 47 compliant language codes.
   */
  lang?: string[];
  /**
   * Toggle the political view.
   * This parameter accepts single ISO 3166-1 alpha-3 country code.
   * The country codes are to be provided in all uppercase.
   * Exampple: "RUS" expressing the Russian view on Crimea
   */
  politicalView?: string;
  /**
   * Select additional fields to be rendered in the response.
   */
  show?: Array<'countryInfo' | 'phonemes' | 'streetInfo' | 'tz'>;
}