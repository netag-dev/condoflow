import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { EstacionamentosService, Estacionamento } from 'src/app/services/estacionamentos.service';

@Component({
    templateUrl: './inputdemo.component.html',

})
export class InputDemoComponent implements OnInit {
  

    loading = [false, false, false];
    status: any[] = [];
    isNewDiv: boolean;
    representatives: any[] = []; 
    statuses: any[] = [];
    searchQuery: string = '';
    rowsPerPageOptions: number[] = [10, 25, 50];
    unidades: any[] = []; 
    blocos: any[] = [];
    tipoEstacionamentos: any[] = [];
    status_condo: any[] = [];
    estaciona: Estacionamento[] = [];

    isAlugado(status: string): boolean {
        return status === 'Alugado';
    }
    
    isDisponivel(status: string): boolean {
        return status === 'Disponível';
    }

    isOcupado(status: string): boolean {
        return status === 'Ocupado';
    }

    carregarUnidades(){
    this.http.get<any[]>('http://127.0.0.1:5000/lista/unidade').subscribe(
        (resultado) => {
            this.unidades = resultado;
            console.log(resultado)
        }
    )
    }

    carregarBlocos(){
        this.http.get<any[]>('http://127.0.0.1:5000/lista/blocos').subscribe(
            (resultado: any) => {
                this.blocos = resultado.blocos;
                console.log(resultado)
            }
        )
        }

        carregarTipoEstacionamento(){
            this.http.get<any[]>('http://127.0.0.1:5000/lista/tipoEstacionamento').subscribe(
                (resultado) => {
                    this.tipoEstacionamentos = resultado
                    console.log(resultado)
                }
            )
            }

    carregarStatus(){
        this.http.get<any[]>('http://127.0.0.1:5000/lista/status_condo').subscribe(
            (resultado) => {
                this.status_condo = resultado
                console.log(resultado)
            }
        )
    }
     
    carregarEstacionamentos(){
         this.estacionamentoService.getEstacionamentos().subscribe(
            (data: any) => {
            this.estaciona = data;
            console.log(data);
            }
         )
    }

    ngOnInit() {
       this.carregarUnidades();
       this.carregarBlocos();
       this.carregarTipoEstacionamento();
       this.carregarStatus();
       this.carregarEstacionamentos();
       
    }

    estacionamentos: any = {
        "id_estacionamento":0,
        "serie_estacionamento": "",
        "unidade_id": "",
        "bloco_id": "",
        "tipo_estacionamento_id": "",
        "status_condo_id": ""
    }

    cols: any[] = [
        { field: 'id_estacionamento', header: 'Id' },
        { field: 'serie_estacionamento', header: 'Serie' },
        { field: 'unidade_id', header: 'Unidade' },
        { field: 'bloco_id', header: 'Bloco' },
        { field: 'tipo_estacionamento_id', header: 'Tipo de estacionamento' },
        { field: 'status_condo_id', header: 'Estado' }
      ];

    toggleNewDiv() {
        this.isNewDiv = !this.isNewDiv;
      }

    constructor(private http: HttpClient, private router: Router, private estacionamentoService:EstacionamentosService) { }


    addEstacionamento() {
        if(!this.estacionamentos.serie_estacionamento ||
        !this.estacionamentos.unidade_id || 
        !this.estacionamentos.bloco_id || 
        !this.estacionamentos.tipo_estacionamento_id || 
        !this.estacionamentos.status_condo_id){
        this.mostrarMensagemVazio();
         return; 
          }
         this.http.post('http://127.0.0.1:5000/cadastrar/estacionamento', this.estacionamentos).subscribe(
           (response: any) => {
             if (response.mensagem) {
               this.mostrarMensagemSucesso();
                setTimeout(() => {
                 window.location.reload();
                }, 2000)
             } else {
              //  this.mostrarMensagemErro();
             }
           },
           (error: any) => {
             if (error.status === 400) {
               this.mostrarMensagemClient();
             } else if (error.status === 404) {
               this.mostrarMensagemPage();
               this.router.navigateByUrl('/');
             } else if (error.status === 500) {
                   this.mostrarMensagemInfo();
             } else {
               //this.mostrarMensagemErro();
             }
           }
         );
       }  
       /* Fim do método Para cadastrar .  */

    load(index: number){
        this.loading[index] = true;
        setTimeout(() => this.loading[index] = false, 1000);
      }

      mostrarMensagemSucesso() {
      Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: 'Estacionamento inserido com sucesso!',
        confirmButtonText: 'Ok'
      });
    }
  
    mostrarMensagemErro() {
       Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Erro ao cadastrar!',
          confirmButtonText: 'Ok'
       })
    }
  
    mostrarMensagemVazio(){
       Swal.fire({
         icon: 'warning',
         title: 'Aviso',
         text: 'Preencha os campos corretamente!',
         confirmButtonText: 'OK'
       })
    }
  
    mostrarMensagemInfo(){
       Swal.fire({
         icon: 'warning',
         title: 'Aviso',
         text: 'Dado já existente, verifique os dados por favor!',
         confirmButtonText: 'Ok'
       })
    }
  
    mostrarMensagemClient(){
       Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Erro desconhecido entre em contacto com o administrador.',
          confirmButtonText: 'Ok'
       })
    }
  
    mostrarMensagemPage(){
       Swal.fire({
           icon: 'warning',
           title: 'Aviso',
           text: 'Essa página não existe!',
           confirmButtonText: 'Ok'
       })
    }
  
    updateMessage(){
       Swal.fire({
         icon: 'success',
         title: 'Sucesso',
         text: 'Atualizado com sucesso!',
         confirmButtonText: 'OK'
       })
    }
    

}
