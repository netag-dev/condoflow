import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UnidadesService } from 'src/app/services/unidades.service';

@Component({
    templateUrl: './documentation.component.html',
    styleUrls: ['./documentation.component.scss']
})
export class DocumentationComponent implements OnInit{ 

    isNewDiv: boolean;
    loading = [false, false, false];
    showModal: boolean = false;
    status: any[] = [];
    searchQuery: string = '';
    rowsPerPageOptions: number[] = [10, 25, 50]; 
    tipoUnidades: any[] = [];
    blocos: any[] = [];
    unities: any[] = [];

     constructor(private unidadeService: UnidadesService, private router:Router, private http:HttpClient){}

    cols: any[] = [
        { field: 'id_unidade', header: 'Id'},
        { field: 'numero_quarto_unidade', header: 'Número de Quarto'},
        { field: 'metragem_unidade', header: 'Metragem'},
        { field: 'tipo_unidade_id', header: 'Tipo de unidade'},
        { field: 'bloco_id', header: 'Bloco'}
      ];

    unidades: any = {
        "id_unidade": 0,
        "numero_quarto_unidade":0,
        "metragem_unidade": "",
        "tipo_unidade_id": 0,
        "bloco_id": 0
        };
     
        carregarTiposUnidades(){
            this.http.get<any[]>('http://127.0.0.1:5000/lista/tipoUnidades').subscribe(
                (resultado) => {
                  this.tipoUnidades = resultado;
                   console.log(resultado);
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
                   // this.mostrarMensagemErro();
                  }
                }
              );
        }
          
        carregarBlocos(){
            this.http.get<any[]>('http://127.0.0.1:5000/lista/blocos').subscribe(
                (resultado:any) => {
                  this.blocos = resultado.blocos;
                   console.log(resultado);
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
                   // this.mostrarMensagemErro();
                  }
                }
              );
        }

        carregarUnidades(){
            this.unidadeService.getUnidades().subscribe(
              (data: any) => {
                this.unities = data;
                console.log(data)
              }  
            )
        }

        ngOnInit(): void {

         this.carregarTiposUnidades();
         this.carregarBlocos();
         this.carregarUnidades();
     }  

     toggleNewDiv() {
        this.isNewDiv = !this.isNewDiv;
      }

      addUnidade() {
        if(!this.unidades.numero_quarto_unidade ||
        !this.unidades.metragem_unidade || 
        !this.unidades.tipo_unidade_id || 
        !this.unidades.bloco_id ){
        this.mostrarMensagemVazio();
         return; 
          }
         this.http.post('http://127.0.0.1:5000/cadastrar/unidade', this.unidades).subscribe(
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
          text: 'Unidade inserido com sucesso!',
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
            text: 'Número de quarto inválido!',
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