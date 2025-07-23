import { Component, OnInit } from '@angular/core';
import { Reserva, ReservasService } from 'src/app/services/reservas.service';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthServiceService } from 'src/app/services/auth-service-service.service';

@Component({
    templateUrl: './formlayoutdemo.component.html'
})
export class FormLayoutDemoComponent {

    isNewDiv: boolean;
    loading = [false, false, false];
    representatives: any[] = []; 
    searchQuery: string = '';
    rowsPerPageOptions: number[] = [10, 25, 50];
    reservas: Reserva[] = [];
    showModal: boolean = false;
    router: any;
    pedidos: any[] = [];
    
    constructor(private route: ActivatedRoute,
      private http: HttpClient ,
      private reservasService: ReservasService,
      private authService: AuthServiceService 
    ) {}


    fecharModal() {
        this.showModal = false;
      }

      isPendente(status: string): boolean {
        return status === 'pendente';
    }
    
    isAprovado(status: string): boolean {
        return status === 'aprovado';
    }

    isCancelado(status: string): boolean {
        return status === 'cancelado';
    }

     

    cols: any[] = [
        { field: 'id_reserva', header: 'ID' },
        { field: 'email_usuario', header: 'Usuário' },
        { field: 'nome_bloco', header: 'Nome do Bloco' },
        { field: 'data_da_reserva', header: 'Data da Reserva' },
        { field: 'status', header: 'Estado' }
   
      ];

      id_reserva!: any;
      aprovarReserva(id_reserva: number) {
        this.http.put(`http://192.168.1.59:5000/aprovar/reserva/${id_reserva}`, {}).subscribe(
          (response: any) => {
             this.mostrarMensagemSucesso()
             setTimeout(() => {
              window.location.reload();
             }, 2000);
              console.log(response);
           // this.removerReserva();
          },
          (error: any) => {
            console.log(error);
          }
        );
      }
      removerReserva(reservas: any) {
        // Implemente a lógica para remover a reserva da lista
      }

      fetchData(){
        const token = this.authService.getToken();
        if(!token){
            console.error('Token not found in sessionStorage.');
            return;
        }
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });
        this.http.get<any>('http://192.168.1.59:5000/admin/lista/reservas', {headers}).subscribe(
            (resposta: any) => {
                if (resposta && resposta.admin) {
                  this.pedidos = resposta.admin; // Transformar o objeto em um array
                    console.log(this.pedidos);
                } else {
                    console.error('Resposta inesperada da API:', resposta);
                }
            },
            error => {
                console.error('Erro ao buscar reservas:', error);
            }
        );
      }

    ngOnInit(): void{
      this.fetchData();
      //  this.carregarReservas();          
     }
    toggleNewDiv() {
        this.isNewDiv = !this.isNewDiv;
      }

      load(index: number){
        this.loading[index] = true;
        setTimeout(() => this.loading[index] = false, 1000);
      }


      mostrarMensagemSucesso() {
        Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: 'Reserva aprovado com sucesso',
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

