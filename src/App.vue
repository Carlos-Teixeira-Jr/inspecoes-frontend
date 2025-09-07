<template>
  <!-- <div class="flex"> -->
    <div class="flex-1 flex flex-col">
      <Navbar @toggle-sidebar="visibleSidebar = !visibleSidebar" />
      <Sidebar :visible.sync="visibleSidebar" />
      <main class="flex-1 overflow-auto">
        <!-- <Dashboard /> -->
        <router-view />
      </main>
      <router-view />
    </div>
  <!-- </div> -->
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Navbar from './components/Navbar.vue';
import Sidebar from './components/Sidebar.vue';
import Dashboard from './views/Dashboard.vue';

export default defineComponent({
  components: { Navbar, Sidebar, Dashboard },
  setup() {
    const visibleSidebar = ref(false);
    return { visibleSidebar };
  }
});
</script>
