import { formatDateBR } from "../../utils/datFormatter.util";
import { api } from "../../api/api";
import { Alerts } from "@/types/alerts.interface";

export interface AlertsResponse {
  total: number;
  alerts: Alerts[];
}

export async function getAlerts(
  page: number = 1,
  limit: number = 10,
  filtro: 'pendente' | 'concluida' | 'atrasada' | null = null
): Promise<AlertsResponse> {
  const params: any = {
    page,
    limit,
  };

  if (filtro) {
    params.status = filtro;
  }

  const response = await api.get<AlertsResponse>('/alerts', { params });

  const formatedResponse = response.data;
  formatedResponse.alerts = formatedResponse.alerts.map((alert) => ({
    ...alert,
    data: formatDateBR(alert.data),
  }));

  return response.data;
}
