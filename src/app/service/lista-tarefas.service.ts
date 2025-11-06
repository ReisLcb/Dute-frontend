import { inject, Injectable } from '@angular/core';
import { Lista_tarefas } from '../modelos/lista-tarefas';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ListaTarefasService {
      private http = inject(HttpClient)
      private api = `https://dutie-api.onrender.com/listas`

  constructor() { }

      getAll(){
        return this.http.get<Lista_tarefas[]>(this.api)
      }

      getById(id:number){
        return this.http.get<Lista_tarefas>(`${this.api}/id/${id}`)
      }

      getByName(titulo:string){
        return this.http.get<Lista_tarefas[]>(`${this.api}/titulo/${titulo}`)
      }

      getByUserId(userId:number){
        return this.http.get<Lista_tarefas[]>(`${this.api}/userId/${userId}`)
      }

      getTarefasLista(id:number){
        return this.http.get<Lista_tarefas[]>(`${this.api}/tarefas/${id}`)
      }

      create(lista:Partial<Lista_tarefas>){
        return this.http.post(this.api, lista)
      }

      update(id:number, lista:Partial<Lista_tarefas>){
        return this.http.put<Lista_tarefas>(`${this.api}/update/${id}`, lista)
      }

      delete(id:number){
        return this.http.delete<Lista_tarefas>(`${this.api}/delete/${id}`)
      }
}
