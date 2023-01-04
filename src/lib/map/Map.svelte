<script lang="ts">
  import type { LatLngExpression, MarkerOptions } from 'leaflet';
  import * as L from 'leaflet';
  import { onDestroy, onMount } from 'svelte';
  import { debounceTime, filter, fromEvent, map, merge, of, Subject, takeUntil } from 'rxjs';
  import { chosenItemDetails, mapBounds } from '../store/app.store';
  import { LatLngBounds } from 'leaflet';
  import type { HereLookupResponse } from '../here-api/here-lookup-response';

  const defaultCenter: LatLngExpression = [51.505, -0.09];
  const defaultZoom = 13;
  const unsubscribe$ = new Subject();
  const windowRef = window;
  const chosenItemMarkerOptions: MarkerOptions = {
    opacity: 0.5,
  }
  let chosenItemMarker: L.Marker | null = null;

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
    L.tileLayer(
      'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      // 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        detectRetina: false,
        // attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      },
    ).addTo(mapInstance);
    L.control.scale({
      metric: true,
      imperial: false,
      updateWhenIdle: true,
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

    // track chosen item to set bounds
    chosenItemDetails.pipe(
      takeUntil(unsubscribe$),
      filter(() => {
        return !!mapInstance;
      }),
      filter((details) => {
        return !!details;
      }),
    ).subscribe((details: HereLookupResponse) => {
      if (details.mapView) {
        const leafletBounds = new LatLngBounds(
          [details.mapView.south, details.mapView.west],
          [details.mapView.north, details.mapView.east],
        );
        mapInstance.flyToBounds(leafletBounds);
      } else {
        mapInstance.flyTo([details.position.lat, details.position.lng], 16);
      }
    });

    // tracj chosen item to set marker (or remove)
    chosenItemDetails.pipe(
      takeUntil(unsubscribe$),
      filter(() => !!mapInstance),
    ).subscribe((details: HereLookupResponse | null) => {
      if (chosenItemMarker) {
        chosenItemMarker.remove();
      }
      if (details) {
        chosenItemMarker = L.marker([details.position.lat, details.position.lng], {
          ...chosenItemMarkerOptions,
          title: details.title,
        });
        chosenItemMarker.addTo(mapInstance);
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