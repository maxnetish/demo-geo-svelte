import type { HereCategory } from './here-category';

export interface HereContact {
  /**
   * Optional label for the contact string, such as "Customer Service" or "Pharmacy Fax".
   */
  label?: string;
  value: string;
  categories?: HereCategory[]
}
