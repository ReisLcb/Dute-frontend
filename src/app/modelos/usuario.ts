import { Lista_tarefas } from "./lista-tarefas"

export interface Usuario{
    id: number
    nome:string
    nome_de_usuario:string
    email:string
    senha:string
    listasTarefas?:Lista_tarefas[]
    fotoPath:any
}
