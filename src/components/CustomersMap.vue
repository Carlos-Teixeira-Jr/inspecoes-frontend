<template>
  <div id="map" class="h-96 w-full">
</div>
</template>

<script setup lang="ts">
import { onMounted, watch, ref } from 'vue';
import L from 'leaflet';
import type { Cliente } from '@/types/customer.interface';

interface Props {
  clientes: Cliente[];
}

const props = defineProps<Props>();
const map = ref<L.Map | null>(null);

function addMarkers() {
  if (!map.value) return;

  props.clientes.forEach(cliente => {
    if (cliente.latitude && cliente.longitude) {
      const marker = L.marker([cliente.latitude, cliente.longitude])
        .bindPopup(`<b>${cliente.nome}</b><br>${cliente.endereco}`);
      marker.addTo(map.value as L.Map);
    }
  });
}

onMounted(() => {
  map.value = L.map('map').setView([-23.561142, -46.6579], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(map.value as L.Map);

  addMarkers();
});

watch(
  () => props.clientes,
  () => {
    if (!map.value) return;

    map.value.eachLayer((layer: L.Layer) => {
      if (layer instanceof L.Marker) {
        map.value?.removeLayer(layer);
      }
    });

    addMarkers();
  }
);
</script>


<style scoped>
#map {
  border-radius: 0.5rem;
}
</style>
