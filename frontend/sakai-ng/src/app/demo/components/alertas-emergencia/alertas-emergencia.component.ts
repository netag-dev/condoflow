import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/auth-service-service.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-alertas-emergencia',
  templateUrl: './alertas-emergencia.component.html',
  styleUrls: ['./alertas-emergencia.component.scss']
})
export class AlertasEmergenciaComponent implements OnInit {

  items: MenuItem[];
  total: number = 0;
  visitantes: any[] = [];
  userEmail: string = '';
  searchQuery: string = '';
  rowsPerPageOptions: number[] = [10, 25, 50];
  loading = [false, false, false];
  representatives: any[] = [];
  isNewDiv: boolean = false;
  moradorId: string = '';
  unidadeId: string = '';
  emergencias: any[] = [];
  alertSound = new Audio('assets/demo/images/login/emergencia.mp3');

  constructor(
    private router: Router,
    private authService: AuthServiceService,
    private http: HttpClient
  ) {
    this.items = [
      {
        label: 'Página Inicial',
        icon: 'pi pi-fw pi-home',
        command: () => {
          this.router.navigate(['/moradores']);
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
              this.router.navigate(['/manutencao']);
            }
          },
          {
            label: 'Históricos',
            icon: 'pi pi-file',
            command: () => {
              this.router.navigate(['/historicos']);
            }
          }
        ]
      },
      {
        label: 'Alertas de emergência',
        icon: 'pi pi-exclamation-triangle',
        command: () => {
          this.router.navigate(['/alertas-emergencia']);
        }
      },
      {
        label: 'Reservas',
        icon: 'pi pi-map-marker',
        command: () => {
          this.router.navigate(['/reservas-moradores']);
        }
      },
      {
        label: 'Meu Perfil',
        icon: 'pi pi-fw pi-user',
        command: () => {
          this.router.navigate(['/meu-perfil']);
        }
      }
    ];
  }

  toggleNewDiv() {
    this.isNewDiv = !this.isNewDiv;
  }

  load(index: number) {
    this.loading[index] = true;
    setTimeout(() => this.loading[index] = false, 1000);
  }

  addAlertas() {
    // Implementar a funcionalidade de adicionar alertas
  }

 
  fetchData() {
    const token = this.authService.getToken();
    if (!token) {
      console.error('Token not found in sessionStorage.');
      return;
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get('http://127.0.0.1:5000/lista/visitas', { headers }).subscribe(
      (data: any) => {
        this.visitantes = data.visitas;
        console.log(data);
        const totalVisitantes = data.length;
        console.log('Total de visitantes:', totalVisitantes);
        this.total = this.visitantes.length;
      },
      (error: any) => {
        console.error(error);
      }
    );

    this.http.get<any>('http://127.0.0.1:5000/dados/contas', { headers }).subscribe(
      (resposta: any) => {
        this.moradorId = resposta.dados_morador.id_morador;
        this.unidadeId = resposta.dados_morador.id_unidade;
        console.log(resposta);
      },
      (error: any) => {
        console.error(error);
      }
    );

      
    this.http.get('http://127.0.0.1:5000/listar/emergencias', { headers }).subscribe(
      (data: any) => {
        this.emergencias = data.emergencia;
        console.log(data);
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

  ngOnInit(): void {
    this.fetchData();
    this.setUserEmail();
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

 
  reportEmergency(type: string) {
    const emergencyData = {
      morador_id: this.moradorId,
      unidade_id: this.unidadeId,
      tipo_emergencia: type,
      data_hora_emergencia: new Date().toISOString()
    };
  
    this.http.post('http://localhost:5000/cadastrar/emergencia', emergencyData)
      .subscribe((response: any) => {
        if (response.mensagem) {
          this.mostrarMensagemSucesso();
          this.playAlertSound();
          setTimeout(() => {
            window.location.reload();
          }, 8000);
        }
      }, error => {
        console.error('Erro ao reportar emergência', error);
        this.mostrarMensagemErro();
      });
  }
  
  playAlertSound() {
    this.alertSound.play().catch(error => console.error('Erro ao tocar o som de alerta:', error));
    const alertDuration = 5000; 
  
    setTimeout(() => {
      this.alertSound.pause();
      this.alertSound.currentTime = 0; 
    }, alertDuration);
  }
  

  mostrarMensagemSucesso() {
    Swal.fire({
    icon: 'success',
    title: 'Sucesso!',
    text: 'Emergência reportado com sucesso!',
    });
    }
  
    mostrarMensagemErro() {
    Swal.fire({
    icon: 'error',
    title: 'Erro',
    text: 'Ocorreu um erro ao pagar a despesa. Tente novamente.',
    });
    }
}
