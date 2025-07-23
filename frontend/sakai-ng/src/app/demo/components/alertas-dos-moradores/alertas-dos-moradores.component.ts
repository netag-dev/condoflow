import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
import { HttpClient } from '@angular/common/http';
import { AuthServiceService } from 'src/app/services/auth-service-service.service';

@Component({

  templateUrl: './alertas-dos-moradores.component.html',
  styleUrl: './alertas-dos-moradores.component.scss'
})
export class AlertasDosMoradoresComponent implements OnInit{

  items: MenuItem[];
  searchQuery: string = '';
  rowsPerPageOptions: number[] = [10, 25, 50];
  loading = [false, false, false];
  representatives: any[] = [];
  isNewDiv: boolean;
  userEmail: string = '';

logout(){
setTimeout(() => {
this.router.navigate(['/auth/login']);
},200)
this.authService.logout();   
sessionStorage.removeItem('currentUser');
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
   emergencias: any[] = [];
  carregarEmergencias() {
    this.http.get<any>('http://192.168.1.59:5000/lista/emergencias').subscribe(
      (data: any) => {
        this.emergencias = data.emergencias;
        console.log(data);
        
      },
      (error: any) => {
        console.error('Erro ao carregar visitantes:', error);
      }
    );
  }

  constructor(
    private router: Router,
    private authService: AuthServiceService,
    private http: HttpClient
  ) {
    this.items = [

      {
        label: '<img src="assets/demo/images/login/8.png" alt="Image" height="70" class="mb-1 tab-menu-logo" />',
        escape: false,
        command: () => {

        }
      },
      {
        label: 'Acesso e Segurança',
        icon: 'pi pi-fw pi-shield',
        command: () => {
          this.router.navigate(['/seguranca']);
        },
        styleClass: 'custom-menu-item',
        style: {
          'color': 'red'
        }
      },
      {
        label: 'Suporte de Emergências',
        icon: 'pi pi-exclamation-triangle',
        command: () => {
          this.router.navigate(['/pedidos-de-socorro']);
        },
        badge: '0'
      },
      
     
    ];

}

ngOnInit(): void {
  this.setUserEmail();
  this.carregarEmergencias();
}
}