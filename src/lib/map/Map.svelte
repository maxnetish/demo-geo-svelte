<script lang="ts">
  import type { LatLngExpression } from 'leaflet';
  import * as L from 'leaflet';
  import { onDestroy, onMount } from 'svelte';
  import { debounceTime, fromEvent, map, merge, of, Subject, takeUntil } from 'rxjs';
  import { mapBounds } from '../store/app.store';

  const defaultCenter: LatLngExpression = [51.505, -0.09];
  const defaultZoom = 13;
  const unsubscribe$ = new Subject();
  const windowRef = window;

  let mapContainer: HTMLElement;
  let mapInstance: L.Map;

  onMount(() => {
    const stateFromStorage = (() => {
      try {
        return (windowRef
          ? JSON.parse(windowRef.localStorage.getItem('position'))
          : {}) || {};
      } catch (e) {
        return {};
      }
    })();
    const initialCenter = stateFromStorage.center || defaultCenter;
    const initialZoom = stateFromStorage.zoom || defaultZoom;

    mapInstance = L.map(mapContainer, {
      attributionControl: true,
      inertia: true,
      zoomControl: false,
    }).setView(initialCenter, initialZoom);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(mapInstance);

    merge(
      of({
        center: mapInstance.getCenter(),
        zoom: mapInstance.getZoom(),
        bounds: mapInstance.getBounds(),
      }),
      fromEvent(mapInstance, 'move').pipe(
        map(() => {
          return {
            center: mapInstance.getCenter(),
            zoom: mapInstance.getZoom(),
            bounds: mapInstance.getBounds(),
          }
        }),
        debounceTime(500),
        takeUntil(unsubscribe$),
      ),
    ).subscribe((state) => {
      mapBounds.next(state);
    });

    mapBounds.pipe(
      takeUntil(unsubscribe$),
    ).subscribe((state) => {
      if (windowRef) {
        windowRef.localStorage.setItem('position', JSON.stringify(state));
      }
    });
  });

  onDestroy(() => {
    unsubscribe$.next(null);
    unsubscribe$.complete();
  });

</script>

<div class="map-ct" bind:this={mapContainer}></div>

<style>
  .map-ct {
    height: 100%;
  }
</style>