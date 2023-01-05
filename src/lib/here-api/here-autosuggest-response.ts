import type { HereAutosuggestQueryResultItem } from './here-autosuggest-query-result-item';
import type { HereAutosuggestEntityResultItem } from './here-autosuggest-entity-result-item';
import { HereQueryResultType } from './here-query-result-type';

export interface HereAutosuggestResponse {
  items: (HereAutosuggestQueryResultItem | HereAutosuggestEntityResultItem)[];
  queryTerms: {
    term: string;
    replaces: string;
    start: number;
    end: number;
  }[];
}

export function isQueryResult(
  item: HereAutosuggestQueryResultItem | HereAutosuggestEntityResultItem,
): item is HereAutosuggestQueryResultItem {
  if (item) {
    return [HereQueryResultType.categoryQuery, HereQueryResultType.chainQuery].includes(item.resultType as any);
  }
  return false;
}

export function isEntityResult(
  item: HereAutosuggestQueryResultItem | HereAutosuggestEntityResultItem,
): item is HereAutosuggestEntityResultItem {
  if (item) {
    return !isQueryResult(item);
  }
  return false;
}
