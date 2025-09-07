<template>
  <Menubar :model="items">
    <!-- Slot start: logo ou marca -->
    <template #start>
      <Button icon="pi pi-bars" label="Menu" class="mr-3" @click="$emit('toggle-sidebar')" />

      <span class="text-blue-600 font-bold text-xl">Survey Inspec</span>
    </template>

    <!-- Slot end: avatar e campo de busca -->
    <template #end>
      <div class="flex items-center gap-2">
        <input type="text" placeholder="Buscar..."
          class="px-2 py-1 rounded border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300" />
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
import Sidebar from './Sidebar.vue';

export default defineComponent({
  components: { Menubar, Sidebar },
  data() {
    return {
      items: [
        {
          label: 'Dashboard',
          icon: 'pi pi-home',
          command: () => {
            this.$router.push({ name: 'Dashboard' })
          }
        },
        {
          label: 'Clientes',
          icon: 'pi pi-users',
          command: () => {
            this.$router.push({ name: 'Customers' })
          }
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

<style scoped></style>
