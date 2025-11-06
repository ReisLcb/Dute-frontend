import { Tarefa } from "./tarefa"

export interface Lista_tarefas{
    id:number,
    usuario_id:number
    titulo:string
    descricao:string
    data_criacao:string
    tarefas?: Tarefa[]
    data_ultima_alteracao:string
    visibilidade:string
    tempo_decorrido?: number
}