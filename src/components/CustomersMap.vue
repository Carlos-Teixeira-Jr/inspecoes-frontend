<template>
  <div ref="mapContainer" class="w-full h-96 rounded shadow"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default defineComponent({
  name: 'CustomersMap',
  setup() {
    const mapContainer = ref<HTMLDivElement | null>(null);

    const clientes = [
      { nome: 'Cliente A', lat: -23.55052, lng: -46.633308 },
      { nome: 'Cliente B', lat: -22.906847, lng: -43.172896 },
      { nome: 'Cliente C', lat: -19.92083, lng: -43.93778 },
    ];

    onMounted(() => {
      if (mapContainer.value) {
        const map = L.map(mapContainer.value).setView([-23.55, -46.63], 5);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        clientes.forEach(cliente => {
          L.marker([cliente.lat, cliente.lng])
            .addTo(map)
            .bindPopup(cliente.nome);
        });
      }
    });

    return { mapContainer };
  }
});
</script>
