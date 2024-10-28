import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { VisitantesService, Visitante } from 'src/app/services/visitantes.service';
import { AuthServiceService } from 'src/app/services/auth-service-service.service';

@Component({
  templateUrl: './meu-perfil.component.html',
  styleUrl: './meu-perfil.component.scss'
})
export class MeuPerfilComponent implements OnInit{

  items: MenuItem[];
  searchQuery: string = '';
  rowsPerPageOptions: number[] = [10, 25, 50];
  loading = [false, false, false]; 
  representatives: any[] = [];
  isNewDiv: boolean = false;
  visitantes: Visitante[] = [];
  currentUser: any;
  userEmail: string = '';

  constructor (private visitanteService: VisitantesService, 
    private http: HttpClient, 
    private router: Router,
    private authService:AuthServiceService) {
    
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

  setUserEmail() {
    const currentUser = sessionStorage.getItem('currentUser');
    if (currentUser) {
      const userObj = JSON.parse(currentUser);
      this.userEmail = userObj.user.username;
    } else {
      console.error('User not found in sessionStorage');
    }
  }
ngOnInit(): void {
  this.carregarVisitantes();
  this.fetchData();
  this.setUserEmail();
  this.currentUser = this.authService.getCurrentUser();
  if(!this.authService.isLoggedIn()){
  this.router.navigate(['/auth/login']);
  return;
} 

const userInfoObservable = this.authService.fetchUserInfo();
    userInfoObservable.subscribe({
      next: (user) => {
        if (user) {
          this.currentUser = user; // Atualiza o currentUser local
        } else {
          console.error('User info not available');
        }
      },
      error: (err) => {
        console.error('Error fetching user info:', err);
        this.authService.setLoggedIn(false);
        this.authService.setCurrentUser(null);
        this.router.navigate(['/auth/login']);
      }
    });
}

logout():void {
  setTimeout(() => {
    this.router.navigate(['/auth/login']);
  }, 200)
  this.authService.logout();
  sessionStorage.removeItem('currentUser');
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

total: number = 0;
  carregarVisitantes() {
    this.visitanteService.getVisitantes().subscribe(
      (data: any) => {
        this.visitantes = data;
        console.log(data);
        const totalVisitantes = data.length;
        console.log('Total de Visitantes:', totalVisitantes);  
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

  toggleNewDiv() {
    this.isNewDiv = !this.isNewDiv;
  }

  load(index: number) {
    this.loading[index] = true;
    setTimeout(() => (this.loading[index] = false), 1000);
  }
}
