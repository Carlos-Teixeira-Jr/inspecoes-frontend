<template>
  <!-- <div class="flex flex-column h-full">-->

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
                <li class="p-2 hover:bg-gray-100 cursor-pointer" @click="filterStatus('concluida')">Concluídas</li>
                <li class="p-2 hover:bg-gray-100 cursor-pointer" @click="filterStatus('pendente')">Pendentes</li>
                <li class="p-2 hover:bg-gray-100 cursor-pointer" @click="filterStatus('atrasada')">Atrasadas</li>
              </ul>
            </div>

            <!-- Clientes / Locais -->
            <div class="p-3">
              <h3 class="text-lg font-semibold mb-2">Clientes / Locais</h3>
              <ul class="list-none p-0 m-0">
                <li v-for="cliente in clientes" :key="cliente.nome" class="mb-2">
                  <div @click="toggleCliente(cliente.nome)" class="flex justify-between items-center p-2 hover:bg-gray-100 cursor-pointer">
                    {{ cliente.nome }}
                    <i :class="{'pi pi-chevron-down': !cliente.open, 'pi pi-chevron-up': cliente.open}"></i>
                  </div>
                  <ul v-if="cliente.open" class="pl-4 mt-1">
                    <li v-for="area in cliente.areas" :key="area.nome" class="p-1 hover:bg-gray-50 cursor-pointer" @click="filterArea(cliente.nome, area.nome)">
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
                <label for="tipoEquipamento" class="block mb-1">Tipo de Equipamento</label>
                <Dropdown :options="tiposEquipamento" v-model="filtroEquipamento" placeholder="Selecione" class="w-full" />
              </div>
              <div>
                <label for="statusEquipamento" class="block mb-1">Status</label>
                <Dropdown :options="['concluida','pendente','atrasada']" v-model="filtroStatus" placeholder="Selecione" class="w-full" />
              </div>
            </div>

            <!-- Alertas e Próximas Inspeções -->
            <div class="p-3">
              <h3 class="text-lg font-semibold mb-2">Alertas</h3>
              <ul class="list-none p-0 m-0">
                <li class="p-2 hover:bg-gray-100 cursor-pointer" @click="filterAlerta('urgente')">Urgente</li>
                <li class="p-2 hover:bg-gray-100 cursor-pointer" @click="filterAlerta('atraso')">Atraso > 7 dias</li>
                <li class="p-2 hover:bg-gray-100 cursor-pointer" @click="filterAlerta('risco')">Risco elétrico próximo</li>
                <li class="p-2 hover:bg-gray-100 cursor-pointer" @click="filterAlerta('baixa')">Baixa pressão de água</li>
                <li class="p-2 hover:bg-gray-100 cursor-pointer" @click="filterAlerta('falha')">Falha crítica</li>
              </ul>
            </div>

            <!-- Mapa (opcional) -->
            <div class="p-3">
              <Button label="Visualizar Mapa" icon="pi pi-map" class="w-full" @click="abrirMapa" />
            </div>
          </div>
        </div>
      </template>
    </Sidebar>
  <!-- </div> -->
</template>

<script setup>
import { ref, reactive, defineProps, watch } from 'vue';
import Sidebar from 'primevue/sidebar';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';

const props = defineProps({
  visible: { type: Boolean, required: true }
});

// Controle da sidebar
const visible = ref(false);

const emit = defineEmits(['update:visible']);

// Vincula a prop ao ref interno
const internalVisible = ref(props.visible);

// Sempre que a prop mudar, atualiza o ref interno
watch(() => props.visible, (val) => {
  internalVisible.value = val;
});

// Sempre que o ref interno mudar, emite para o pai
watch(internalVisible, (val) => {
  emit('update:visible', val);
});

// Filtros
const filtroEquipamento = ref(null);
const filtroStatus = ref(null);

// Lista de clientes (exemplo do JSON simplificado)
const clientes = reactive([
  { nome: 'Condomínio Vila Paulista', open: false, areas: [{ nome: 'Cobertura' }, { nome: 'Edifício 1' }] },
  { nome: 'Shopping Atlântico', open: false, areas: [{ nome: 'Cobertura' }, { nome: 'Subsolo' }] },
  { nome: 'Hospital Santa Clara', open: false, areas: [{ nome: 'Ala Sul' }, { nome: 'Bloco B' }, { nome: 'Ala Norte' }] }
]);

const tiposEquipamento = ['Alarme','Extintor','Sprinkler','Porta Corta-Fogo','Hidrante','Bomba de Incêndio'];

// Funções de interação
function toggleCliente(nome) {
  const cliente = clientes.find(c => c.nome === nome);
  if (cliente) cliente.open = !cliente.open;
}

function filterStatus(status) {
  console.log('Filtrando por status:', status);
}

function filterArea(cliente, area) {
  console.log('Filtrando por cliente:', cliente, 'e área:', area);
}

function filterAlerta(tipo) {
  console.log('Filtrando alerta:', tipo);
}

function abrirMapa() {
  console.log('Abrindo mapa...');
}
</script>

<style scoped>
/* Ajustes simples de hover e layout */
.hover\:bg-gray-100:hover {
  background-color: #f5f5f5;
}
.hover\:bg-gray-50:hover {
  background-color: #fafafa;
}
</style>

