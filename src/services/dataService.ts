import { api } from "../api/api";
import type { Cliente } from "../types/customer.interface";

export interface ClientesResponse {
  total: number;
  customers: Cliente[];
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
