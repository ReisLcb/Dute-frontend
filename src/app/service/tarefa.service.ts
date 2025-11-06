import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Tarefa } from '../modelos/tarefa';

@Injectable({
  providedIn: 'root'
})
export class TarefaService {
      private http = inject(HttpClient)
      private api = `https://dutie-api.onrender.com/tarefas`

  constructor() { }

  getAll(){
    return this.http.get<Tarefa[]>(this.api)
  }

  getByName(nome:string){
    return this.http.get<Tarefa[]>(`${this.api}/nome/${nome}`)
  }

  getById(id:number){
    return this.http.get<Tarefa>(`${this.api}/id/${id}`)
  }

  getByListId(listId:number){
    return this.http.get<Tarefa[]>(`${this.api}/listaId/${listId}`)
  }

  getByPriority(prioridade:string){
    return this.http.get<Tarefa[]>(`${this.api}/prioridade/${prioridade}`)
  }

  getByStatus(status:string){
    return this.http.get<Tarefa[]>(`${this.api}/status/${status}`)
  }

  create(tarefa:Partial<Tarefa>){
    return this.http.post<Tarefa>(this.api, tarefa)
  }

  update(id:number, tarefa:Partial<Tarefa>){
    return this.http.put<Tarefa>(`${this.api}/update/${id}`, tarefa)
  }

  delete(id:number){
    return this.http.delete(`${this.api}/delete/${id}`)
  }
}
