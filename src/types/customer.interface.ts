import type { Area } from "./area.interface"

export interface Cliente {
  id: number
  nome: string
  endereco: string
  latitude: number
  longitude: number
  createdAt: string
  updatedAt: string
  areas: Area[]
}

export interface ClientesResponse {
  total: number
  customers: Cliente[]
}