<template>
  <div class="p-2 pt-22">
    <h2 class="text-2xl font-bold mb-4 text-gray-200">Lista de Clientes</h2>

    <!-- Spinner aparece enquanto está carregando -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <ProgressSpinner />
    </div>

    <!-- Só renderiza tabela quando terminar de carregar -->
    <DataTable
      v-else
      :value="clientes"
      dataKey="id"
      :expandedRows="expandedRows"
      @rowToggle="onRowToggle"
      :rows="limit"
      :totalRecords="total"
      :lazy="true"
      @page="onPageChange"
      responsiveLayout="scroll"
      class="shadow-lg rounded"
    >
      <!-- Coluna de expansão -->
      <Column expander style="width: 3em" />

      <Column field="nome" header="Nome" />
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
          <div
            v-for="area in cliente.areas"
            :key="area.id"
            class="border rounded p-4 bg-gray-50"
          >
            <h4 class="font-semibold">{{ area.nome }}</h4>

            <h5 class="mt-2 font-medium">Equipamentos</h5>
            <DataTable
              :value="area.equipamentos"
              class="mt-2"
              showGridlines
              responsiveLayout="scroll"
            >
              <Column field="nome" header="Nome" />
              <Column field="tipo" header="Tipo" />
              <Column header="Status da Atividade">
                <template #body="slotProps">
                  <i
                    :class="statusIcon(equipStatusTemplate(slotProps.data))"
                    class="mr-2"
                  />
                  {{ equipStatusTemplate(slotProps.data) }}
                </template>
              </Column>
              <Column
                field="atividade.descricao"
                header="Descrição"
              />
              <Column
                field="atividade.data_proxima_inspecao"
                header="Próxima Inspeção"
              >
                <template #body="slotProps">
                  {{ formatDateTemplate(slotProps.data) }}
                </template>
              </Column>
              <Column field="atividade.alerta" header="Alerta">
                <template #body="slotProps">
                  {{ alertaTemplate(slotProps.data) }}
                </template>
              </Column>
            </DataTable>
          </div>
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { DataTable, Column, ProgressSpinner } from "primevue";
import type { Cliente } from "../types/customer.interface";
import { getClientes, ClientesResponse } from "../services/customers/customer.service";
import { Equipamento } from "../types/equipment.interface";
import { statusIcon } from "../utils/status.util";

export default defineComponent({
  name: "Clientes",
  components: { DataTable, Column, ProgressSpinner },
  setup() {
    const clientes = ref<Cliente[]>([]);
    const expandedRows = ref<any>({});
    const total = ref(0);
    const page = ref(1);
    const limit = ref(10);
    const loading = ref(true); // 🔥 estado de loading

    const loadClientes = async () => {
      loading.value = true;
      try {
        const data: ClientesResponse = await getClientes(page.value, limit.value);
        clientes.value = data.customers;
        total.value = data.total;
      } catch (err) {
        console.error(err);
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      loadClientes();
    });

    const onPageChange = (event: any) => {
      page.value = event.page + 1;
      limit.value = event.rows;
      loadClientes();
    };

    const onRowToggle = (event: any) => {
      expandedRows.value = event.data;
    };

    const areasCount = (cliente: Cliente): number =>
      cliente.areas?.length ?? 0;

    const equipStatusTemplate = (equip: Equipamento) =>
      equip.atividade.alerta === "Atraso > 7 dias"
        ? "atrasada"
        : equip.atividade.alerta !== "Atraso > 7 dias" && equip.atividade.status
        ? equip.atividade.status
        : null;

    const formatDateTemplate = (equip: Equipamento) =>
      equip.atividade?.data_proxima_inspecao
        ? new Date(equip.atividade.data_proxima_inspecao).toLocaleDateString()
        : "-";

    const alertaTemplate = (equip: Equipamento) =>
      equip.atividade?.alerta || "---";

    return {
      clientes,
      expandedRows,
      total,
      page,
      limit,
      loading, // ✅ exporta o estado
      statusIcon,
      onPageChange,
      onRowToggle,
      areasCount,
      equipStatusTemplate,
      formatDateTemplate,
      alertaTemplate
    };
  },
});
</script>
