import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonButton, IonImg } from '@ionic/angular/standalone';
import { UploadService } from 'src/app/service/upload.service';
import { LoginService } from 'src/app/service/login.service';
import { UsuarioService } from 'src/app/service/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alterar-foto',
  templateUrl: './alterar-foto.page.html',
  styleUrls: ['./alterar-foto.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonInput, IonButton, IonImg]
})
export class AlterarFotoPage implements OnInit {
  private arquivos:File[] = []
  private uploadService = inject(UploadService)
  private loginService = inject(LoginService)
  private usuarioService = inject(UsuarioService)
  private router = inject(Router)
  private idUsuario!:number
  protected imagePreview: string | ArrayBuffer | null = null;
  

  constructor() { }

  async ngOnInit() {
    if(this.imagePreview == null) this.imagePreview = `../../../assets/icon/8136031.png`
  }

  public async ionViewWillEnter(){
      this.idUsuario = Number( await JSON.parse(this.loginService.obterUsuarioLogado()!.toString()).id)
  }

  protected adicionarArquivos(evento:any){
    const files = evento.target.files as FileList

    if(files[0]){
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result; // Armazena o conteúdo da imagem
      };
      reader.readAsDataURL(files[0]); // Lê a imagem como uma URL de dados
    } 
    this.arquivos.push(files.item(0)!)
  }

  protected enviarArquivos(){
        this.uploadService.upload(this.arquivos).subscribe({
          next: (resposta) => console.log(resposta),
          error: (erro) => console.log(erro),
        });

        this.arquivos = [];
  }

  alterarFoto(){
    this.usuarioService.alterarFotoPerfil(this.idUsuario, this.arquivos[0]).subscribe({
      next: (resposta) => {
        this.loginService.guardarUsuarioLogado(resposta)
        this.router.navigate(["/main"])
      },
      error: (erro) => console.log(erro)
    })
  }

}
