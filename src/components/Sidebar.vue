<template>
  <Sidebar v-model:visible="internalVisible" position="left" class="w-80" :dismissable="true">
    <template #container="{ closeCallback }">
      <div class="flex flex-col h-full">
        <!-- Header -->
        <div class="flex items-center w-full justify-between px-4 py-3 shrink-0 border-b-1 surface-border">
          <span class="text-xl font-bold">Dashboard Menu</span>
          <Button icon="pi pi-times" @click="closeCallback" rounded outlined class="p-button-text" />
        </div>

        <!-- Content -->
        <div class="overflow-y-auto flex-grow-1">
          <!-- Visão Geral -->
          <div class="p-3">
            <h3 class="text-lg font-semibold mb-2">Visão Geral</h3>
            <ul class="list-none p-0 m-0">
              <li class="p-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                @click="filterStatus('concluida')">
                <div class="flex items-center gap-2">
                  <i class="pi pi-check-circle text-green-600"></i>
                  Concluídas
                </div>
                <span class="font-bold text-green-600">{{ totalConcluidas }}</span>
              </li>
              <li class="p-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                @click="filterStatus('pendente')">
                <div class="flex items-center gap-2">
                  <i class="pi pi-exclamation-triangle text-yellow-600"></i>
                  Pendentes
                </div>
                <span class="font-bold text-yellow-600">{{ totalPendentes }}</span>
              </li>
              <li class="p-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                @click="filterStatus('atrasada')">
                <div class="flex items-center gap-2">
                  <i class="pi pi-times-circle text-red-600"></i>
                  Atrasadas
                </div>
                <span class="font-bold text-red-600">{{ totalAtrasadas }}</span>
              </li>
            </ul>
          </div>

          <!-- Clientes / Locais -->
          <div class="p-3">
            <h3 class="text-lg font-semibold mb-2">Clientes / Locais</h3>
            <ul class="list-none p-0 m-0">
              <li v-for="cliente in clientesStore.clientes" :key="cliente.id" class="mb-2">
                <div @click="toggleCliente(cliente.id)"
                  class="flex justify-between items-center p-2 hover:bg-gray-100 cursor-pointer">
                  {{ cliente.nome }}
                  <i :class="{ 'pi pi-chevron-down': !isOpen(cliente.id), 'pi pi-chevron-up': isOpen(cliente.id) }"></i>
                </div>
                <ul v-if="isOpen(cliente.id)" class="pl-4 mt-1">
                  <li v-for="area in cliente.areas" :key="area.id" class="p-1 hover:bg-gray-50 cursor-pointer"
                    @click="filterArea(cliente.nome, area.nome)">
                    {{ area.nome }}
                  </li>
                </ul>
              </li>
            </ul>
          </div>

          <!-- Equipamentos / Inspeções -->
          <div class="p-3">
            <h3 class="text-lg font-semibold mb-2">Equipamentos / Inspeções</h3>
            <div class="mb-2">
              <label class="block mb-1">Tipo de Equipamento</label>
              <Dropdown :options="tiposEquipamento" v-model="filtroEquipamento" placeholder="Selecione"
                class="w-full" />
            </div>
            <div>
              <label class="block mb-1">Status</label>
              <Dropdown :options="['concluida', 'pendente', 'atrasada']" v-model="filtroStatus" placeholder="Selecione"
                class="w-full" />
            </div>
          </div>

          <!-- Alertas -->
          <div class="p-3">
            <h3 class="text-lg font-semibold mb-2">Alertas</h3>
            <ul class="list-none p-0 m-0">
              <li v-for="alert in alertasStore.alerts" :key="alert.id" class="p-2 hover:bg-gray-100 cursor-pointer"
                @click="filterAlerta(alert.tipo)">
                {{ alert.tipo }}
              </li>
            </ul>
          </div>

          <!-- Botão Buscar -->
          <div class="p-3">
            <Button label="Buscar" icon="pi pi-search" class="w-full" @click="buscarClientes" />

            <!-- Mensagem de erro -->
            <p v-if="erroBusca" class="mt-2 text-red-600 font-semibold">
              Nenhum cliente encontrado com os filtros selecionados.
            </p>
          </div>

        </div>
      </div>
    </template>
  </Sidebar>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import Sidebar from 'primevue/sidebar';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import { useClientesStore } from '../stores/customers.store';
