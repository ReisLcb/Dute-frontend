import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, ToastController, IonList, IonItem, IonInput, IonButton, IonInputPasswordToggle, IonIcon } from '@ionic/angular/standalone';
import { LoginService } from 'src/app/service/login.service';
import { UsuarioService } from 'src/app/service/usuario.service';
import { RouterLink, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-alterar-senha',
  templateUrl: './alterar-senha.page.html',
  styleUrls: ['./alterar-senha.page.scss'],
  standalone: true,
  imports: [IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonList, IonItem, IonInput, IonButton, ReactiveFormsModule, RouterLink, IonInputPasswordToggle]
})
export class AlterarSenhaPage implements OnInit {

  private usuarioService = inject(UsuarioService)
  private loginService = inject(LoginService)
  private router = inject(Router)
  private idUsuario!:number

  private formBuilder = inject(NonNullableFormBuilder);
  protected senhaForm = this.formBuilder.group({
    senhaAtual: ['', [Validators.required]],
    novaSenha: ['', [Validators.required, Validators.min(6)]],
  });

  async exibirMensagem(msg:string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
    })

    await toast.present()
  }

  constructor(private toastController:ToastController) { 
    addIcons({ arrowBackOutline  })
  }

  async ngOnInit() {
    this.idUsuario =  Number( await JSON.parse(this.loginService.obterUsuarioLogado()!.toString()).id)
  }

  protected alterarSenha(){
    this.usuarioService.alterarSenha(this.senhaForm.value, this.idUsuario).subscribe({
      next: () => {
        this.exibirMensagem("Senha alterada com sucesso")
        this.router.navigate(['/outras-informacoes'])
      },
      error: (erro) => this.exibirMensagem(erro.error)
    })
  }

}
