import type { HereCategory } from './here-category';

export interface HereOpeningHours {
  categories?: HereCategory[];
  text: string;
  isOpen?: boolean;
  structured: {
    /**
     * String with a modified iCalendar DATE-TIME value.
     * The date part is omitted, values starts with
     * the time section maker "T". Example: T132000
     */
    start: string;
    /**
     * String with an iCalendar DURATION value. A closed day has the value PT00:00M
     */
    duration: string;
    /**
     * String with a RECUR rule. Note that, in contrast to the RFC,
     * the assignment operator is a colon : and not an equal sign =.
     */
    recurence: string;
  }[];
}