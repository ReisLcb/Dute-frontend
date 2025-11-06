import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonList, IonItem, IonButton, IonIcon, IonCardSubtitle, IonFab, IonFabButton, ToastController, IonAlert, AlertController } from '@ionic/angular/standalone';
import { Tarefa } from 'src/app/modelos/tarefa';
import { Lista_tarefas } from 'src/app/modelos/lista-tarefas';
import { ListaTarefasService } from 'src/app/service/lista-tarefas.service';
import { TarefaService } from 'src/app/service/tarefa.service';
import { addIcons } from 'ionicons';
import { checkmarkOutline, trashOutline, closeOutline, createOutline, pauseOutline, playOutline } from 'ionicons/icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sessao-tarefas',
  templateUrl: './sessao-tarefas.page.html',
  styleUrls: ['./sessao-tarefas.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonCard, IonCardHeader, IonCardTitle, IonList, IonItem, IonButton, IonIcon, IonCardSubtitle, IonFab, IonFabButton, IonAlert]
})
export class SessaoTarefasPage implements OnInit {
  
  protected carregando: boolean = true;

  private listaTarefasService = inject(ListaTarefasService)
  private tarefaService = inject(TarefaService)
  private intervalId: any;
  private router = inject(Router);

  protected lista_tarefas!:Partial<Lista_tarefas>;
  protected tarefas:Tarefa[] = []
  protected listaTarefaId!:number;
  protected tarefaSelecionada!:number;
  protected tempoDecorrido: number = 0; // em milissegundos
  protected timerPausado: boolean = false;

  public async ionViewWillEnter(){
    this.listaTarefaId = parseInt(this.obterListaId()!.toString())
    await this.obterListaTarefas(this.listaTarefaId)
    console.log(this.lista_tarefas)
  }

  public async ionViewDidEnter(){
    setTimeout(() => {
      
      this.obterTarefas(this.listaTarefaId)
      this.listaTarefasService.getById(this.listaTarefaId).subscribe({
        next: (resposta) => {
          this.lista_tarefas = resposta
          console.log(this.lista_tarefas)
        },
        error: (erro) => console.log(erro)
      })
    }, 1000);
  }

    async exibirMensagem(msg:string) {
      const toast = await this.toastController.create({
        message: msg,
        duration: 3000,
        position: 'bottom',
      })

      await toast.present()
    }

      public alertButtonsCancelarLista = [
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
          this.cancelarLista()
      },
      },
    ];

    async alertEditarTarefa() {
    const alert = await this.alertController.create({
      header: 'Editar tarefa',
      inputs: [{
        placeholder: "Nome"
      }],
      buttons: [{
         text: 'OK',
        role: 'confirm',
        handler: (res:any) => {
          let tarefa = this.tarefas.find(t => t.codigo === this.tarefaSelecionada);
          
          if (tarefa) {
            let nome:string = res[0].trim()
            if(nome == "" || nome == null || nome == undefined){
              console.log(res[0])
              this.exibirMensagem("A tarefa deve ter um nome")
            } else {
              this.tarefaService.update(Number(tarefa.codigo), tarefa).subscribe({
                next: (resposta) => {
                  console.log("Tarefa atualizada no backend:", resposta);
                },
                error: (erro) => {
                  console.log("Erro ao atualizar a tarefa no backend:", erro);
                }
              });
              tarefa.nome = res[0];
              this.exibirMensagem("Tarefa editada com sucesso!");
            }
          }

      },
      },
      {
        text: "Cancelar",
        role: "cancel"
      }
    ]
    });

    await alert.present();
  }

  async alert(header: string, subHeader:string) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      buttons: ['OK']
  })
  await alert.present()
  }

  private iniciarTimer() {
      this.intervalId = setInterval(() => {
        this.tempoDecorrido += 1000; // adiciona 1 segundo
      }, 1000);
  }

  protected pausarTimer(){
    if(!this.timerPausado){
      clearInterval(this.intervalId)
      this.timerPausado = true
      this.exibirMensagem('Timer pausado'); 
    }
  }

  protected retomarTimer() {
    if (this.timerPausado) {
      this.iniciarTimer();
      this.timerPausado = false;
      this.exibirMensagem('Timer retomado');
    }
  }

  constructor(private toastController: ToastController, private alertController:AlertController) {
    addIcons({ checkmarkOutline, trashOutline, closeOutline, createOutline, pauseOutline, playOutline })
    this.iniciarTimer();
   }

  ngOnInit() {}

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  private async obterListaTarefas(id_lista:number){
    this.listaTarefasService.getById(id_lista).subscribe({
      next: (resposta) => {
        this.lista_tarefas = resposta
        this.carregando = false; // Libera a renderização
        console.log(this.lista_tarefas)
      },
      error: (erro) => console.log(erro)
    })
  }

  private obterTarefas(id_lista:number){
    return this.tarefaService.getByListId(id_lista).subscribe({
      next: (resposta) => {
        this.tarefas = resposta
        console.log(this.tarefas)
      },
      error: (erro) => console.log(erro)
    })
  }

  private obterListaId(){
    return localStorage.getItem("id-lista-key")
  }

  protected concluirTarefa(index:number){
    let tarefa = this.tarefas[index];
    if(tarefa.status != "Cancelada") tarefa.status = "Concluída"
  }

  protected cancelarTarefa(index:number){
    let tarefa = this.tarefas[index];
    if(tarefa.status != "Concluída") tarefa.status = "Cancelada"
  }

  protected excluirTarefa(index:number, tarefa_id:number){
    this.tarefas.splice(index, 1)
    this.tarefaService.delete(tarefa_id).subscribe({
      next: (resposta) => {
        this.exibirMensagem("Tarefa excluída com sucesso!");
      },
      error: (erro) => {
        this.exibirMensagem("Erro ao excluir a tarefa");
      }
    })
    if(this.tarefas.length < 1) {
      this.alert("Finalizando lista", "Sua lista deve ter ao menos uma tarefa, cancelando lista...")
      this.cancelarLista()
    }
  }

  protected finalizarSessao(){
    clearInterval(this.intervalId); // parar timer
    let i = 0
    for(let tarefa of this.tarefas){
      this.tarefaService.update(Number(tarefa.codigo), tarefa).subscribe({
        next: (resposta) => {
          if(i == 0){
            this.exibirMensagem("Lista finalizada com sucesso!");
            i++
          }
          this.router.navigate(['/main']);
        },
        error: (erro) => {
          this.exibirMensagem("Erro ao finalizar a lista");}
      })
  }

  this.lista_tarefas!.tempo_decorrido = document.getElementById('tempo-decorrido')?.innerText as unknown as number;

  this.listaTarefasService.update(this.listaTarefaId, this.lista_tarefas).subscribe({
    next: (resposta) => {
      console.log("Lista de tarefas atualizada com o tempo total:", resposta);
    },
    error: (erro) => {
      console.log("Erro ao atualizar a lista de tarefas com o tempo total:", erro);
    }
  });
}

  protected cancelarLista(){
    this.listaTarefasService.delete(this.listaTarefaId).subscribe({
      next: () =>{
        this.exibirMensagem("Lista cancelada com sucesso")
        this.router.navigate(['/main'])
      },
      error: () => {
        this.exibirMensagem("Erro ao cancelar lista de tarefas")
      }
    })
  }

  protected editarTarefa(index: number) {
    this.tarefaSelecionada  = this.tarefas[index].codigo;
    console.log(this.tarefaSelecionada);
    this.alertEditarTarefa()
  }
}
