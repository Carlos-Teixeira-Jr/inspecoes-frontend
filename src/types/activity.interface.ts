export interface Atividade {
  id: number
  descricao: string
  data: string | null
  data_inicio: string | null
  data_finalizacao: string | null
  status: 'pendente' | 'concluida' | 'atrasada'
  data_proxima_inspecao: string | null
  alerta: string | null
  equipmentId: number
  createdAt: string
  updatedAt: string
}
