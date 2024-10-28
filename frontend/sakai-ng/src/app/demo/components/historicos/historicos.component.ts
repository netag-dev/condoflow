import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { VisitantesService, Visitante } from 'src/app/services/visitantes.service';

@Component({
  templateUrl: './historicos.component.html',
  styleUrl: './historicos.component.scss'
})
export class HistoricosComponent implements OnInit{


  items: MenuItem[];
  visitantes: Visitante[] = [];

  activeIndex: number = 0;

  activeIndexChange(newIndex: number): void {
    this.activeIndex = newIndex;
  }

   ngOnInit(): void {
    this.carregarVisitantes();
   }
 
   total: number = 0;
carregarVisitantes() {     
  this.visitanteService.getVisitantes().subscribe(
    (data: any) => {
      this.visitantes = data;
      console.log(data);
      const totalVisitantes = data.length;
      console.log('Total de Visitantes:' , totalVisitantes);  
      this.total = this.visitantes.length;         
    },
    (error: any) => {
      if (error.status === 400) {
     
      } else if (error.status === 404) {
       
        this.router.navigateByUrl('/');
      } else if (error.status === 500) {
           
      } else {
       // this.mostrarMensagemErro();
      }
    }
  );
}

   constructor(private visitanteService: VisitantesService,private router: Router) {
    this.items = [
      {
        label: 'Página Inicial',
        icon: 'pi pi-fw pi-home',
        command: () => {
          this.router.navigate(['/moradores'])
        },
        styleClass: 'custom-menu-item', // Adiciona uma classe CSS personalizada
        style: {
          'color': 'red' // Altere a cor de fundo
        }
      },
      {
        label: 'Visitantes',
        icon: 'pi pi-fw pi-bell',
        command: () => {
           this.router.navigate(['/visitas']);
        }, 
        badge: '0'
      },
      {
        label: 'Gestão de Despesas',
        icon: 'pi pi-fw pi-pencil',
        items: [
          {
            label: 'Contas a pagar',
            icon: 'pi pi-fw pi-credit-card',
            command: () => {
              this.router.navigate(['/contas']);
            }
          },
          {
            label: 'Manutenção',
            icon: 'pi pi-fw pi-money-bill',
            command: () => {
              this.router.navigate(['/manutencao']);
            }
          },
          {
            label: 'Históricos',
            icon: 'pi pi-file',
            command: () => {
               this.router.navigate(['/historicos'])
            }
          }
        ]
      },
      {
        label: 'Reservas',
        icon: 'pi pi-map-marker',
        command: () => {
          this.router.navigate(['/reservas-moradores'])
        }
      },
      {
        label: 'Meu Perfil',
        icon: 'pi pi-fw pi-user',
        command: () => {
          this.router.navigate(['/meu-perfil'])
        }
      }
    ];
   }
   
}
