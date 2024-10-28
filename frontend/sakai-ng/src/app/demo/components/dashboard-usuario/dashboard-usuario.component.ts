import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import Swal from 'sweetalert2';
import { ReservasService, Reserva } from 'src/app/services/reservas.service';
import { AreasReservaService, AreasReservas } from 'src/app/services/areas-reserva.service';

@Component({
  templateUrl: './dashboard-usuario.component.html',
  styleUrls: ['./dashboard-usuario.component.scss']
})
export class DashboardUsuarioComponent implements OnInit{
  sidebarVisible = false;
  loading = [false, false, false];
  status: any[] = [];
  isNewDiv: boolean;
  representatives: any[] = []; 
  statuses: any[] = [];
  searchQuery: string = '';
  rowsPerPageOptions: number[] = [10, 25, 50];
  blocos: any[] = [];
  items: MenuItem[];
  areasReserva: any[] = [];


  reservas: any = {
    usuario_id: 0,
    bloco_id: 0,
    data_da_reserva: new Date(),
    
  }

  isPendente(status: string): boolean{
      return status === 'pendente';
  }

  isAprovado(status: string): boolean{
      return status === 'aprovado';
  }

  isCancelado(status: string): boolean{
    return status === 'cancelado';
  }

  constructor(private areasReservar: AreasReservaService,private reservasSerice: ReservasService,private http: HttpClient) {
   

    this.items = [
      {
        label: 'Página Inicial',
        icon: 'pi pi-fw pi-home',
        command: () => {
          console.log('Item 1 selected');
        },
        styleClass: 'custom-menu-item', // Adiciona uma classe CSS personalizada
        style: {
          'color': 'red' // Altere a cor de fundo
        }
      },
      {
        label: 'Disponível',
        icon: 'pi pi-fw pi-comments',
        command: () => {
          console.log('Item 2 selected');
        }, 
        badge: '0'
      },
      {
        label: 'Reservas',
        icon: 'pi pi-fw pi-pencil',
        items: [
          {
            label: 'Áreas comuns',
            icon: 'pi pi-fw pi-bookmark',
            command: () => {
              console.log('Item 3.1 selected');
            }
          },
          {
            label: 'Fazer reservas',
            icon: 'pi pi-fw pi-search',
            command: () => {
              console.log('Item 3.2 selected');
            }
          }
        ]
      },
      {
        label: 'Meu Perfil',
        icon: 'pi pi-fw pi-user',
        command: () => {
          console.log('Item 4 selected');
        }
      }
    ];
  }

ngOnInit(): void{
  this.carregarReservas();
  this.carregarBlocos();
  this.carregarAreasReserva();
}

carregarReservas(){
   this.reservasSerice.getReservasTodos().subscribe(
    (data: Reserva[]) => {
       this.reservas = data;
       console.log(data);
    }
   );
}

total: number = 0;
carregarAreasReserva(){
  this.areasReservar.getAreasReserva().subscribe(
    (resultado: any) => {
      this.areasReserva = resultado;
      this.total = this.areasReserva.length;      
      console.log(resultado);
    }
  )
}

  carregarBlocos() {
    this.http.get<any[]>('http://127.0.0.1:5000/lista/blocos').subscribe(
      (resultado: any) => {
        this.blocos = resultado.blocos;
        console.log(resultado);
      },
      (error) => {
        console.error('Erro ao carregar os blocos:', error);
      }
    );
  }

  toggleNewDiv() {
    this.isNewDiv = !this.isNewDiv;
  }

  addReserva(){    
       this.http.post('http://127.0.0.1:5000/cadastrar/reservas', this.reservas).subscribe(
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
           } else if (error.status === 500) {
                 this.mostrarMensagemInfo();
           } else {
             //this.mostrarMensagemErro();
           }
         }
       );
  }

  load(index: number) {
    this.loading[index] = true;
    setTimeout(() => (this.loading[index] = false), 1000);
  }

  mostrarMensagemSucesso() {
    Swal.fire({
      icon: 'success',
      title: 'Sucesso!',
      text: 'Morador inserido com sucesso!',
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
