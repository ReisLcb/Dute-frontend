import { Component, inject, OnInit } from '@angular/core';
  import { CommonModule, NgIf } from '@angular/common';
  import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
  import { IonContent, IonHeader, IonTitle, IonToolbar, IonTab, IonTabs, IonTabBar, IonSearchbar, IonTabButton, IonIcon, ToastController, IonTextarea, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonInput, IonSelect, IonSelectOption, IonButton, IonImg, IonAlert, AlertController, IonModal, IonList, IonItem, IonFab, IonFabButton, IonButtons, IonText } from '@ionic/angular/standalone';
  import { addIcons } from 'ionicons';
  import { addOutline, homeOutline, personCircle, trashOutline, createOutline, ellipsisVerticalOutline, pencilSharp, lockClosedOutline, addCircle, playCircleSharp, play} from 'ionicons/icons';
  import { ListaTarefasService } from 'src/app/service/lista-tarefas.service';
  import { TarefaService } from 'src/app/service/tarefa.service';
  import { Lista_tarefas } from 'src/app/modelos/lista-tarefas';
  import { Tarefa } from 'src/app/modelos/tarefa';
  import { UsuarioService } from 'src/app/service/usuario.service';
  import { Usuario } from 'src/app/modelos/usuario';
  import { LoginService } from 'src/app/service/login.service';
  import { Router, RouterLink } from '@angular/router';
  import { tratar_data } from './funcoes/tratarData'

  @Component({
      selector: 'app-main',
      templateUrl: './main.page.html',
      styleUrls: ['./main.page.scss'],
      standalone: true,
      imports: [IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonTab, IonTabs, IonTabBar, IonTextarea, IonTabButton, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonInput, IonSelect, IonSelectOption, ReactiveFormsModule, IonButton, IonImg, IonAlert, IonImg, RouterLink, IonTextarea, IonSearchbar, IonModal, IonList, IonItem, IonFab, IonFabButton, IonText]
    })
  export class MainPage implements OnInit {

    private listaTarefasService = inject(ListaTarefasService)
    private tarefasService = inject(TarefaService)
    private usuarioService = inject(UsuarioService)
    private loginService = inject(LoginService)
    private router = inject(Router)
    private idUsuario!:number
    
    protected usuarioLogado = JSON.parse(this.loginService.obterUsuarioLogado()!.toString())
    protected listasTarefas:Lista_tarefas[] = []
    protected listasTarefasUsuario:Lista_tarefas[] = []
    protected tarefas:Partial<Tarefa>[]|any[] = []
    protected usuario!:Usuario
    protected imagemSrc:string = `https://dutie-api.onrender.com${this.usuarioLogado.fotoPath}`
    protected isModalOpen:boolean = false
    protected tarefasToogle:Tarefa[] = []
    
    private fb = inject(NonNullableFormBuilder)
    protected fbListaTarefas = this.fb.group({
      usuario_id: this.idUsuario,
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      descricao: [''],
      data_criacao: [new Date().toISOString()],
      visibilidade: ['', [Validators.required]],
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

    public alertButtonsCriarTarefa = [
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
        handler: (res:any) => {
          if(res[0] != "" && res[0] != null && res[0] != undefined){
          let tarefa:Partial<Tarefa> = {
            lista_tarefas_id: undefined ,
            nome: res[0],
            prioridade: '',
            status: "Pendente"
          }
          this.tarefas.push(tarefa)
        }else this.exibirMensagem("A tarefa deve ter um nome")
      },
      },
    ];

    public alertInputs = [
          {
            placeholder: 'Título',
          }
        ];
    
      async canDismiss(data?: undefined, role?: string) {
        return role !== 'gesture';
      } 

    setResult(event: CustomEvent<any>) {
      if(event.detail.role == 'confirm') this.excluirConta()
    }

    public async ionViewWillEnter(){
      this.idUsuario =  Number( await JSON.parse(this.loginService.obterUsuarioLogado()!.toString()).id)
      this.usuarioLogado = this.loginService.obterUsuarioLogado()
      this.carregarDadosUsuario()
      this.obterListaTarefasPublicas()
      this.tarefas = []

      this.fbListaTarefas.patchValue({
        usuario_id: this.idUsuario
      });
    }

    public async ionViewDidEnter(){
      this.idUsuario =  Number( await JSON.parse(this.loginService.obterUsuarioLogado()!.toString()).id)
      this.usuarioLogado = this.loginService.obterUsuarioLogado()
      this.carregarDadosUsuario()
      this.obterListaTarefasPublicas()
      this.recarregarImagem()
    }

    protected tratarData(data:string){
      return tratar_data(data)
    }

    protected carregarDadosUsuario(){
      this.obterListaTarefasPorUsuario()
      this.usuarioLogado = JSON.parse(this.loginService.obterUsuarioLogado()!.toString())
    }

    protected limparFormulario(){
      this.fbListaTarefas.patchValue({
         usuario_id: this.idUsuario,
         titulo: '',
         descricao: '',
        visibilidade: ''
      })
      
      this.tarefas = []
    }

    async exibirMensagem(msg:string) {
      const toast = await this.toastController.create({
        message: msg,
        duration: 3000,
        position: 'bottom',
      })

      await toast.present()
    }

    recarregarImagem() {
      const usuario = JSON.parse(this.loginService.obterUsuarioLogado()!.toString())
      if(usuario.fotoPath == null){
        this.imagemSrc = '../../../assets/icon/images.jpeg';
      }
      else{
        setTimeout(() => {
        this.imagemSrc = `https://dutie-api.onrender.com${this.usuarioLogado.fotoPath}`; // Reinicia o src com o mesmo valor
    }, 100); // Timeout necessário para que o Angular detecte a mudança
  } 
  }

    protected pesquisarListaUsuarioTitulo(evento:any){
      const target = evento.target as HTMLIonSearchbarElement;
      const query = target.value || '';

      this.listasTarefasUsuario = this.listasTarefasUsuario.filter((lista) => lista.titulo.toLocaleLowerCase().includes(query.toLocaleLowerCase()))
      if(query == '') this.obterListaTarefasPorUsuario()
    }

    setOpen(bool:boolean, idLista:number){
      if(bool){
        this.tarefasService.getByListId(idLista).subscribe({
        next: (res) => {
          this.tarefasToogle = res
          console.log(res)
        },
        error: (err) => console.log(err)
      })
      }

      this.isModalOpen = bool
    }

    constructor(private toastController:ToastController, private alertController:AlertController) { 
      addIcons({ addOutline, homeOutline, personCircle, trashOutline, createOutline, ellipsisVerticalOutline, pencilSharp, lockClosedOutline, addCircle, play });
      this.obterListaTarefasPublicas()
    }
    
    async ngOnInit() {
      this.idUsuario =  Number( await JSON.parse(this.loginService.obterUsuarioLogado()!.toString()).id)
      
      this.carregarDadosUsuario()
      }
    
    protected excluirFotoPerfil(){
      this.usuarioService.excluirFotoPerfil(this.idUsuario).subscribe({
        next: (resposta) => {
          this.exibirMensagem("Foto exluída com sucesso")
          this.loginService.guardarUsuarioLogado(resposta)
          this.recarregarImagem()
        },
        error: (erro) => this.exibirMensagem(erro.error)
      })
    }

    protected obterListaTarefasPublicas() {
      this.listaTarefasService.getAll().subscribe({
        next: (listas) => {
          this.listasTarefas = listas.filter((lista) => lista.visibilidade == "Pública")

          this.listasTarefas.forEach(lista => {
            this.tarefasService.getByListId(lista.id).subscribe({
              next: (tarefas) => {
                lista.tarefas = tarefas.filter((tarefa) => tarefa.status != "Cancelada");
              },
              error: (erro) => this.exibirMensagem(erro)
            });
          });
        },
        error: (erro) => this.exibirMensagem(erro)
      });
    }

    protected excluirConta(){
      this.usuarioService.delete(this.idUsuario).subscribe({
        next: () => {
          this.loginService.removerTokenUsuarioLogado()
          this.loginService.removerUsuarioLogado()
          this.exibirMensagem("Conta deletada com sucesso")
          this.router.navigate(["/home"])
        },
        error: () => this.exibirMensagem("Erro ao excluir usuário")
      })
    }

    protected obterListaTarefasPorUsuario() {
      this.listaTarefasService.getByUserId(this.idUsuario).subscribe({

        next: (listas) => {
          this.listasTarefasUsuario = listas
          
          this.listasTarefasUsuario.forEach(lista => {
            this.tarefasService.getByListId(lista.id).subscribe({
              next: (tarefas) => {
                  lista.tarefas = tarefas.filter((tarefa) => tarefa.status != "Cancelada");},
              error: (erro) => this.exibirMensagem(erro)
            });
          });
        },
        error: (erro) => this.exibirMensagem(erro)
      });
    }

    protected async obterListaPorId(idLista:number){
      return this.listaTarefasService.getById(idLista)
    }

    protected criarListaTarefas(){
      let ok:boolean = true

      for(let tarefa of this.tarefas){
        if(tarefa.prioridade == '') ok = false
      }

      if(ok){
        this.listaTarefasService.create(this.fbListaTarefas.value).subscribe({
          next: (resposta) => {
            let res = resposta as Lista_tarefas
            this.guardarIdLista(res.id)

            for(let tarefa of this.tarefas){
              tarefa.lista_tarefas_id = res.id
              this.tarefasService.create(tarefa).subscribe({
                next: () => {},
                error: (erro) => console.log(erro)
              })
            }
            this.router.navigate(['/sessao-tarefas'])
            this.exibirMensagem("Lista criada com sucesso")
          },
          error: (erro) => {
            this.exibirMensagem(erro.error)
            console.log(erro)
          }
        })
      } else this.exibirMensagem("As tarefas devem ter prioridades")
    }  

    protected excluirLista(idLista:number){
      this.listaTarefasService.delete(idLista).subscribe({
        next: () => {
          this.exibirMensagem("Lista de tarefas excluída com sucesso")
          this.obterListaTarefasPorUsuario()
          this.obterListaTarefasPublicas()
        },
        error: (erro) => this.exibirMensagem(erro.error)
      })

    }

    protected async alertExcluirLista(lista_id:number){
      const alert = await this.alertController.create({
      header: 'Tem certeza?',
      message: 'Esta ação não pode ser desfeita',
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
            this.excluirLista(lista_id)
          },
        },
      ],
    });

    await alert.present();
    }

    protected guardarIdLista(lista_id:number){
      let ID_LISTA_KEY = 'id-lista-key'
      
      return localStorage.setItem(ID_LISTA_KEY, lista_id.toString())
    }

    protected obterIdLista(){
      let ID_LISTA_KEY = 'id-lista-key'
      
      return localStorage.getItem(ID_LISTA_KEY)
    }

    protected async obterUsuarioPorId(id:number){
      let usuario!:Usuario
      this.usuarioService.getById(id).subscribe({
        next: (resposta) => {
            usuario = resposta as Usuario
            return usuario
        },
        error: () =>  {
          return null
        }
      })
      return usuario.nome_de_usuario
    }

    protected removerTarefa(index:number){
      this.tarefas.splice(index, 1)
      this.exibirMensagem("Tarefa removida com sucesso")
    }

    protected atribuirPrioridade(index:number, event:any){
      const prioridade = event.detail.value
      this.tarefas[index].prioridade = prioridade
    }
}
