<template>
  <Menubar :model="items">
    <!-- Slot start: logo ou marca -->
    <template #start>
      <span class="text-white font-bold text-xl">Meu App</span>
    </template>

    <!-- Slot end: avatar e campo de busca -->
    <template #end>
      <div class="flex items-center gap-2">
        <input
          type="text"
          placeholder="Buscar..."
          class="px-2 py-1 rounded border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
        />
        <!-- <img
          src="/images/avatar.png"
          alt="Avatar"
          class="w-8 h-8 rounded-full"
        /> -->
      </div>
    </template>
  </Menubar>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Menubar from 'primevue/menubar';

export default defineComponent({
  components: { Menubar },
  data() {
    return {
      items: [
        {
          label: 'Dashboard',
          icon: 'pi pi-home',
          command: () => { console.log('Dashboard clicado') }
        },
        {
          label: 'Clientes',
          icon: 'pi pi-users',
          command: () => { console.log('Clientes clicado') }
        },
        {
          label: 'Relatórios',
          icon: 'pi pi-chart-bar',
          command: () => { console.log('Relatórios clicado') }
        }
      ]
    }
  }
});
</script>

<style scoped>
</style>
