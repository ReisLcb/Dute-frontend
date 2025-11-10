import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonSelectOption, IonButton, IonSelect, IonTextarea, IonInput, IonItem, ToastController, IonList, IonIcon } from "@ionic/angular/standalone"
import { Router, RouterLink } from '@angular/router';
import { ListaTarefasService } from 'src/app/service/lista-tarefas.service';
import { Lista_tarefas } from 'src/app/modelos/lista-tarefas';
import { TarefaService } from 'src/app/service/tarefa.service';
import { Tarefa } from 'src/app/modelos/tarefa';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';


@Component({
  selector: 'app-lista-tarefas-update',
  templateUrl: './lista-tarefas-update.page.html',
  styleUrls: ['./lista-tarefas-update.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonSelectOption, IonButton, FormsModule, ReactiveFormsModule, RouterLink, IonSelect, IonTextarea, IonInput, IonItem, IonList, IonIcon]
})

export class ListaTarefasUpdatePage implements OnInit {

  private idLista!:number
  private listaSelecionada!:any
  private listaService = inject(ListaTarefasService)
  private tarefasService = inject(TarefaService)
  private router = inject(Router)

  protected tarefas:Tarefa[] = []

  async exibirMensagem(msg:string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
    })

    await toast.present()
  }

  constructor(private toastController:ToastController) {
    if(this.listaSelecionada){
      let listaSemId:Partial<Lista_tarefas> = this.listaSelecionada
      delete listaSemId.id      
    }
   }

  private fb = inject(NonNullableFormBuilder)
    protected fbListaTarefas = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      descricao: [''],
      data_ultima_alteracao: [new Date().toISOString()],
      visibilidade: ['', [Validators.required]],
    });

  public ionViewWillEnter(){
      this.listaService.getById(this.idLista).subscribe({
        next: (resposta) => {
          this.listaSelecionada = resposta;

          // Aqui é onde você deve preencher o formulário
          this.fbListaTarefas.patchValue({
            titulo: this.listaSelecionada.titulo,
            descricao: this.listaSelecionada.descricao,
            visibilidade: this.listaSelecionada.visibilidade
          });
        },
        error: (erro) => this.exibirMensagem(erro.error)
      });
      this.obterTarefasDaLista()
  }

  async ngOnInit() {
    this.idLista = this.obterIdLista()
  }

  obterIdLista():number{
    return parseInt(localStorage.getItem('id-lista-key')!.toString())
  }

  protected alterarListaTarefas(){
    if(this.idxTarefasParaRemover.length > 0){
      this.idxTarefasParaRemover.forEach((idTarefa) => {
        this.tarefasService.delete(idTarefa).subscribe({
          next: () => {
            console.log(`Tarefa de id ${idTarefa} removida com sucesso.`)
          },
          error: (erro) => this.exibirMensagem("Erro ao remover tarefa de id ")
        })
      })
    }

    for(let tarefa of this.tarefas){
      this.tarefasService.update(tarefa.codigo, tarefa).subscribe({
        next: (res) => {
          console.log(`Tarefa de id ${tarefa.codigo} atualizada com sucesso.`)
        },
        error: (erro) => this.exibirMensagem("Erro ao atualizar tarefa de id " + tarefa.codigo)
      })
    }
    this.listaService.update(this.idLista, this.fbListaTarefas.value).subscribe({
      next: () => {
        this.exibirMensagem("Lista de tarefas alterada com sucesso")
        this.router.navigate(['/main'])
    },
      error: (erro) => this.exibirMensagem(erro.error)
    })

  }

  protected obterTarefasDaLista(){
    let idLista = this.obterIdLista() 

    return this.tarefasService.getByListId(idLista).subscribe({
      next: (resposta) => {
        this.tarefas = resposta
      },
      error: (erro) => this.exibirMensagem(erro.error)
    })
  }

  protected atribuirPrioridade(index:number, event:any){
      const prioridade = event.detail.value
      this.tarefas[index].prioridade = prioridade
  }
}
