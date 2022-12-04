<script lang="ts">
  import * as L from 'leaflet';
  import { onMount } from 'svelte';

  let mapContainer: HTMLElement;
  let mapInstance: L.Map;

  onMount(() => {
    mapInstance = L.map(mapContainer, {
      attributionControl: true,
      inertia: true,
      zoomControl: false,
    }).setView([51.505, -0.09], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(mapInstance);
  });

</script>

<div class="map-ct" bind:this={mapContainer}></div>

<style>
  .map-ct {
    height: 100%;
  }
</style>