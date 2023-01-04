import type { HerePosition } from './here-position';
import type { HereBoundingBox } from './here-bounding-box';

export interface HereAutosuggestRequest {
  /**
   *  Query string
   */
  q: string;
  /**
   * Specify the center of the search context expressed as coordinates.
   * [lat, lng].
   * One of "at", "in=circle" or "in=bbox" is required.
   */
  at?: [string, string];
  /**
   * Search within a geographic area.
   * One of "at", "in=circle" or "in=bbox" is required.
   */
  in?: { type: 'countryCode', codes: string[] }
    | { type: 'circle', center: HerePosition, radius: number }
    | { type: 'bbox', box: HereBoundingBox };
  /**
   * Maximum number of results to be returned.
   * 1...100, default 20
   */
  limit?: number;
  /**
   * BETA Select within a geographic corridor.
   * https://github.com/heremaps/flexible-polyline
   */
  route?: string;
  /**
   * Maximum number of Query Terms Suggestions to be returned.
   */
  termsLimit?: number;
  /**
   * Select the language to be used for result rendering from
   * a list of BCP 47 compliant language codes.
   */
  lang?: string[];
  /**
   * Toggle the political view.
   */
  politicalView?: string;
  /**
   * Select additional fields to be rendered in the response.
   */
  show?: Array<'countryInfo' | 'phonemes' | 'streetInfo' | 'tz'>;
}
