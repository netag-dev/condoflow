import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { SindicosService, Sindico } from 'src/app/services/sindicos.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
    templateUrl: './buttondemo.component.html'
})
export class ButtonDemoComponent implements OnInit {


    items: MenuItem[] = [];

    loading = [false, false, false, false];
    isNewDiv: boolean;
    sindicos: Sindico[] = [];
    enderecos: any[] = [];
    status: any[] = [];
    representatives: any[] = []; 
    statuses: any[] = [];
    searchQuery: string = '';
    rowsPerPageOptions: number[] = [10, 25, 50];
    showModal: boolean = false; 
    
    constructor(private router: Router,private sindicoService: SindicosService, private http:HttpClient) {}
    
    cols: any[] = [
        { field: 'id_pessoa', header: 'Id' },
        { field: 'nome_pessoa', header: 'Nome' },
        { field: 'telefone_pessoa', header: 'Telefone' },
        { field: 'endereco_id', header: 'Endereço' },
        { field: 'status_id', header: 'Estado' },
        { field: 'bi_pessoa', header: 'Bilhete de identidade' }
      ];

      sindico: any = {
        "id_pessoa": 0,
        "nome_pessoa": "",
        "telefone_pessoa": "",
        "endereco_id": 0,
        "status_id": 0,
        "bi_pessoa": ""
      };

      toggleNewDiv() {
        this.isNewDiv = !this.isNewDiv;
      }

      addSindico() {
        if(!this.sindico.nome_pessoa ||
        !this.sindico.telefone_pessoa || 
        !this.sindico.endereco_id || 
        !this.sindico.status_id ){
        this.mostrarMensagemVazio();
         return; 
          }
         this.http.post('http://127.0.0.1:5000/cadastrar/sindico', this.sindico).subscribe(
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

    carregarEndereco() {
        this.http.get<any[]>('http://127.0.0.1:5000/endereco').subscribe(
          (resultado) => {
            const res = resultado;
            const values = Object.values(res);
            this.enderecos.push(values[0]);
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

        carregarSindicos(){
            this.sindicoService.getSindicos().subscribe(
                (data: any) => {
                  this.sindicos = data;
                  console.log(data);
                  const totalSindicos = data.length;
                  console.log('Total de Síndicos:' , totalSindicos);           
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
        carregarStatus() {
            this.http.get<any[]>('http://127.0.0.1:5000/status').subscribe(
              (resultado) => {
                const res = resultado;
                const values = Object.values(res);
                this.status.push(values[0]);
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
     
     
    ngOnInit() {
       this.carregarSindicos()
       this.carregarEndereco()
       this.carregarStatus()
    }

    load(index: number) {
        this.loading[index] = true;
        setTimeout(() => this.loading[index] = false, 1000);
    }
    

    mostrarMensagemSucesso() {
        Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: 'Síndico inserido com sucesso!',
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
