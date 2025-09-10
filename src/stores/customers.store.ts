import { defineStore } from "pinia";
import { ref } from "vue";
import type { Cliente } from "@/types/customer.interface";
import { getClientes, ClientesResponse } from "../services/customers/customer.service";

export const useClientesStore = defineStore("clientes", () => {
  const clientes = ref<Cliente[]>([]);
  const total = ref(0);
  const loading = ref(false);
  const page = ref(1);
  const limit = ref(10);

  async function fetchClientes(p = page.value, l = limit.value) {
    try {
      loading.value = true;
      const data: ClientesResponse = await getClientes(p, l);
      clientes.value = data.customers;
      total.value = data.total;
      page.value = p;
      limit.value = l;
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
    } finally {
      loading.value = false;
    }
  }

  return {
    clientes,
    total,
    page,
    limit,
    loading,
    fetchClientes,
  };
});
