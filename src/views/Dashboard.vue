<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold text-blue-600 mb-4">Dashboard</h1>

    <!-- Cards de resumo -->
    <div class="flex justify-between gap-4 mb-6">
      <Card v-for="(item, index) in resumo" :key="index" class="shadow-lg w-full items-center">
        <template #title>{{ item.titulo }}</template>
        <template #content>
          <p class="text-2xl font-bold m-0">{{ item.valor }}</p>
        </template>
      </Card>
    </div>

    <div class="flex justify-between w-full gap-4 mb-6">
      <Card v-for="(item, index) in inspecoesResumo" :key="index"
        class="shadow-lg p-4 w-full items-center cursor-pointer hover:!shadow-xl" @click="toggleFiltro(item.titulo)">
        <template #title>{{ item.titulo }}</template>
        <template #content>
          <p :class="`text-2xl font-bold text-center ${item.color === 'green' ? 'text-green-600' : item.color === 'red' ? 'text-red-600' : 'text-yellow-600'
            }`">
            {{ item.valor }}
          </p>
        </template>
      </Card>
    </div>

    <!-- Tabela de alertas -->
    <div class="bg-white shadow rounded p-4 mt-6">
      <h2 class="text-xl font-semibold mb-2">Alertas</h2>
      <DataTable :value="alertasFiltrados" :paginator="true" :rows="rowsPerPage" :totalRecords="alertasFiltrados.length"
        @page="onPageChange" tableStyle="width: 100%, min-width: 50rem, max-width: 100%, overflow: auto, display: block">
        <Column field="cliente" header="Cliente" />
        <Column field="tipo" header="Tipo" />
        <Column field="data" header="Data" />
        <Column field="status" header="Status">
          <template #body="slotProps">
            <div class="flex items-center gap-2">
              <i :class="statusIcon(slotProps.data.status)"></i>
              <span
                :class="`${slotProps.data.status === 'pendente' ? 'text-yellow-600' : slotProps.data.status === 'concluida' ? 'text-green-600' : 'text-red-600'} font-semibold`">{{
                  slotProps.data.status }}</span>
            </div>
          </template>
        </Column>
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
    <CustomersMap :clientes="clientes" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, h, computed } from 'vue';
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Listbox from 'primevue/listbox';
import CustomersMap from '../components/CustomersMap.vue';
import { Cliente, ClientesResponse } from '@/types/customer.interface';
import { getClientes } from '../services/dataService';
import { formatDateBR } from '../utils/datFormatter.util';
import { statusIcon } from '../utils/status.util';


const clientes = ref<Cliente[]>([]);
const totalClientes = ref(0);
const loading = ref(false);
const filtroInspecao = ref<'pendentes' | 'concluidas' | 'atrasadas' | null>(null);

function toggleFiltro(titulo: string) {
  // converte para o tipo correto
  const novoFiltro = titulo.toLowerCase() as 'pendentes' | 'concluidas' | 'atrasadas';

  // se clicar no mesmo filtro, desmarca
  filtroInspecao.value = filtroInspecao.value === novoFiltro ? null : novoFiltro;
}

const alertasFiltrados = computed(() => {
  switch (filtroInspecao.value) {
    case 'pendentes':
      return alertas.value.filter(a => a.status === 'pendente');
    case 'concluidas':
      return alertas.value.filter(a => a.status === 'concluida');
    case 'atrasadas':
      return alertas.value.filter(a => a.status === 'atrasada');
    default:
      return alertas.value;
  }
});


// Dados do dashboard
const resumo = ref([
  { titulo: 'Clientes', valor: 0 },
  { titulo: 'Atividades', valor: 0 },
  { titulo: 'Equipamentos', valor: 0 },
  { titulo: 'Relatórios', valor: 0 },
]);

// Cards de resumo
const inspecoesResumo = ref([
  { titulo: 'pendentes', valor: 0, color: 'yellow' },
  { titulo: 'concluídas', valor: 0, color: 'green' },
  { titulo: 'atrasadas', valor: 0, color: 'red' },
]);
console.log("🚀 ~ inspecoesResumo:", inspecoesResumo)


const alertas = ref<any[]>([]);
const totalRecords = ref(0);   // total de alertas do backend
const currentPage = ref(1);    // página atual
const rowsPerPage = ref(10);   // linhas por página

function onPageChange(event: any) {
  currentPage.value = event.page + 1; // PrimeVue começa da página 0
  rowsPerPage.value = event.rows;

  // Recarrega do backend
  loadClientes(currentPage.value, rowsPerPage.value);
}

const proximasInspecoes = ref<any[]>([]);
const selectedInspecao = ref(null);

async function loadClientes(page = 1, limit = 10) {
  loading.value = true;
  try {
    const data: ClientesResponse = await getClientes(page, limit);
    clientes.value = data.customers;
    totalClientes.value = data.total;

    // Atualiza cards
    resumo.value[0].valor = totalClientes.value;

    // Soma todas as atividades dentro dos equipamentos
    resumo.value[1].valor = clientes.value.reduce((acc, cliente) => {
      const atividadesCliente = cliente.areas?.reduce((areaAcc, area) => {
        const atividadesArea = area.equipamentos?.reduce(
          (equipAcc, equipamento) => equipAcc + (equipamento.atividade ? 1 : 0),
          0
        ) ?? 0
        return areaAcc + atividadesArea
      }, 0) ?? 0
      return acc + atividadesCliente
    }, 0)


    // Soma todos os equipamentos
    resumo.value[2].valor = clientes.value.reduce((acc, cliente) => {
      const equipamentosCliente = cliente.areas?.reduce((areaAcc, area) => {
        return areaAcc + (area.equipamentos?.length ?? 0);
      }, 0) ?? 0;
      return acc + equipamentosCliente;
    }, 0);

    // Atualiza alertas
    alertas.value = clientes.value.flatMap(cliente =>
      cliente.areas.flatMap(area =>
        area.equipamentos.flatMap(equipamento =>
          equipamento.atividade
            ? [{
              cliente: cliente.nome,
              tipo: equipamento.tipo,
              data: formatDateBR(equipamento.atividade.data_proxima_inspecao) ?? '-',
              status: equipamento.atividade.alerta === 'Atraso > 7 dias' ? 'atrasada' : equipamento.atividade.status,
              alerta: equipamento.atividade.alerta ?? '',
            }]
            : []
        )
      )
    )

    // Atualiza próximas inspeções
    proximasInspecoes.value = clientes.value.flatMap(cliente =>
      cliente.areas.flatMap(area =>
        area.equipamentos.flatMap(equipamento =>
          equipamento.atividade
            ? [{
              label: `Inspeção ${cliente.nome} - ${equipamento.tipo} - ${equipamento.atividade.data_proxima_inspecao ?? '-'}`,
              value: equipamento.atividade.id,
            }]
            : []
        )
      )
    )

    // Atualiza inspeções
    const pendentes = clientes.value.flatMap(cliente =>
      cliente.areas.flatMap(area =>
        area.equipamentos.filter(e => e.atividade && e.atividade.status === 'pendente')
      )
    );

    const concluidas = clientes.value.flatMap(cliente =>
      cliente.areas.flatMap(area =>
        area.equipamentos.filter(e => e.atividade && e.atividade.status === 'concluida')
      )
    );

    const atrasadas = clientes.value.flatMap(cliente =>
      cliente.areas.flatMap(area =>
        area.equipamentos.filter(e => e.atividade && e.atividade.alerta === 'Atraso > 7 dias')
      )
    );
    console.log("🚀 ~ loadClientes ~ atrasadas:", atrasadas)

    inspecoesResumo.value[0].valor = pendentes.length;
    inspecoesResumo.value[1].valor = concluidas.length;
    inspecoesResumo.value[2].valor = atrasadas.length;
  } catch (err) {
    console.error('Erro ao carregar clientes:', err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => loadClientes());
</script>

<style scoped>
/* Ajustes simples de hover e layout */
</style>
