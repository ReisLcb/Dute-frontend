import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Usuario } from '../modelos/usuario';

@Injectable({
  providedIn: 'root'
})

export class UsuarioService {
    private http = inject(HttpClient)
    private api = `https://dutie-api.onrender.com/usuarios`

  constructor() { }

  cadastrar(dados:Partial<Usuario>, arquivo:File){
    const formData = new FormData();

    formData.append("nome", dados.nome!);
    formData.append("nome_de_usuario", dados.nome_de_usuario!);
    formData.append("email", dados.email!);
    formData.append("senha", dados.senha!);

    if (arquivo) {
      formData.append("fotoPath", arquivo);
    }

    return this.http.post<Usuario>(this.api, formData)
  }

  getAll(){
    return this.http.get<Usuario[]>(this.api)
  }

  getById(id:number){
    return this.http.get<Usuario>(`${this.api}/id/${id}`)
  }
  
  getByName(nome:string){
    return this.http.get<Usuario[]>(`${this.api}/nome/${nome}`)
  }

  getByUsername(username:string){
    return this.http.get<Usuario>(`${this.api}/username/${username}`)
  }

  getByEmail(email:string){
    return this.http.get<Usuario>(`${this.api}/email/${email}`)
  }

  update(usuario:Partial<Usuario>, id:number){
    return this.http.put<Usuario>(`${this.api}/update/${id}`, usuario)
  }

  excluirFotoPerfil(id:number){
    return this.http.put(`${this.api}/excluirFoto/${id}`, null)
  }

  alterarFotoPerfil(id:number, arquivo:File){
    const formData = new FormData();

    if (arquivo) {
      formData.append("fotoPath", arquivo);
    }

    return this.http.put(`${this.api}/alterarFoto/${id}`, formData)
  }

  alterarSenha(senhaDados:Partial<{senhaAtual:string, novaSenha:string}>, id:number){
    return this.http.put<Usuario>(`${this.api}/alterarSenha/${id}`, senhaDados)
  }

  delete(id:number){
    return this.http.delete<Usuario>(`${this.api}/delete/${id}`)
  }
}
