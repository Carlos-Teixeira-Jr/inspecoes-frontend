<template>
  <div class="flex h-screen">
    <Sidebar />
    <div class="flex-1 flex flex-col">
      <Navbar />
      <main class="flex-1 overflow-auto">
        <Dashboard />
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Navbar from './components/Navbar.vue';
import Sidebar from './components/Sidebar.vue';
import Dashboard from './views/Dashboard.vue';

export default defineComponent({
  components: { Navbar, Sidebar, Dashboard }
});
</script>
