<template>
  <footer class="bg-gray-900 text-gray-300 py-6 mt-10 shadow-inner w-full">
    <div class="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
      <!-- Logo / Nome -->
      <div class="flex items-center gap-2">
        <i class="pi pi-check-circle text-blue-500 text-2xl"></i>
        <span class="font-bold text-lg">Survey Inspec</span>
      </div>

      <!-- Links -->
      <div class="flex gap-6 text-sm">
        <Button 
          label="Dashboard" 
          text 
          class="text-gray-300 hover:text-white" 
          @click="$router.push({ name: 'Dashboard' })" />
        <Button 
          label="Clientes" 
          text 
          class="text-gray-300 hover:text-white" 
          @click="$router.push({ name: 'Customers' })" />
        <Button 
          label="Relatórios" 
          text 
          class="text-gray-300 hover:text-white" 
          @click="$router.push({ name: 'Reports' })" />
      </div>

      <!-- Social Icons -->
      <div class="flex gap-4 text-xl">
        <a href="#" class="hover:text-blue-400"><i class="pi pi-linkedin"></i></a>
        <a href="#" class="hover:text-blue-500"><i class="pi pi-github"></i></a>
        <a href="#" class="hover:text-pink-500"><i class="pi pi-instagram"></i></a>
      </div>
    </div>

    <div class="flex justify-center my-8">
      <img src="../public/images/style/logo.webp" alt="Logo" class="w-40 bg-gray-400 rounded-2xl p-2" />
    </div>

    <!-- Linha inferior -->
    <div class="border-t border-gray-700 mt-6 pt-4 text-center text-xs text-gray-500">
      © {{ new Date().getFullYear() }} Carlos Teixeira. Todos os direitos reservados.
    </div>
  </footer>
</template>

<script setup lang="ts">
</script>
