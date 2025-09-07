import type { Atividade } from "./activity.interface"

export interface Equipamento {
  id: number
  nome: string
  tipo: string
  areaId: number
  createdAt: string
  updatedAt: string
  atividade: Atividade
}