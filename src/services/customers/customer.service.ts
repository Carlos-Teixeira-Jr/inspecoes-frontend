import { api } from "../../api/api";
import type { Cliente } from "../../types/customer.interface";

export interface ClientesResponse {
  total: number;
  customers: Cliente[];
}

export interface ClientesFilters {
  page?: number;
  limit?: number;
  status?: 'pendente' | 'concluida' | 'atrasada';
  cliente?: string;
  area?: string;
  tipoEquipamento?: string;
  alerta?: string;
}

export async function getClientes(page = 1, limit = 10): Promise<ClientesResponse> {
  try {
    const response = await api.get('/customers', { 
      params: { page, limit } 
    });
    
    return response.data as ClientesResponse;
  } catch (error: any) {
    console.error('Erro ao buscar clientes:', error);
    throw new Error('Erro ao carregar dados da API');
  }
}

export async function getFilteredClientes(filters: ClientesFilters = {}): Promise<ClientesResponse> {
  try {
    const { page = 1, limit = 10, status, cliente, area, tipoEquipamento } = filters;

    const params: any = { page, limit };

    if (status) params.status = status;
    if (cliente) params.cliente = cliente;
    if (area) params.area = area;
    if (tipoEquipamento) params.tipoEquipamento = tipoEquipamento;

    const response = await api.get('/customers', { params });
    return response.data as ClientesResponse;
  } catch (error: any) {
    console.error('Erro ao buscar clientes:', error);
    throw new Error('Erro ao carregar dados da API');
  }
}
