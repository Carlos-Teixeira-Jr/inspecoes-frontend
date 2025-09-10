import { formatDateBR } from "../../utils/datFormatter.util";
import { api } from "../../api/api";
import { Alerts } from "@/types/alerts.interface";

export interface AlertsResponse {
  total: number;
  alerts: Alerts[];
}

export interface AlertsFilters {
  page?: number;
  limit?: number;
  status?: 'pendente' | 'concluida' | 'atrasada';
  cliente?: string;
  area?: string;
  tipoEquipamento?: string;
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

export async function getFilteredAlerts(filters: AlertsFilters = {}): Promise<AlertsResponse> {
  const { page = 1, limit = 10, status, cliente, area, tipoEquipamento } = filters;

  const params: any = { page, limit };

  if (status) params.status = status;
  if (cliente) params.cliente = cliente;
  if (area) params.area = area;
  if (tipoEquipamento) params.tipoEquipamento = tipoEquipamento;

  const response = await api.get<AlertsResponse>('/alerts', { params });

  const formatedResponse = response.data;
  formatedResponse.alerts = formatedResponse.alerts.map((alert) => ({
    ...alert,
    data: formatDateBR(alert.data),
  }));

  return response.data;
}
