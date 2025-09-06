import type { Atividade } from "./activity.interface"

export interface Equipamento {
  id: number
  nome: string
  tipo: string
  atividades: Atividade[]
}