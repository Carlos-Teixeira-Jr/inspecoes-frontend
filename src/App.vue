<template>
  <!-- <div class="flex"> -->
    <div class="flex-1 flex flex-col min-h-screen">
      <Navbar @toggle-sidebar="visibleSidebar = !visibleSidebar" />
      <Sidebar :visible.sync="visibleSidebar" />

      <main class="flex-1">
        <!-- <Dashboard /> -->
        <router-view />
      </main>
      <Footer />
    </div>
  <!-- </div> -->
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Navbar from './components/Navbar.vue';
import Sidebar from './components/Sidebar.vue';
import Dashboard from './views/Dashboard.vue';
import Footer from './components/Footer.vue';

export default defineComponent({
  components: { Navbar, Sidebar, Dashboard, Footer },
  setup() {
    const visibleSidebar = ref(false);
    return { visibleSidebar };
  }
});
</script>
