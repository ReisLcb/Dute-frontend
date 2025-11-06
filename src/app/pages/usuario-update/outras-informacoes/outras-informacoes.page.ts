import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, ToastController, IonList, IonItem, IonInput, IonButton, IonIcon, AlertController } from '@ionic/angular/standalone';
import { LoginService } from 'src/app/service/login.service';
import { Usuario } from 'src/app/modelos/usuario';
import { UsuarioService } from 'src/app/service/usuario.service';
import { RouterLink, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowBackOutline, exitOutline } from 'ionicons/icons';

@Component({
  selector: 'app-outras-informacoes',
  templateUrl: './outras-informacoes.page.html',
  styleUrls: ['./outras-informacoes.page.scss'],
  standalone: true,
  imports: [IonIcon, IonList, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonItem, ReactiveFormsModule, IonInput, IonButton, RouterLink]
})

export class OutrasInformacoesPage implements OnInit {

  private loginService = inject(LoginService)
  private usuarioService = inject(UsuarioService)
  private router = inject(Router)
  private usuarioLogado = JSON.parse(this.loginService.obterUsuarioLogado()!.toString())
  private usuarioId!:number
  
  async exibirMensagem(msg:string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
    });
    
    await toast.present();
  }
  
  private formBuilder = inject(NonNullableFormBuilder);
  protected usuarioForm = this.formBuilder.group({
    nome: ['', [Validators.required, Validators.min(3), Validators.maxLength(100)]],
    nome_de_usuario: ['', [Validators.required, Validators.min(3), Validators.maxLength(20)]],
    email: ['', [Validators.required, Validators.email]],
    fotoPath: null
  });

    public alertButtons = [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          return
        },
      },
      {
        text: 'OK',
        role: 'confirm',
        handler: () => {
          return
        },
      },
    ];

  constructor(private toastController:ToastController, private alertController:AlertController) { 
    let usuarioSemIdESenha:Partial<Usuario> = this.usuarioLogado
    delete usuarioSemIdESenha.id

    
    this.usuarioForm.setValue(this.usuarioLogado)

    addIcons({ arrowBackOutline, exitOutline })
  }
  
  async ngOnInit() {
     this.usuarioId = await JSON.parse(this.loginService.obterUsuarioLogado()!.toString()).id
  }

  protected async alertDeslogar(){
      const alert = await this.alertController.create({
      header: 'Tem certeza?',
      message: 'Você deverá realizar login novamente para ter acesso às suas listas',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            return
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.deslogar()
          },
        },
      ],
    });

    await alert.present();
    }

  alterarInfoUsuario(){   
    this.usuarioService.update(this.usuarioForm.value, this.usuarioId).subscribe({
      next: (res:any) =>{
        this.exibirMensagem("Informações alteradas com sucesso")
        this.loginService.guardarUsuarioLogado(res)
        this.router.navigate(['/main'])
      },
      error: (erro) => {
        this.exibirMensagem(erro.error)
        console.log(erro)
      }
    })
  }

  protected deslogar(){
      this.loginService.removerTokenUsuarioLogado()
      this.loginService.removerUsuarioLogado()
      this.router.navigate(['/home'])
  }

}
