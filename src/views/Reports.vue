<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useClientesStore } from "../stores/customers.store";
import { toPng } from "html-to-image";
import DataTable from "primevue/datatable";
import Column from "primevue/column";

// Store
const store = useClientesStore();
const search = ref("");
const statusFilter = ref<"pendente" | "concluida" | "atrasada" | "">("");

// refs para os gráficos
const barChartRef = ref<HTMLDivElement | null>(null);
const pieChartRef = ref<HTMLDivElement | null>(null);
const stackChartRef = ref<HTMLDivElement | null>(null);

// Carregar clientes
onMounted(() => {
  store.fetchClientes();
});

// Computed: filtra por cliente/status
const filteredClientes = computed(() => {
  return store.clientes.filter(c => {
    const matchesName = search.value
      ? c.nome.toLowerCase().includes(search.value.toLowerCase())
      : true;

    if (statusFilter.value === 'atrasada') {
      return c.areas.some(area =>
        area.equipamentos.some(e => e.atividade.alerta === 'Atraso > 7 dias')
      );
    } else if (statusFilter.value) {
      return c.areas.some(area =>
        area.equipamentos.some(e => e.atividade.status === statusFilter.value)
      );
    }
    return matchesName;
  });
});


const flatEquipamentos = computed(() => {
  const rows: any[] = [];
  filteredClientes.value.forEach(cliente => {
    cliente.areas.forEach(area => {
      area.equipamentos.forEach(equip => {
        rows.push({
          cliente: cliente.nome,
          area: area.nome,
          equipamento: equip.nome,
          tipo: equip.tipo,
          status: equip.atividade.alerta === "Atraso > 7 dias" ? "atrasada" : equip.atividade.status,
          dataInspecao: equip.atividade.data ?? "-",
          dataProxima: equip.atividade.data_proxima_inspecao ?? "-",
          alerta: equip.atividade.alerta ?? "-"
        });
      });
    });
  });
  return rows;
});


