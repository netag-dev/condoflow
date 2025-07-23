import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MoradoresService, Morador } from 'src/app/services/moradores.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Unidade, UnidadesService } from 'src/app/services/unidades.service';

@Component({
    templateUrl: './filedemo.component.html',
    providers: [MessageService]
})
export class FileDemoComponent implements OnInit {

    loading = [false, false, false];
    unidades: Unidade[] = [];
    isNewDiv: boolean = false;
    divModify: boolean = false;
    representatives: any[] = [];
    statuses: any[] = [];
    searchQuery: string = '';
    rowsPerPageOptions: number[] = [10, 25, 50];
    listaMoradores: any[] = [];

    morador: Morador = {
        nome_pessoa: "",
        email: "",
        telefone_pessoa: "",
        bi_pessoa: "",
        senha_usuario: "",
        fk_unidade: "",
        fk_tipo_acesso: 3,
        id_morador : "",
        id_pessoa : "",
    };
    showModal: boolean = false;

    constructor(
        private unidadeService: UnidadesService,
        private moradoresService: MoradoresService,
        private http: HttpClient,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.carregarUnidades();
        this.carregarMoradores()
    }

    carregarUnidades() {

      this.unidadeService.getUnidades().subscribe({
        next:(dados)=>{
          this.unidades = dados
        },
        error:(error)=>{
          console.error(`Erro ao carregar as aunidades : ${error}`)
        }
      })

    }

    abrirJanelaEditar(morador: any){
      this.morador = {... morador}
      this.divModify = true
      console.log(this.morador)
    }

    fecharModal() {
        this.showModal = false;
    }

    addMoradores() {
        this.http.post('http://192.168.1.59:5000/cadastrar/morador', this.morador).subscribe(
          (resposta: any) => {
            if (resposta.mensagem) {
              if (resposta.mensagem.includes('sucesso')) {
                this.mostrarMensagemSucesso(resposta.mensagem);
                setTimeout(() => {
                  window.location.reload();
                }, 2000);
              } else if (resposta.mensagem.includes('ocupada')) {
                this.mostrarMensagemErro('Erro: Essa unidade está ocupada.');
              } else {
                this.mostrarMensagemErro('Erro desconhecido: ' + resposta.mensagem);
              }
            } else {
              console.error(resposta);
              this.mostrarMensagemErro('Erro ao cadastrar morador.');
            }
          },
          (error: any) => {
            console.error(error);
            this.mostrarMensagemErro('Erro ao conectar com a API.');
          }
        );
      }
    
      mostrarMensagemSucesso(mensagem: string) {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: mensagem,
          showConfirmButton: false,
          timer: 1500
        });
      }
    
      mostrarMensagemErro(mensagem: string) {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title:mensagem,
          showConfirmButton: false,
          timer: 2000
        });
      }
    

    carregarMoradores(){
      this.http.get<any>('http://192.168.1.59:5000/lista/moradores').subscribe(
       data => {
        this.listaMoradores = data;
        console.log(data);
       },
       error => {
        console.error('Erro ao carregar moradores:', error);
       }
      );
    }

    toggleNewDiv() {
        this.isNewDiv = !this.isNewDiv;
    }

    load(index: number) {
        this.loading[index] = true;
        setTimeout(() => this.loading[index] = false, 1000);
    }


    eliminarMorador(idMorador: any){
        this.http.delete<{mensagem: any}>(`http://192.168.1.59:5000/deletar/morador/${idMorador}`).subscribe({
          next:(dados)=>{
            Swal.fire({
              icon: 'success',
              title: 'Aviso',
              text: dados.mensagem,
              confirmButtonText: 'OK'
          });
          this.carregarMoradores()
          }, 
          error:(error)=>{
            Swal.fire({
              icon: 'warning',
              title: 'Aviso',
              text: "Erro ao eliminar morador",
              confirmButtonText: 'OK'
          });
          }
        })
    }

    salvarEditar(){
      this.http.put<{mensagem: any}>(`http://192.168.1.59:5000/editar/morador/${this.morador.id_pessoa}`,this.morador).subscribe({
            next:(dados)=>{
              Swal.fire({
                icon: 'success',
                title: 'Sucesso!',
                text: dados.mensagem,
                confirmButtonText: 'Ok'
              });
              this.carregarMoradores()
              this.divModify = false
            },
            error:(error)=>{
              Swal.fire({
                icon: 'success',
                title: 'Sucesso!',
                text: "Erro ao Editar um Porteiro",
                confirmButtonText: 'Ok'
              });
            }
          })
    }



    mostrarMensagemVazio() {
        Swal.fire({
            icon: 'warning',
            title: 'Aviso',
            text: 'Preencha os campos corretamente!',
            confirmButtonText: 'OK'
        });
    }

    mostrarMensagemInfo() {
        Swal.fire({
            icon: 'warning',
            title: 'Aviso',
            text: 'Dado já existente, verifique os dados por favor!',
            confirmButtonText: 'Ok'
        });
    }

    mostrarMensagemClient() {
        Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Erro desconhecido, entre em contacto com o administrador.',
            confirmButtonText: 'Ok'
        });
    }

    mostrarMensagemPage() {
        Swal.fire({
            icon: 'warning',
            title: 'Aviso',
            text: 'Essa página não existe!',
            confirmButtonText: 'Ok'
        });
    }

    updateMessage() {
        Swal.fire({
            icon: 'success',
            title: 'Sucesso',
            text: 'Atualizado com sucesso!',
            confirmButtonText: 'OK'
        });
    }
}
