import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
//import { ReservasService, Reserva } from 'src/app/services/reservas.service';
import { VisitantesService, Visitante } from 'src/app/services/visitantes.service';
import { AuthServiceService } from 'src/app/services/auth-service-service.service';

@Component({
  templateUrl: './reservas-moradores.component.html',
  styleUrl: './reservas-moradores.component.scss'
})
export class ReservasMoradoresComponent implements OnInit{
 
  items: MenuItem;

  total: number = 0; 
  isNewDiv: boolean;
  representatives: any[] = []; 
  statuses: any[] = [];
  searchQuery: string = '';
  rowsPerPageOptions: number[] = [10, 25, 50];
  loading = [false, false, false];
  blocos: any[] = [];
  visitantes: Visitante[];
  //reservas: Reserva[] = [];
  pega: any[] = [];
  carregarReservas: any[] = [];
  userEmail: string = '';

  isPendente(status: string): boolean{
    return status === 'pendente';
}

isAprovado(status: string): boolean{
    return status === 'aprovado';
}

isCancelado(status: string): boolean{
  return status === 'cancelado';
}

logout(){
  setTimeout(() => {
  this.router.navigate(['/auth/login']);
  },200)
  this.authService.logout();   
  sessionStorage.removeItem('currentUser');
  }

res: any = {
  morador_id: '',
  tipo_reserva_id: '',
  bloco_id: '',
  data_da_reserva: new Date(),
  inicio_reserva: new Date(),
  fim_reserva: new Date()
}

formatTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
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
   tipo_reservas: any[] = []; 
  carregarTipoReservas(){
    this.http.get<any[]>('http://127.0.0.1:5000/lista/tipoReservas').subscribe(
      (resultado: any) => {
       this.tipo_reservas = resultado.tipo_reservas; 
      console.log(resultado)
      }
    )
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

    totalvi: number = 0;
    carregarVisitantes() {     
    this.visitanteService.getVisitantes().subscribe(
    (data: any) => {
    this.visitantes = data;
    console.log(data);
    const totalVisitantes = data.length;
    console.log('Total de Visitantes:' , totalVisitantes);  
    this.totalvi = this.visitantes.length;         
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

  addReservaMoradores(){
    const formattedInicioReserva = this.formatTime(this.res.inicio_reserva);
    const formattedFimReserva = this.formatTime(this.res.fim_reserva);

    const formData = {
      ...this.res,
      inicio_reserva: formattedInicioReserva,
      fim_reserva: formattedFimReserva
    };

    this.http.post('http://127.0.0.1:5000/cadastrar/reservas', formData).subscribe(
      (response: any) => {
        if (response.mensagem) {
           this.mostrarMensagemSucesso();
           setTimeout(() => {
             window.location.reload(); 
           }, 2000);
        }
        console.log(response);
      },
      (error) => {
        console.error('Erro ao cadastrar reserva:', error);
      }
    );
}

ngOnInit(): void {
  this.fetchData();
  this.carregarBlocos();
  //this.carregarReservas();
  this.carregarVisitantes();
  this.setUserEmail();
  this.carregarTipoReservas()
  
}  



fetchData() {
  const token = this.authService.getToken();
  if (!token) {
    console.error('Token not found in SessionStorage.');
    return;
  }
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  this.http.get<any>('http://127.0.0.1:5000/dados/reservas', { headers }).subscribe(
    (resposta: any) => {
      if (resposta && resposta.dados_morador) {
        this.pega = resposta.dados_morador;
        this.res.morador_id = resposta.dados_morador.id_morador;
        console.log(this.res.morador_id);
      } else {
        console.error('Dados do morador não encontrados na resposta:', resposta);
      }
    },
    (error) => {
      console.error('Erro ao buscar dados do morador:', error);
    }
  );

  this.http.get<any>('http://127.0.0.1:5000/lista/reservas', { headers }).subscribe(
    (resposta: any) => {
      if (resposta && resposta.reservas) {
        this.carregarReservas = resposta.reservas;
        console.log(resposta);
      } else {
        console.error('Reservas não encontradas na resposta:', resposta);
      }
    },
    (error) => {
      console.error('Erro ao buscar reservas:', error);
    }
  );

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
   )

  
}

mostrarMensagemSucesso() {
  Swal.fire({
    icon: 'success',
    title: 'Sucesso!',
    text: 'Sucesso, aguarde a aprovação.',
    confirmButtonText: 'Ok'
  });
}




  load(index: number) {
    this.loading[index] = true;
    setTimeout(() => (this.loading[index] = false), 1000);
  }

  toggleNewDiv() {
    this.isNewDiv = !this.isNewDiv;
  }

  constructor(
    private visitanteService:VisitantesService,
   // private reservasSerice: ReservasService,
    private http: HttpClient, 
    private router: Router,
    private authService: AuthServiceService) {
   
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
      }, {
        label: 'Alertas de emergência',
        icon: 'pi pi-exclamation-triangle',
        command: ()=> {
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