// Exportar CSV
function exportCSV() {
  const rows: string[] = [];
  rows.push("Cliente,Área,Equipamento,Tipo,Status,Data Inspeção,Data Próxima,Alerta");

  filteredClientes.value.forEach(cliente => {
    cliente.areas.forEach(area => {
      area.equipamentos.forEach(equip => {
        const a = equip.atividade;
        rows.push([
          cliente.nome,
          area.nome,
          equip.nome,
          equip.tipo,
          a.status,
          a.data ?? "",
          a.data_proxima_inspecao ?? "",
          a.alerta ?? ""
        ].join(","));
      });
    });
  });

  const csv = rows.join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `relatorio_clientes_${new Date().toISOString()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// Exportar gráfico como imagem
async function exportChartImage(chartElement: HTMLElement | null) {
  if (!chartElement) return;
  const dataUrl = await toPng(chartElement);
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = `grafico_clientes_${new Date().toISOString()}.png`;
  a.click();
}


const valueCount = computed(() => {
  const summary = { concluida: 0, pendente: 0, atrasada: 0 };

  filteredClientes.value.forEach(cliente => {
    cliente.areas.forEach(area => {
      area.equipamentos.forEach(equip => {
        const a = equip.atividade;

        if (a.alerta === "Atraso > 7 dias") {
          summary.atrasada++;
        } else if (a.status === "concluida") {
          summary.concluida++;
        } else if (a.status === "pendente") {
          summary.pendente++;
        }
      });
    });
  });

  return summary;
});

const pieData = computed(() => {
  const total =
    valueCount.value.concluida +
    valueCount.value.pendente +
    valueCount.value.atrasada;

  if (total === 0) return { concluida: 0, pendente: 0, atrasada: 0 };

  return {
    concluida: (valueCount.value.concluida / total) * 100,
    pendente: (valueCount.value.pendente / total) * 100,
    atrasada: (valueCount.value.atrasada / total) * 100,
  };
});

const stackHeights = computed(() => {
  const total =
    valueCount.value.concluida +
    valueCount.value.pendente +
    valueCount.value.atrasada;

  const containerHeight = 192; // px, mesma altura do seu gráfico atual
  if (total === 0) return { concluida: 0, pendente: 0, atrasada: 0 };

  return {
    concluida: (valueCount.value.concluida / total) * containerHeight,
    pendente: (valueCount.value.pendente / total) * containerHeight,
    atrasada: (valueCount.value.atrasada / total) * containerHeight,
  };
});


// Dados para gráfico: resumo de status
const chartData = computed(() => {
  const summary = { concluida: 0, pendente: 0, atrasada: 0 };

  filteredClientes.value.forEach(cliente => {
    cliente.areas.forEach(area => {
      area.equipamentos.forEach(equip => {
        const a = equip.atividade;

        if (a.alerta === "Atraso > 7 dias") {
          summary.atrasada++;
        } else if (a.status === "concluida") {
          summary.concluida++;
        } else if (a.status === "pendente") {
          summary.pendente++;
        }
      });
    });
  });

  // Descobre o maior valor
  const maxValue = Math.max(...Object.values(summary));

  // Multiplicador para altura em px
  const containerHeight = 192; // h-48 = 12rem = 192px
  const minBarHeight = 10; // altura mínima visível
  const normalized: Record<string, number> = {};

  Object.entries(summary).forEach(([key, value]) => {
    normalized[key] =
      maxValue > 0
        ? (value / maxValue) * containerHeight
        : minBarHeight;
  });

  return normalized;
});

</script>

<template>
  <div class="md:p-6 p-2 space-y-6">
    <h1 class="text-2xl font-bold">Relatórios de Clientes</h1>

    <div class="flex flex-wrap justify-around md:px-20 items-end gap-10 md:gap-0">
      <div>
        <div ref="barChartRef"
          class="flex items-end gap-10 h-fit w-fit rounded-md mt-6 border border-gray-400 p-4 overflow-x-auto">
          <div v-for="(value, key) in chartData" :key="key" class="flex-none flex flex-col justify-end items-center">

            <!-- Valor total acima da barra -->
            <span class="text-sm text-gray-200 mb-1">{{ valueCount[key as keyof typeof valueCount] }}</span>

            <!-- Barra do gráfico -->
            <div :style="{ height: value + 'px' }" :class="{
              'bg-green-500': key === 'concluida',
              'bg-yellow-500': key === 'pendente',
              'bg-red-500': key === 'atrasada'
            }" class="w-10 rounded mb-1 transition-all duration-300"></div>

            <!-- Label da coluna -->
            <span class="text-sm text-gray-200">{{ key }}</span>
          </div>

        </div>
        <div class="flex flex-wrap gap-4 justify-center items-center mt-6">
          <button @click="() => exportChartImage(barChartRef)"
            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Exportar Gráfico
          </button>
        </div>

      </div>

      <div class="flex flex-col items-center justify-between h-full">
        <div ref="pieCharRef">
          <div class="w-45 h-45 rounded-full border-4 border-gray-800" :style="{
            background: `conic-gradient(
      #22c55e 0% ${pieData.concluida}%,
      #eab308 ${pieData.concluida}% ${pieData.concluida + pieData.pendente}%,
      #ef4444 ${pieData.concluida + pieData.pendente}% 100%
    )`
          }"></div>
          <div class="flex flex-col items-center justify-between mt-2">
            <span class="text-green-500">Concluída: {{ valueCount.concluida }}</span>
            <span class="text-yellow-500">Pendente: {{ valueCount.pendente }}</span>
            <span class="text-red-500">Atrasada: {{ valueCount.atrasada }}</span>
          </div>
        </div>

        <div class="flex flex-wrap gap-4 justify-center items-center mt-6">
          <button @click="() => exportChartImage(pieChartRef)"
            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Exportar Gráfico
          </button>
        </div>
      </div>

      <div>
        <div ref="stackChartRef">
          <div class="flex flex-col w-40 h-full border rounded overflow-hidden">
            <div class="bg-green-500 transition-all duration-300" :style="{ height: stackHeights.concluida + 'px' }">
            </div>
            <div class="bg-yellow-500 transition-all duration-300" :style="{ height: stackHeights.pendente + 'px' }">
            </div>
            <div class="bg-red-500 transition-all duration-300" :style="{ height: stackHeights.atrasada + 'px' }">
            </div>
          </div>
          <div class="flex flex-col items-center justify-between mt-2">
            <span class="text-green-500">Concluída: {{ valueCount.concluida }}</span>
            <span class="text-yellow-500">Pendente: {{ valueCount.pendente }}</span>
            <span class="text-red-500">Atrasada: {{ valueCount.atrasada }}</span>
          </div>
        </div>

        <div class="flex flex-wrap gap-4 justify-center items-center mt-6">
          <button @click="() => exportChartImage(stackChartRef)"
            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Exportar Gráfico
          </button>
        </div>
      </div>


    </div>

    <div class="flex flex-wrap gap-4 items-center">
      <button @click="exportCSV" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full">
        Exportar CSV
      </button>

    </div>

    <div class="overflow-x-auto md:mt-6">
      <DataTable :value="flatEquipamentos" class="mt-6" responsiveLayout="scroll">
        <Column field="cliente" header="Cliente" sortable></Column>
        <Column field="area" header="Área" sortable></Column>
        <Column field="equipamento" header="Equipamento" sortable></Column>
        <Column field="tipo" header="Tipo" sortable></Column>
        <Column field="status" header="Status" sortable>
          <template #body="slotProps">
            <span :class="{
              'text-green-600': slotProps.data.status === 'concluida',
              'text-yellow-600': slotProps.data.status === 'pendente',
              'text-red-600': slotProps.data.status === 'atrasada'
            }">
              {{ slotProps.data.status }}
            </span>
          </template>
        </Column>
        <Column field="dataInspecao" header="Data Inspeção" sortable>
          <template #body="slotProps">
            {{ new Date(slotProps.data.dataInspecao).toLocaleDateString() }}
          </template>
        </Column>
        <Column field="dataProxima" header="Data Próxima" sortable>
          <template #body="slotProps">
            {{ new Date(slotProps.data.dataProxima).toLocaleDateString() }}
          </template>
        </Column>
        <Column field="alerta" header="Alerta">
          <template #body="slotProps">
            <span v-if="slotProps.data.alerta !== '-'" class="text-red-600 font-semibold">
              {{ slotProps.data.alerta }}
            </span>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>
