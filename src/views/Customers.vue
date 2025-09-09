<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold text-blue-600 mb-4">Clientes</h1>
    
    <!-- aqui você pode reaproveitar a lógica do App.vue ou criar um componente -->
    <ul>
      <li v-for="cliente in clientes" :key="cliente.id" class="mb-2">
        {{ cliente.nome }} - {{ cliente.endereco }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { getClientes } from '../services/customers/customer.service.js'
import { Cliente } from '../types/customer.interface.js'
import { ref, onMounted } from 'vue'

const clientes = ref<Cliente[]>([])

onMounted(async () => {
  const data = await getClientes()
  clientes.value = data.customers
})
</script>
