import type { Equipamento } from "./equipment.interface"

export interface Area {
  id: number
  nome: string
  customerId: number
  latitude: number
  longitude: number
  createdAt: string
  updatedAt: string
  equipamentos: Equipamento[]
}