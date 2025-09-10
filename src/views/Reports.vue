<script setup lang="ts">
import { ref, onMounted } from 'vue'
import RelatorioStatusChart from '../components/ReportChart.vue'
import type { Cliente } from '../types/customer.interface'
import { getClientes } from '../services/customers/customer.service'

const clientes = ref<Cliente[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const { customers } = await getClientes(1, 100)
    clientes.value = customers
  } catch (err) {
    console.error('Erro ao carregar clientes', err)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="p-6 space-y-6">
    <h1 class="text-2xl font-bold">Relatório de Inspeções</h1>

    <div v-if="loading" class="text-gray-500">Carregando dados...</div>
    <div v-else>
      <RelatorioStatusChart :data="clientes" />
    </div>
  </div>
</template>
