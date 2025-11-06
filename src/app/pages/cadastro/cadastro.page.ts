import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NonNullableFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonList, IonItem, IonButton, IonInput, ToastController, IonInputPasswordToggle, IonToolbar, IonIcon, IonHeader } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService } from 'src/app/service/usuario.service';
import { addIcons } from 'ionicons';
import { arrowBackOutline, trashOutline } from 'ionicons/icons';
import { UploadService } from 'src/app/service/upload.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
  standalone: true,
  imports: [IonIcon, IonContent, CommonModule, FormsModule, IonList, IonItem, IonButton, ReactiveFormsModule, IonInput, IonInputPasswordToggle, IonToolbar, IonIcon, IonHeader, RouterLink]
})
export class CadastroPage {
  private router = inject(Router)
  private UsuarioService = inject(UsuarioService)
  private uploadService = inject(UploadService)
  private arquivos : File[] = []

  private formBuilder = inject(NonNullableFormBuilder);
  protected usuarioForm = this.formBuilder.group({
    nome: ['', [Validators.required, Validators.min(3), Validators.maxLength(100)]],
    nome_de_usuario: ['', [Validators.required, Validators.min(3), Validators.maxLength(20)]],
    email: ['', [Validators.required, Validators.email, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)]],
    senha: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(private toastController: ToastController) {
    addIcons({ arrowBackOutline, trashOutline });
  }

  async exibirMensagem(msg:string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
    });

    await toast.present();
  }

  protected adicionarArquivos(evento:any){
    const files = evento.target.files as FileList

    this.arquivos.push(files.item(0)!)
  }

  protected enviarArquivos(){
        this.uploadService.upload(this.arquivos).subscribe({
          next: (resposta) => console.log(resposta),
          error: (erro) => console.log(erro),
        });

        this.arquivos = [];
  }

  public ionViewWillEnter(){
    this.usuarioForm.patchValue({
      nome: '',
      nome_de_usuario: '',
      email: '',
      senha: ''
    })
  }


  protected cadastrar(){
        this.UsuarioService.cadastrar(this.usuarioForm.value, this.arquivos[0]).subscribe({
          next: () =>{
            this.exibirMensagem(`Bem-vindo, ${this.usuarioForm.value.nome_de_usuario}!`)
            this.router.navigate(['/home'])
          },

          error: (erro) => {
            this.exibirMensagem(erro.error)
            alert(JSON.stringify(erro))
          }
        })
  }
}
