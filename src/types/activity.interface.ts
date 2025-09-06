export interface Atividade {
  id: number
  descricao: string
  status: 'pendente' | 'concluida' | 'atrasada'
  alerta?: string
  data_proxima_inspecao?: string
}