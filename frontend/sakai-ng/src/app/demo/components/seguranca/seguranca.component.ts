import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthServiceService } from 'src/app/services/auth-service-service.service';

@Component({
  templateUrl: './seguranca.component.html',
  styleUrls: ['./seguranca.component.scss']
})
export class SegurancaComponent implements OnInit, OnDestroy {

  items: MenuItem[];
  searchQuery: string = '';
  rowsPerPageOptions: number[] = [10, 25, 50];
  loading = [false, false, false];
  representatives: any[] = [];
  isNewDiv: boolean;
  visitantes: any;
  showModal: boolean = false;
  visitanteDetalhes: any;
  userEmail: string = '';
  updateInterval: any; 

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthServiceService) { }

  isNotAutorizado(estado: string): boolean {
    return estado === 'Não Autorizado';
  }

  isAutorizado(estado: string): boolean {
    return estado === 'Autorizado';
  }

  total: number = 0;
  carregarVisitantes() {
    this.http.get<any>('http://192.168.1.59:5000/lista/visitantes/seguranca').subscribe(
      (data: any) => {
        this.visitantes = data.visitas;
        console.log(data);
        const totalVisitantes = data.visitas.length; 
        console.log('Total de Visitantes:', totalVisitantes);
        this.total = totalVisitantes;
      },
      (error: any) => {
        console.error('Erro ao carregar visitantes:', error);
      }
    );
  }

  fecharModal() {
    this.showModal = false;
  }

  verCompleto(id: number) {
    this.http.get<any>(`http://192.168.1.59:5000/visitante/seguranca/${id}`).subscribe(
      (data: any) => {
        this.visitanteDetalhes = data.visitante;
        this.showModal = true;
      },
      (error: any) => {
        console.error('Erro ao carregar detalhes do visitante:', error);
      }
    );
  }

  load(index: number) {
    this.loading[index] = true;
    setTimeout(() => this.loading[index] = false, 1000);
  }

  toggleNewDiv() {
    this.isNewDiv = !this.isNewDiv;
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

  ngOnInit() {
    this.setUserEmail();
    this.carregarVisitantes();

    this.updateInterval = setInterval(() => {
    }, 1000);
    this.items = [
      {
        label: '<img src="assets/demo/images/login/8.png" alt="Image" height="70" class="mb-1 tab-menu-logo" />',
        escape: false,
        command: () => {
        }
      },
      {
        label: 'Acesso e segurança',
        icon: 'pi pi-fw pi-shield',
        routerLink: ['/seguranca']
      },
      {
        label: 'Suporte de Emergências',
        icon: 'pi pi-exclamation-triangle',
        command: () => {
            this.router.navigate(['pedido-de-socorro'])
        },
        badge: '0' 
    },
      
    ];
  }

  logout(){
    setTimeout(() => {
      this.router.navigate(['/auth/login']);
      },200)
      this.authService.logout();   
      sessionStorage.removeItem('currentUser');
  }

  ngOnDestroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }
}
