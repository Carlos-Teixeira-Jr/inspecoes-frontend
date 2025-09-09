<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">Lista de Clientes</h2>

    <DataTable :value="clientes" dataKey="id" :expandedRows="expandedRows" @rowToggle="onRowToggle" :rows="limit"
      :totalRecords="total" :lazy="true" @page="onPageChange" responsiveLayout="scroll" class="shadow-lg">
      <!-- Coluna de expansão -->
      <Column expander style="width: 3em" />

      <Column field="nome" header="Nome" sortable />
      <Column field="endereco" header="Endereço" />
      <Column header="Total de Áreas">
        <template #body="slotProps">
          {{ areasCount(slotProps.data) }}
        </template>
      </Column>




      <!-- Slot de expansão -->
      <template #expansion="{ data: cliente }">
        <div class="p-4 space-y-4">
          <h3 class="text-lg font-semibold">Áreas do cliente</h3>
          <div v-for="area in cliente.areas" :key="area.id" class="border rounded p-4 bg-gray-50">
            <h4 class="font-semibold">{{ area.nome }}</h4>

            <h5 class="mt-2 font-medium">Equipamentos</h5>
            <DataTable :value="area.equipamentos" class="mt-2" showGridlines responsiveLayout="scroll">
              <Column field="nome" header="Nome" />
              <Column field="tipo" header="Tipo" />
              <Column header="Status da Atividade" :body="equipStatusTemplate" />
              <Column field="atividade.descricao" header="Descrição" />
              <Column field="atividade.data_proxima_inspecao" header="Próxima Inspeção" :body="formatDateTemplate" />
              <Column field="atividade.alerta" header="Alerta" :body="alertaTemplate" />
            </DataTable>
          </div>
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { DataTable, Column } from "primevue";
import type { Cliente } from "../types/customer.interface";
import { getClientes, ClientesResponse } from "../services/customers/customer.service";
import { Equipamento } from "../types/equipment.interface";

export default defineComponent({
  name: "Clientes",
  components: { DataTable, Column },
  setup() {
    const clientes = ref<Cliente[]>([]);
    const expandedRows = ref<any>({});
    const total = ref(0);
    const page = ref(1);
    const limit = ref(10);

    const loadClientes = async () => {
      try {
        const data: ClientesResponse = await getClientes(page.value, limit.value);
        clientes.value = data.customers;
        console.log("Clientes carregados:", clientes.value);
        total.value = data.total;
      } catch (err) {
        console.error(err);
      }
    };

    onMounted(() => {
      loadClientes();
    });

    const logAndReturnAreas = (cliente: Cliente) => {
      console.log("Cliente recebido em logAndReturnAreas:", cliente);
      const count = cliente.areas?.length ?? 0;
      console.log("Retornando:", count);
      return count;
    };


    const onPageChange = (event: any) => {
      page.value = event.page + 1; // PrimeVue usa zero-based
      limit.value = event.rows;
      loadClientes();
    };

    const onRowToggle = (event: any) => {
      expandedRows.value = event.data;
    };

    // Templates para colunas
    const coordBodyTemplate = (slotProps: { data: Cliente }) =>
      `${slotProps.data.latitude} / ${slotProps.data.longitude}`;


    const areasCount = (cliente: Cliente): number => {
      const count = cliente.areas?.length ?? 0;
      return count;
    };


    const equipStatusTemplate = (equip: Equipamento) =>
      equip.atividade?.status || "-";

    const formatDateTemplate = (equip: Equipamento) =>
      equip.atividade?.data_proxima_inspecao
        ? new Date(equip.atividade.data_proxima_inspecao).toLocaleDateString()
        : "-";

    const alertaTemplate = (equip: Equipamento) =>
      equip.atividade?.alerta || "-";

    return {
      clientes,
      expandedRows,
      total,
      page,
      limit,
      onPageChange,
      onRowToggle,
      coordBodyTemplate,
      areasCount,
      equipStatusTemplate,
      formatDateTemplate,
      alertaTemplate,
      logAndReturnAreas
    };
  },
});
</script>

<style scoped></style>
