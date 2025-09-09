import { api } from "../../api/api";
import type { Cliente } from "../../types/customer.interface";

export interface AlertsResponse {
  total: number;
  alerts: Cliente[];
}

export async function getAlerts(
  page: number = 1,
  limit: number = 10,
  filtro: 'pendentes' | 'concluidas' | 'atrasadas' | null = null
): Promise<AlertsResponse> {
  const params: any = {
    page,
    limit,
  };

  if (filtro) {
    params.status = filtro;
  }

  const response = await api.get<AlertsResponse>('/api/alerts', { params });
  return response.data;
}