import { useAlertsStore } from '../stores/alerts.store';
import { getFilteredClientes } from '../services/customers/customer.service';

// Props
const props = defineProps({ visible: { type: Boolean, required: true } });
const emit = defineEmits(['update:visible']);
const internalVisible = ref(props.visible);
const erroBusca = ref(false);

// Stores
const clientesStore = useClientesStore();
const alertasStore = useAlertsStore();

// Sincroniza com o pai
watch(() => props.visible, val => internalVisible.value = val);
watch(internalVisible, val => emit('update:visible', val));

// Filtros
const filtroEquipamento = ref(null);
const filtroStatus = ref(null);
const filtrosAtivos = ref({
  status: null as "pendente" | "concluida" | "atrasada" | null,
  cliente: null as string | null,
  area: null as string | null,
  tipoEquipamento: null as string | null,
  alerta: null as string | null
});
console.log("🚀 ~ filtrosAtivos:", filtrosAtivos)


// Clientes abertos no menu
const clientesOpen = ref(new Map<number, boolean>());
function toggleCliente(id: number) { clientesOpen.value.set(id, !clientesOpen.value.get(id)); }
function isOpen(id: number) { return clientesOpen.value.get(id) || false; }

// Computeds para resumo
const totalConcluidas = computed(() => clientesStore.clientes.flatMap(c => c.areas.flatMap(a => a.equipamentos.filter(e => e.atividade?.status === 'concluida'))).length);
const totalPendentes = computed(() => clientesStore.clientes.flatMap(c => c.areas.flatMap(a => a.equipamentos.filter(e => e.atividade?.status === 'pendente'))).length);
const totalAtrasadas = computed(() => clientesStore.clientes.flatMap(c => c.areas.flatMap(a => a.equipamentos.filter(e => e.atividade?.alerta === 'Atraso > 7 dias'))).length);

// Métodos de filtro
function filterStatus(status: "pendente" | "concluida" | "atrasada") {
  filtrosAtivos.value.status = status;
}
function filterArea(cliente: string, area: string) { filtrosAtivos.value.cliente = cliente; filtrosAtivos.value.area = area; }
function filterAlerta(alerta: string) { filtrosAtivos.value.alerta = alerta; }

watch(filtroEquipamento, val => filtrosAtivos.value.tipoEquipamento = val);
watch(filtroStatus, val => filtrosAtivos.value.status = val);

// Tipos de equipamento
const tiposEquipamento = ['Alarme', 'Extintor', 'Sprinkler', 'Porta Corta-Fogo', 'Hidrante', 'Bomba de Incêndio'];

// Função Buscar
async function buscarClientes() {
  try {
    const data = await getFilteredClientes({
      status: filtrosAtivos.value.status ?? undefined,
      cliente: filtrosAtivos.value.cliente ?? undefined,
      area: filtrosAtivos.value.area ?? undefined,
      tipoEquipamento: filtrosAtivos.value.tipoEquipamento ?? undefined,
      alerta: filtrosAtivos.value.alerta === "Atraso > 7 dias" ? filtrosAtivos.value.alerta : undefined
    });

    // Atualiza store
    clientesStore.clientes = data.customers;

    // Verifica se retornou algum cliente
    erroBusca.value = data.customers.length === 0;

    // Fecha sidebar
    internalVisible.value = false;
    emit('update:visible', false);

  } catch (err) {
    console.error('Erro ao buscar clientes:', err);
    erroBusca.value = true; // também mostra erro se a requisição falhar
  }
}
</script>
