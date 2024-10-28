import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { Visitante, VisitantesService } from 'src/app/services/visitantes.service';
import Swal from 'sweetalert2';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AuthServiceService } from 'src/app/services/auth-service-service.service';

@Component({
  templateUrl: './visitas.component.html',
  styleUrl: './visitas.component.scss'
})
export class VisitasComponent implements OnInit {

  items: MenuItem[];
  searchQuery: string = '';
  rowsPerPageOptions: number[] = [10, 25, 50];
  loading = [false, false, false]; 
  representatives: any[] = [];
  isNewDiv: boolean;
  visitantes: Visitante[] = [];
  currentUser: any;
  private _albums: any[] = [];
  updateInterval: any;
  userEmail: string = '';
  
  isNotAutorizado(estado: string): boolean {
    return estado === 'Não Autorizado';
}

isAutorizado(estado: string): boolean {
    return estado === 'Autorizado';
}

  toggleNewDiv() {
    this.isNewDiv = !this.isNewDiv;
  }

  load(index: number){
    this.loading[index] = true;
    setTimeout(() => this.loading[index] = false, 1000);
  }

  logout(){
    setTimeout(() => {
     this.router.navigate(['/auth/login']);
     },200)
     this.authService.logout();   
     sessionStorage.removeItem('currentUser');
 }

ngOnInit(): void {
  this.setUserEmail();
  this.updateInterval = setInterval(() => {
    this.fetchData();
  }, 1000);
 
  this.currentUser = this.authService.getCurrentUser(); 
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

      id_visitante!:any;    
      autorizarEntrada(id_visitante: number){
       this.http.put(`http://127.0.0.1:5000/aprovar/visita/${id_visitante}`, {}).subscribe(
        (response:any) => {
          this.mostrarMensagemSucesso();
          setTimeout(() => {
            window.location.reload();
          }, 2000);
          console.log(response);
        }
       ) 
        const visitante = this.visitantes.find(v => v.id_visitante === id_visitante);
        if(id_visitante){
          const payload = {
            destinatario: visitante.contacto_visitante,
            mensagem: 'Olá, estás autorizado a entrar!'
          };
          this.http.post('http://127.0.0.1:5000/cadastrar/enviar_sms', payload).subscribe(
            (response: any) => {
              console.log('SMS enviado com sucesso:', response);
            }
          )
        }
      }
    total: number = 0;
  fetchData(): void{
    const token = this.authService.getToken();
    if(!token){
      console.error('Token not found in sessionStorage.')
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
    )

  }

  constructor(
    private http: HttpClient, 
    private visitanteService: VisitantesService, 
    private router: Router,
    private authService: AuthServiceService
    ){
      
    
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

  ngOnDestroy() {
   if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }

  mostrarMensagemSucesso() {
    Swal.fire({
      icon: 'success',
      title: 'Sucesso!',
      text: 'Visitante Permitido!',
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
