<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold text-blue-600 mb-4">Dashboard</h1>

    <!-- Cards de resumo -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card v-for="(item, index) in resumo" :key="index" class="shadow-lg">
        <template #title>{{ item.titulo }}</template>
        <template #content>
          <p class="text-2xl font-bold m-0">{{ item.valor }}</p>
        </template>
      </Card>
    </div>

    <!-- Tabela de alertas -->
    <div class="bg-white shadow rounded p-4 mt-6">
      <h2 class="text-xl font-semibold mb-2">Alertas</h2>
      <DataTable :value="alertas" tableStyle="min-width: 50rem">
        <Column field="cliente" header="Cliente" />
        <Column field="tipo" header="Tipo" />
        <Column field="data" header="Data" />
        <Column field="status" header="Status" />
      </DataTable>
    </div>

    <!-- Lista de próximas inspeções -->
    <div class="bg-white shadow rounded p-4 mt-6">
      <h2 class="text-xl font-semibold mb-2">Próximas Inspeções</h2>
      <Listbox v-model="selectedInspecao" :options="proximasInspecoes" optionLabel="label" class="w-full md:w-96" />
    </div>
  </div>

  <!-- Mapa com clientes -->
  <div class="bg-white shadow rounded p-4 mt-6">
    <h2 class="text-xl font-semibold mb-2">Mapa de Clientes</h2>
    <CustomersMap />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Card from 'primevue/card';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Listbox from 'primevue/listbox';
import CustomersMap from '../components/CustomersMap.vue';

export default defineComponent({
  name: 'Dashboard',
  components: { Card, Button, DataTable, Column, Listbox, CustomersMap },
  setup() {
    const resumo = ref([
      { titulo: 'Clientes', valor: 128 },
      { titulo: 'Atividades', valor: 54 },
      { titulo: 'Equipamentos', valor: 32 },
      { titulo: 'Relatórios', valor: 12 },
    ]);

    const alertas = ref([
      { cliente: 'Cliente A', tipo: 'Atrasado', data: '2025-09-01', status: 'Crítico' },
      { cliente: 'Cliente B', tipo: 'Pendente', data: '2025-09-02', status: 'Alerta' },
      { cliente: 'Cliente C', tipo: 'Concluído', data: '2025-09-03', status: 'Normal' },
    ]);

    const proximasInspecoes = ref([
      { label: 'Inspeção Cliente A - 2025-09-05', value: 1 },
      { label: 'Inspeção Cliente B - 2025-09-06', value: 2 },
      { label: 'Inspeção Cliente C - 2025-09-07', value: 3 },
    ]);
    const selectedInspecao = ref(null);

    return { resumo, alertas, proximasInspecoes, selectedInspecao };
  }
});
</script>
