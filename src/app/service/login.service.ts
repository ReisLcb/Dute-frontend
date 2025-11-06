import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Usuario } from '../modelos/usuario';
import { LoginResponse } from '../modelos/login-response'
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private readonly LOGIN_KEY = "login-key"
  private readonly USUARIO_LOGADO_KEY = "usuarioLogado-key"
  private api = `https://dutie-api.onrender.com/usuarios/login`
  private httpClient = inject(HttpClient)
  private router = inject(Router)

  autenticar(credenciais:Partial<Usuario>){
    this.httpClient.post<LoginResponse>(this.api, credenciais).subscribe({
      next: (res) =>{
        localStorage.setItem(this.LOGIN_KEY, res.token)
        localStorage.setItem(this.USUARIO_LOGADO_KEY, JSON.stringify(res.usuario))
        this.router.navigate(['/main'])
      },

      error: (erro) => console.log(erro)
    })
  }

  obterTokenUsuarioLogado(){
    return localStorage.getItem(this.LOGIN_KEY)
  }

  obterUsuarioLogado(){
    return localStorage.getItem(this.USUARIO_LOGADO_KEY)
  }

  guardarUsuarioLogado(usuario:Partial<Usuario>){
    return localStorage.setItem(this.USUARIO_LOGADO_KEY, JSON.stringify(usuario))
  }

  removerUsuarioLogado(){
    return localStorage.removeItem(this.USUARIO_LOGADO_KEY)
  }

  removerTokenUsuarioLogado(){
    return localStorage.removeItem(this.LOGIN_KEY)
  }
}
