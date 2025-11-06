import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor() { }

  private http = inject(HttpClient)
  private api = "https://dutie-api.onrender.com/"

  public upload(dados:File[]){

    const formData = new FormData()
    dados.forEach((arquivo) =>{
      formData.append("fotoPath", arquivo)
    })

    return this.http.post(`${this.api}/usuarios`, formData)
  } 
}
