import type { Area } from "./area.interface"

export interface Cliente {
  id: number
  nome: string
  endereco: string
  latitude?: number
  longitude?: number
  areas: Area[]
}