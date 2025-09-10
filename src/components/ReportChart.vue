<template>
  <div class="p-6">
    <Card>
      <!-- Título -->
      <template #title>
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold">Status das Inspeções</h2>
          <div class="text-sm text-gray-500">Total de equipamentos: {{ totalEquipamentos }}</div>
        </div>
      </template>

      <!-- Conteúdo -->
      <div class="flex flex-col md:flex-row md:space-x-6 mt-4">
        <!-- Gráfico Pie -->
        <div style="width: 100%; height: 300px;">
          <Chart
            v-if="chartReady"
            :key="chartKey"
            type="pie"
            :data="chartData"
            :options="chartOptions"
            class="w-full h-full"
          />
        </div>

        <!-- Stats e botões -->
        <div class="w-full md:w-1/2 mt-6 md:mt-0 space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm text-gray-600">Concluídas</div>
              <div class="text-2xl font-bold">{{ counts.concluida }}</div>
            </div>
            <div class="text-right">
              <div class="text-sm text-gray-600">Pendentes</div>
              <div class="text-2xl font-bold">{{ counts.pendente }}</div>
            </div>
            <div class="text-right">
              <div class="text-sm text-gray-600">Outros</div>
              <div class="text-2xl font-bold">{{ counts.other }}</div>
            </div>
          </div>

          <div class="pt-4">
            <ProgressBar :value="percentConcluido" />
            <div class="text-xs text-gray-500 mt-2">Percentual concluído</div>
          </div>

          <div class="pt-4 space-x-2">
            <Button label="Exportar CSV" icon="pi pi-download" @click="exportCsv" />
            <Button label="Ver tabela" icon="pi pi-list" @click="showTable = true" class="p-button-secondary" />
          </div>
        </div>
      </div>
    </Card>

    <!-- Modal com tabela detalhada -->
    <Dialog v-model:visible="showTable" header="Equipamentos" :modal="true" :style="{ width: '80vw' }">
      <DataTable :value="flatEquipamentos" class="mt-2" responsiveLayout="scroll">
        <Column field="cliente" header="Cliente" sortable />
        <Column field="area" header="Área" sortable />
        <Column field="nome" header="Equipamento" sortable />
        <Column field="tipo" header="Tipo" sortable />
        <Column field="atividade.status" header="Status" sortable />
        <Column field="atividade.data_proxima_inspecao" header="Próxima Inspeção" sortable />
        <Column field="atividade.alerta" header="Alerta" />
      </DataTable>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, nextTick, watch } from 'vue'
import Chart from 'primevue/chart'
import Card from 'primevue/card'
import Button from 'primevue/button'
import ProgressBar from 'primevue/progressbar'
import Dialog from 'primevue/dialog'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

interface Atividade {
  data: string | null
  descricao: string
  data_inicio: string | null
  data_finalizacao: string | null
  status: string | null
  data_proxima_inspecao: string | null
  alerta: string | null
}

interface Equipamento {
  nome: string
  tipo: string
  atividade: Atividade
}

interface Area {
  nome: string
  latitude?: number
  longitude?: number
  equipamentos: Equipamento[]
}

interface Cliente {
  nome: string
  endereco?: string
  latitude?: number
  longitude?: number
  areas: Area[]
}

// Recebe dados da API
const props = defineProps<{ data: Cliente[] }>()

// Modal
const showTable = ref(false)

// Controle de renderização do Chart
const chartReady = ref(false)
const chartKey = ref(0)

// Flatten equipamentos
const flatEquipamentos = computed(() => {
  const list: any[] = []
  props.data?.forEach(c =>
    c.areas?.forEach(a =>
      a.equipamentos?.forEach(e =>
        list.push({ cliente: c.nome, area: a.nome, ...e })
      )
    )
  )
  return list
})

// Contagem por status
const counts = computed(() => {
  const c = { concluida: 0, pendente: 0, other: 0 }
  flatEquipamentos.value.forEach(e => {
    const s = e.atividade?.status?.toLowerCase()
    if (s === 'concluida') c.concluida++
    else if (s === 'pendente') c.pendente++
    else c.other++
  })
  return c
})

const totalEquipamentos = computed(() => flatEquipamentos.value.length)
const percentConcluido = computed(() => (counts.value.concluida / Math.max(totalEquipamentos.value, 1)) * 100)

// Chart.js via PrimeVue Chart
const chartData = ref({
  labels: ['Concluída', 'Pendente', 'Outros'],
  datasets: [
    {
      data: [0, 0, 0],
      backgroundColor: ['#16a34a', '#f59e0b', '#ef4444']
    }
  ]
})

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'bottom' }
  }
}

watch(
  () => props.data, // observa apenas props.data
  async (newData) => {
    if (!newData || newData.length === 0) return

    const c = counts.value
    chartData.value = {
      labels: ['Concluída', 'Pendente', 'Outros'],
      datasets: [
        {
          data: [c.concluida, c.pendente, c.other],
          backgroundColor: ['#16a34a', '#f59e0b', '#ef4444']
        }
      ]
    }

        console.log("🚀 ~ chartReady.value:", chartReady.value)


    const tick = await nextTick()
    console.log("🚀 ~ tick:", tick)
    chartReady.value = true
    chartKey.value++ // força re-render do Chart
  },
  { immediate: true } // executa de imediato ao montar
)


// Export CSV
function exportCsv() {
  console.log("🚀 ~ exportCsv ~ flatEquipamentos.value.length:", flatEquipamentos.value.length)
  if (!flatEquipamentos.value.length) return
  const headers = ['cliente', 'area', 'nome', 'tipo', 'status', 'data_proxima_inspecao', 'alerta']
  const csv = [headers.join(',')].concat(
    flatEquipamentos.value.map(r =>
      headers.map(h => h.includes('.') ? r.atividade?.[h.split('.')[1]] ?? '' : r[h]).join(',')
    )
  ).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'equipamentos.csv'
  a.click()
  URL.revokeObjectURL(a.href)
}
</script>
