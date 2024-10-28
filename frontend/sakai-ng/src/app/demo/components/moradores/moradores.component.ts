import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { VisitantesService, Visitante } from 'src/app/services/visitantes.service';
import { AreasReservaService } from 'src/app/services/areas-reserva.service';
import { Reserva } from 'src/app/services/reservas.service';
import { AuthServiceService } from 'src/app/services/auth-service-service.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  templateUrl: './moradores.component.html',
  styleUrl: './moradores.component.scss'
})
export class MoradoresComponent implements OnInit{

  items: MenuItem[]; 
  visitantes: Visitante[] = [];
  areas: Reserva[] = [];
  audio: HTMLAudioElement;
  audioPlaying: boolean = false;
  userEmail: string = '';
  primeiroLogin: boolean = false;


 

  showWelcomeMessage(): void {
    // Exibe a mensagem de boas-vindas (você deve implementar a lógica para exibir a mensagem na interface)
    console.log('Bem-vindo ao sistema, novo morador!');
    // Aqui você pode adicionar lógica para exibir uma mensagem na interface, por exemplo, usando PrimeNG Toast
  }

  total: number = 0;
  carregarVisitantes() {     
    this.visitanteService.getVisitantes().subscribe(
      (data: any) => {
        this.visitantes = data.visitas;
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
      
        }
      }
    );
  }

ngOnInit(): void {
this.carregarVisitantes();
this.carregarReservasDisponiveis();
this.fetchData();
this.setUserEmail();
 // this.verificarPrimeiroLogin();
}

setUserEmail() {
  const currentUser = sessionStorage.getItem('currentUser');
  if (currentUser) {
    const userObj = JSON.parse(currentUser);
    this.userEmail = userObj.user.username;
  } else {
    console.error('User not found in sessionStorage');
  }
}

fetchData(): void{
  const token = this.authService.getToken();
  if(!token){
    console.error('Token not found in sessionStorage');
    return;
  }

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  this.http.get('http://127.0.0.1:5000/user/protected', {headers}).subscribe(
    (resposta: any) => {
      console.log(resposta);
    }
  );
 
} 
 
    comuns: number = 0;
    carregarReservasDisponiveis(){
    this.areaReservas.getAreasReserva().subscribe(
      (resposta: any) => {
        this.areas = resposta;
        this.comuns = this.areas.length;
        console.log(resposta);
      }
    )
  }

  logout(){
    setTimeout(() => {
     this.router.navigate(['/auth/login']);
     },200)
     this.authService.logout();   
     sessionStorage.removeItem('currentUser');
 }

   constructor(
    private areaReservas: AreasReservaService, 
    private visitanteService: VisitantesService ,
    private router: Router,
    private http: HttpClient,
    private authService: AuthServiceService 
   ){ 
    
    this.audio = new Audio();
    this.audio.src = 'assets/visitante.mp3';

    this.items = [
      {
        label: 'Página Inicial',
        icon: 'pi pi-fw pi-home',
        command: () => {
          this.router.navigate(['/moradores'])
        },
        styleClass: 'custom-menu-item', 
        style: {
          'color': 'red' 
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
              this.router.navigate(['/manutencao'])
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
        label: 'Alertas de emergência',
        icon: 'pi pi-exclamation-triangle',
        command: () => {
          this.router.navigate(['/alertas-emergencia'])
        }  
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
