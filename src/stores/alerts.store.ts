import { defineStore } from "pinia";
import { ref } from "vue";
import type { Alerts } from "@/types/alerts.interface";
import { getAlerts, AlertsResponse } from "../services/alerts/alerts.service";

export const useAlertsStore = defineStore("alerts", () => {
  const alerts = ref<Alerts[]>([]);
  const total = ref(0);
  const loading = ref(false);
  const page = ref(1);
  const limit = ref(10);
  const filtro = ref<"pendente" | "concluida" | "atrasada" | null>(null);

  async function fetchAlerts(p = page.value, l = limit.value, f = filtro.value) {
    try {
      loading.value = true;
      const data: AlertsResponse = await getAlerts(p, l, f);
      alerts.value = data.alerts;
      total.value = data.total;
      page.value = p;
      limit.value = l;
      filtro.value = f;
    } catch (error) {
      console.error("Erro ao carregar alertas:", error);
    } finally {
      loading.value = false;
    }
  }

  return {
    alerts,
    total,
    page,
    limit,
    filtro,
    loading,
    fetchAlerts,
  };
});
