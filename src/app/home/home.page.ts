import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NonNullableFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonList, IonIcon, IonItem, IonButton, IonInput, ToastController, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle  } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { LoginService } from '../service/login.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonContent, CommonModule, FormsModule, IonList, IonItem, IonButton, ReactiveFormsModule, IonInput, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle]
})
export class HomePage{
  private router = inject(Router)
  private LoginService = inject(LoginService)

  constructor(private toastController: ToastController) {}

  async exibirMensagem(msg:string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
    })

    await toast.present()
  }

  public ionViewWillEnter(){
    this.usuarioForm.patchValue({
      nome_de_usuario: '',
      senha: ''
    })
  }

  private formBuilder = inject(NonNullableFormBuilder);
  protected usuarioForm = this.formBuilder.group({
    nome_de_usuario: ['', [Validators.required]],
    senha: ['', [Validators.required]],
  });

  protected login(){
    this.LoginService.autenticar(this.usuarioForm.value)
  }

  protected irPaginaCadastro(){
    this.router.navigate(['/cadastro'])
  }
}
