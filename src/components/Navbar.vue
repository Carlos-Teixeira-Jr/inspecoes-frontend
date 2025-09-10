<template>
  <header class="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
    <Menubar :model="items" class="!border-0 !rounded-none">
      <!-- Start slot: logo + botão -->
      <template #start>
        <div class="flex items-center w-full md:justify-start gap-3">
          <!-- Botão de menu apenas mobile -->
          <Button
            icon="pi pi-bars"
            class="md:hidden"
            @click="$emit('toggle-sidebar')"
          />
          <img
            src="../public/images/style/logo.webp"
            alt="Logo"
            class="w-40 bg-gray-400 rounded-2xl p-2"
          />
        </div>
      </template>

      <template #end>
        <div class="flex items-center gap-2 justify-end w-full md:justify-start">
          <input
            type="text"
            placeholder="Buscar..."
            class="hidden sm:block px-2 py-1 rounded border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
      </template>
    </Menubar>
  </header>
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
          command: () => { 
            this.$router.push({ name: 'Reports' })
           }
        }
      ]
    }
  }
});
</script>

<style scoped></style>
