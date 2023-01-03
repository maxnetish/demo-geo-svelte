export enum HereResultType {
    administrativeArea = 'administrativeArea',
    locality = 'locality',
    street = 'street',
    intersection = 'intersection',
    addressBlock = 'addressBlock',
    houseNumber = 'houseNumber',
    postalCodePoint = 'postalCodePoint',
    place = 'place',
}

export const HereResultTypeMap: Record<HereResultType, { icon: string; label: string; }> = {
  [HereResultType.addressBlock]: {
    icon: 'home',
    label: 'Address block',
  },
  [HereResultType.houseNumber]: {
    icon: 'house',
    label: 'House number',
  },
  [HereResultType.administrativeArea]: {
    icon: 'crop_square',
    label: 'Adminitrative area',
  },
  [HereResultType.intersection]: {
    icon: 'directions_car',
    label: 'Intersection',
  },
  [HereResultType.locality]: {
    icon: 'location_on',
    label: 'Locality',
  },
  [HereResultType.place]: {
    icon: 'home_pin',
    label: 'Place',
  },
  [HereResultType.postalCodePoint]: {
    icon: 'local_post_office',
    label: 'Postal code point',
  },
  [HereResultType.street]: {
    icon: 'directions_car',
    label: 'Street',
  },
}
