import type { Cliente } from "../types/customer.interface"

export async function getClientes(): Promise<Cliente[]> {
  const response = await fetch('/data.json')
  if (!response.ok) {
    throw new Error('Erro ao carregar dados')
  }
  const data = await response.json()
  return data.clientes as Cliente[]
}
