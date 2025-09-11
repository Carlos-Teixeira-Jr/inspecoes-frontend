<template>
  <div class="md:p-6 p-2 mt-15">


    <!-- Spinner global -->
    <div v-if="loadingDashboard" class="flex justify-center items-center h-96">
      <ProgressSpinner />
    </div>

    <!-- Conteúdo só aparece depois do carregamento -->
    <div v-else>
      <div class="flex flex-col md:flex-row gap-6 w-full">
        <div class="flex flex-col gap-6 w-full justify-around">
          <div class="flex flex-col gap-3 w-full mt-5 md:mt-3">
                <h1 class="text-5xl font-bold text-gray-200 mb-4">Dashboard</h1>
            <!-- Cards de resumo -->
            <div class="grid grid-cols-4 gap-1 md:gap-4 w-fit">
              <Card v-for="(item, index) in resumo" :key="index"
                class="shadow-lg h-fit flex items-center justify-center">
                <template #title>{{ item.titulo }}</template>
                <template #content>
                  <p class="md:text-2xl font-bold m-0 text-center">
                    {{ item.valor }}
                  </p>
                </template>
              </Card>
            </div>

            <div class="grid grid-cols-3 xl:grid-cols-4 gap-4 w-full md:mt-6">
              <Card v-for="(item, index) in inspecoesResumo" :key="index"
                class="cursor-pointer shadow-lg hover:!shadow-xl rounded-2xl border border-white/20 flex w-full items-center justify-center"
                :style="{ '--p-card-body-padding': '10px' }" @click="
                  toggleFiltro(
                    item.titulo === 'pendentes'
                      ? 'pendente'
                      : item.titulo === 'concluídas'
                        ? 'concluida'
                        : 'atrasada'
                  )
                  ">
                <template #title>{{ item.titulo }}</template>
                <template #content>
                  <p :class="`text-2xl font-bold text-center ${item.color === 'green'
                    ? 'text-green-600'
                    : item.color === 'red'
                      ? 'text-red-600'
                      : 'text-yellow-600'
                    }`">
                    {{ item.valor }}
                  </p>
                </template>
              </Card>
            </div>
          </div>
        </div>
        <!-- Lista de próximas inspeções -->
        <div class="bg-white shadow rounded p-4 w-full max-w-[600px] self-start">
          <h2 class="text-xl font-semibold mb-2">Próximas Inspeções</h2>
          <Listbox v-model="selectedInspecao" :options="pagedInspecoes" optionLabel="label" class="w-full" />
        </div>
      </div>

      <!-- Tabela de alertas -->
      <div class="bg-white shadow rounded md:p-4 p-2 mt-6">
        <h2 class="text-xl font-semibold mb-2">Alertas</h2>
        <DataTable :value="alertsStore.alerts" :paginator="true" :rows="alertsStore.limit"
          :totalRecords="alertsStore.total" :loading="alertsStore.loading" @page="onPageChange" :lazy="true">
          <Column field="cliente" header="Cliente" />
          <Column field="tipo" header="Tipo" />
          <Column field="data" header="Data" />
          <Column field="status" header="Status">
            <template #body="slotProps">
              <div class="flex items-center gap-2">
                <i :class="statusIcon(slotProps.data.alerta !== 'Atraso > 7 dias' ? slotProps.data.status : 'atrasada')"></i>
                 <span :class="`${slotProps.data.status === 'pendente' && slotProps.data.alerta !== 'Atraso > 7 dias'
                  ? 'text-yellow-600'
                  : slotProps.data.status === 'concluida' && slotProps.data.alerta !== 'Atraso > 7 dias'
                    ? 'text-green-600'
                    : 'text-red-600'
                  } font-semibold`">
                  {{ slotProps.data.alerta !== 'Atraso > 7 dias' ? slotProps.data.status : 'atrasada' }}
                </span>
              </div>
            </template>
          </Column>
        </DataTable>
      </div>

      <!-- Mapa com clientes -->
      <div class="bg-white shadow rounded p-4 mt-6">
        <h2 class="text-xl font-semibold mb-2">Mapa de Clientes</h2>
        <CustomersMap :clientes="clientesStore.clientes" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import Card from "primevue/card";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Listbox from "primevue/listbox";
import ProgressSpinner from "primevue/progressspinner";
import CustomersMap from "../components/CustomersMap.vue";
import { statusIcon } from "../utils/status.util";
import { formatDateBR } from "../utils/datFormatter.util";

// Stores
import { useClientesStore } from "../stores/customers.store";
import { useAlertsStore } from "../stores/alerts.store";

const clientesStore = useClientesStore();
const alertsStore = useAlertsStore();

// refs do store (mantém reatividade sem precisar usar store.variavel)
const { clientes, total, loading } = storeToRefs(clientesStore);
const { alerts, total: totalAlertas, loading: alertasLoading } = storeToRefs(alertsStore);

// dashboard states
const loadingDashboard = ref(true);
const filtroInspecao = ref<"pendente" | "concluida" | "atrasada" | null>(null);
const pageSize = ref(5);
const currentPageLB = ref(1);

const resumo = ref([
  { titulo: "Clientes", valor: 0 },
  { titulo: "Atividades", valor: 0 },
  { titulo: "Equipamentos", valor: 0 },
  { titulo: "Relatórios", valor: 0 },
]);

const inspecoesResumo = ref([
  { titulo: "pendentes", valor: 0, color: "yellow" },
  { titulo: "concluídas", valor: 0, color: "green" },
  { titulo: "atrasadas", valor: 0, color: "red" },
]);

const proximasInspecoes = ref<any[]>([]);
const selectedInspecao = ref(null);

const pagedInspecoes = computed(() => {
  const start = (currentPageLB.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return proximasInspecoes.value.slice(start, end);
});

function toggleFiltro(filtro: "pendente" | "concluida" | "atrasada") {
  const novoFiltro = filtroInspecao.value === filtro ? null : filtro;
  filtroInspecao.value = novoFiltro;
  alertsStore.fetchAlerts(1, alertsStore.limit, novoFiltro);
}

function onPageChange(event: any) {
  alertsStore.fetchAlerts(event.page + 1, event.rows, filtroInspecao.value);
}

onMounted(async () => {
  try {
    await Promise.all([
      clientesStore.fetchClientes(),
      alertsStore.fetchAlerts(),
    ]);

    // Atualiza os cards do resumo com base nos clientes
    resumo.value[0].valor = total.value;

    resumo.value[1].valor = clientes.value.reduce(
      (acc, c) =>
        acc +
        (c.areas?.reduce(
          (aAcc, a) =>
            aAcc +
            (a.equipamentos?.reduce(
              (eqAcc, e) => eqAcc + (e.atividade ? 1 : 0),
              0
            ) ?? 0),
          0
        ) ?? 0),
      0
    );

    resumo.value[2].valor = clientes.value.reduce(
      (acc, c) =>
        acc +
        (c.areas?.reduce(
          (aAcc, a) => aAcc + (a.equipamentos?.length ?? 0),
          0
        ) ?? 0),
      0
    );

    // Próximas inspeções
    proximasInspecoes.value = clientes.value.flatMap((c) =>
      c.areas.flatMap((a) =>
        a.equipamentos.flatMap((eq) =>
          eq.atividade
            ? [
              {
                label: `Inspeção ${c.nome} - ${eq.tipo} - ${formatDateBR(eq.atividade.data_proxima_inspecao) ?? "-"
                  }`,
                value: eq.atividade.id,
              },
            ]
            : []
        )
      )
    );

    // Pendentes, concluídas, atrasadas
    const pendentes = clientes.value.flatMap((c) =>
      c.areas.flatMap((a) =>
        a.equipamentos.filter(
          (e) => e.atividade && e.atividade.status === "pendente"
        )
      )
    );
    const concluidas = clientes.value.flatMap((c) =>
      c.areas.flatMap((a) =>
        a.equipamentos.filter(
          (e) => e.atividade && e.atividade.status === "concluida"
        )
      )
    );
    const atrasadas = clientes.value.flatMap((c) =>
      c.areas.flatMap((a) =>
        a.equipamentos.filter(
          (e) => e.atividade && e.atividade.alerta === "Atraso > 7 dias"
        )
      )
    );

    inspecoesResumo.value[0].valor = pendentes.length;
    inspecoesResumo.value[1].valor = concluidas.length;
    inspecoesResumo.value[2].valor = atrasadas.length;
  } finally {
    loadingDashboard.value = false;
  }
});
</script>
