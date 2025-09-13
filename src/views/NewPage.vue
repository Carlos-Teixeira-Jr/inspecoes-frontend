<template>
  <div class="pt-20">
    <h1>Novo Componente</h1>


    <div>
      <Button :label="showActions ? 'Esconder' : 'Mostrar'" @click="logger()" />
      <div v-if="showActions">
        <InputText placeholder="Digite algo" :value="inputValue" v-model="inputValue"/>
        <Button label="Mostrar card"/>
      </div>
    </div>

    <TestCard v-if="showActions" />
  </div>
</template>

<script setup lang="ts">
import { Button } from 'primevue';
import TestCard from '../components/testComps/TestCard.vue';
import { ref } from 'vue';

const showActions = ref(false);
const inputValue = ref('');

const logger = () => {
  console.log("clicou no botao")
  showActions.value = !showActions.value
}
</script>