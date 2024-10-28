import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MenuItem } from 'primeng/api';
import { AreasReservaService, AreasReservas } from 'src/app/services/areas-reserva.service';
@Component({
  templateUrl: './disponivel.component.html'
})
export class DisponivelComponent {

  isNewDiv: boolean;
  representatives: any[] = []; 
  loading = [false, false, false];
  searchQuery: string = '';
  rowsPerPageOptions: number[] = [10, 25, 50];
  items: MenuItem[];
  areasReserva: any[] = [];

  toggleNewDiv() {
    this.isNewDiv = !this.isNewDiv;
  }

  ngOnInit(): void{
    this.carregarAreasReserva();
    
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

  load(index: number) {
    this.loading[index] = true;
    setTimeout(() => (this.loading[index] = false), 1000);
  }

  isPendente(estado: string): boolean {
    return estado.toLowerCase() === 'pendente';
  }

  isAprovado(estado: string): boolean {
    return estado.toLowerCase() === 'disponível';
  }

  isCancelado(estado: string): boolean {
    return estado.toLowerCase() === 'cancelado';
  }

  constructor(private areasReservar: AreasReservaService){
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

}
