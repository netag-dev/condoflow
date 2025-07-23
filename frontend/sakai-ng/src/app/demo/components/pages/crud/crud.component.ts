import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/demo/api/product';
import { MessageService } from 'primeng/api';
import { ProductService } from 'src/app/demo/service/product.service';
import { CondominService, Condominio } from 'src/app/services/condomin.service';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Route, Router } from '@angular/router';
@Component({
    templateUrl: './crud.component.html',
    providers: [MessageService]
})
export class CrudComponent implements OnInit {

    condominio : any = {
        "id_condominio":0, 
        "nome_condominio": "",
        "tipo_condominio_id":0,
        "sindico_id": 0,
        "endereco_id": 0      
    }

    toggleNewDiv() {
        this.isNewDiv = !this.isNewDiv;
      }

      cols: any[] = [
        { field: 'id_condominio', header: 'Id' },
        { field: 'nome_condominio', header: 'Nome' },
        { field: 'tipo_condominio_id', header: 'Tipo' },
        { field: 'sindico_id', header: 'Sindico' },
        { field: 'endereco_id', header: 'Endereco' },
      ];

    loading = [false, false, false];
    showModal: boolean = false;
    searchQuery: string = '';
    rowsPerPageOptions: number[] = [10, 25, 50]; 
    isNewDiv: boolean;
    tipos: any[] = [];
    sindicos: any[] = [];
    enderecos: any[] = [];
    condominios: any[] = [];

    fecharModal() {
        this.showModal = false;
      }

    constructor(private http:HttpClient ,private condominService: CondominService ,private productService: ProductService, private router: Router) { }

    ngOnInit() {
    this.carregarTipoCondominio();
    this.carregarEndereco(); 
    this.carregarSindico();  
    this.carregarCondominios(); 
     }

     carregarCondominios() {     
        this.condominService.getCondominios().subscribe(
          (data: any) => {
            this.condominios = data.condominios;
            console.log(data);
            const totalCondominios = this.condominios.length;
            console.log('Total de Condomínios:' ,totalCondominios);           
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


     carregarSindico() {
        this.http.get<any[]>('http://192.168.1.59:5000/lista/sindico').subscribe(
          (resultado) => {
            this.sindicos = resultado;
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

    carregarEndereco() {
        this.http.get<any[]>('http://192.168.1.59:5000/endereco').subscribe(
          (resultado) => {
            const res = resultado;
            const values = Object.values(res);
            this.enderecos.push(values[0]);
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

    addCondominio(){
      if(!this.condominio.nome_condominio ||
        !this.condominio.tipo_condominio_id || 
        !this.condominio.sindico_id || 
        !this.condominio.endereco_id ){
        this.mostrarMensagemVazio();
             return; 
              }
             this.http.post('http://192.168.1.59:5000/cadastrar/condominios', this.condominio).subscribe(
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

    displayModal: boolean = false;
    
    verCompleto(){
      this.displayModal = true;
    }



    carregarTipoCondominio(){
        this.http.get<any[]>('http://192.168.1.59:5000/lista/tipocondominio').subscribe(
          (resultado) => {
            this.tipos = resultado;
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

    load(index: number){
        this.loading[index] = true;
        setTimeout(() => this.loading[index] = false, 1000);
      }

      mostrarMensagemSucesso() {
        Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: 'Condomínio inserido com sucesso!',
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
