import type { HereQueryResultType } from './here-query-result-type';
import type { HereHighlightRange } from './here-highlight-range';

export interface HereAutosuggestQueryResultItem {
  title: string;
  id: string;
  resultType: HereQueryResultType;
  /**
   * URL of the follow-up query
   */
  href: string;
  highlights?: {
    title?: HereHighlightRange[];
  }
}
