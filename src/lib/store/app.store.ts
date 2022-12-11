import { SvelteSubject } from '../utils/rx';
import { take } from 'rxjs';
import type { LatLng, LatLngBounds } from 'leaflet';

export const asideCollapsed = new SvelteSubject(true);

export function toggleAsideCollapsed() {
  asideCollapsed.pipe(
    take(1),
  ).subscribe((collapsed) => {
    asideCollapsed.next(!collapsed);
  });
};

export const mapBounds = new SvelteSubject<{center: LatLng, zoom: number, bounds: LatLngBounds} | null>(null);
