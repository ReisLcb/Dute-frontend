import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { LoginService } from '../service/login.service';

@Injectable({
  providedIn: 'root'
})
export class AutorizacaoGuard implements CanActivate {

  private loginService = inject(LoginService)
  private router = inject(Router)

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    
    const usuarioLogado = this.loginService.obterTokenUsuarioLogado()

    if(!usuarioLogado){
      this.router.navigate(['/home'])
      return false
    }
      return true
  }

}
