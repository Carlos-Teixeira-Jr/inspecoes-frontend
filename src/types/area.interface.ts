import type { Equipamento } from "./equipment.interface"

export interface Area {
  id: number
  nome: string
  equipamentos: Equipamento[]
}