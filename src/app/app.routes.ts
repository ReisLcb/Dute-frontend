import { Routes } from '@angular/router';
import { AutorizacaoGuard } from './guards/autorizacao.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full',
  },
  {
    path: 'cadastro',
    loadComponent: () => import('./pages/cadastro/cadastro.page').then( m => m.CadastroPage)
  },
  {
    path: 'main',
    loadComponent: () => import('./pages/main/main.page').then( m => m.MainPage),
    canActivate: [AutorizacaoGuard]
  },
  {
    path: 'outras-informacoes',
    loadComponent: () => import('./pages/usuario-update/outras-informacoes/outras-informacoes.page').then( m => m.OutrasInformacoesPage),
        canActivate: [AutorizacaoGuard]
  },
  {
    path: 'alterar-senha',
    loadComponent: () => import('./pages/usuario-update/alterar-senha/alterar-senha.page').then( m => m.AlterarSenhaPage),
        canActivate: [AutorizacaoGuard]
  },
  {
    path: 'lista-tarefas-update',
    loadComponent: () => import('./pages/lista-tarefas-update/lista-tarefas-update.page').then( m => m.ListaTarefasUpdatePage)
    ,    canActivate: [AutorizacaoGuard]
  },
  {
    path: 'alterar-foto',
    loadComponent: () => import('./pages/alterar-foto/alterar-foto.page').then( m => m.AlterarFotoPage)
  },
  {
    path: 'sessao-tarefas',
    loadComponent: () => import('./pages/sessao-tarefas/sessao-tarefas.page').then( m => m.SessaoTarefasPage)
  },
];
