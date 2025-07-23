// manutencao.component.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import Swal from 'sweetalert2';
import { AuthServiceService } from 'src/app/services/auth-service-service.service';

@Component({
  templateUrl: './manutencao.component.html',
  styleUrls: ['./manutencao.component.scss']
})
export class ManutencaoComponent implements OnInit {

  items: MenuItem[];
  visitantes: any[];
  searchQuery: string = '';
  rowsPerPageOptions: number[] = [10, 25, 50];
  loading = [false, false, false];
  isNewDiv: boolean = false;
  manuten: any[] = [];
  manutencoes: any[] = [];
  userEmail: string = '';
  total: number = 0;

      manutencao: any = {
     tipo_manutencao_id: '',
     descricao_manutencao: '',
     morador_id: '',
     unidade_id: '',
     email_morador: '',
     data_manutencao: new Date()
  };

  constructor(
    private http: HttpClient, 
    private router: Router,
    private authService: AuthServiceService
    ) {
    this.items = [
      { label: 'Página Inicial', icon: 'pi pi-fw pi-home', command: () => this.router.navigate(['/moradores']) },
      { label: 'Visitantes', icon: 'pi pi-fw pi-bell', command: () => this.router.navigate(['/visitas']), badge: '0' },
      { label: 'Gestão de Despesas', icon: 'pi pi-fw pi-pencil', items: [
      { label: 'Contas a pagar', icon: 'pi pi-fw pi-credit-card', command: () => this.router.navigate(['/contas']) },
      { label: 'Manutenção', icon: 'pi pi-fw pi-money-bill', command: () => this.router.navigate(['/manutencao']) },
      { label: 'Históricos', icon: 'pi pi-file', command: () => this.router.navigate(['/historicos']) }
      ]},{
        label: 'Alertas de emergência',
        icon: 'pi pi-exclamation-triangle',
        command: () => {
          this.router.navigate(['/alertas-emergencia'])
        }  
      },
      { label: 'Reservas', icon: 'pi pi-map-marker', command: () => this.router.navigate(['/reservas-moradores']) },
      { label: 'Meu Perfil', icon: 'pi pi-fw pi-user', command: () => this.router.navigate(['/meu-perfil']) }
    ];
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
  

  fetchData(){
    const token = this.authService.getToken();
    if(!token){
      console.error('Token not found in sessionStorage.');
      return;
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    this.http.get<any>('http://192.168.1.59:5000/dados/manutencao', { headers }).subscribe(
      (resposta: any) => {
        this.manutencoes = resposta.tipos_manutencao;
        this.manutencao.morador_id = resposta.dados_morador.id_morador;
        this.manutencao.unidade_id = resposta.dados_morador.id_unidade;
    
      }
    );

    this.http.get<any>('http://192.168.1.59:5000/lista/manutencao_moradores', { headers }).subscribe(
      (resposta: any) => {
        this.manuten = resposta.manutencao;
        console.log(resposta);
      }       
    );

    this.http.get('http://192.168.1.59:5000/lista/visitas', { headers }).subscribe(
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
  }
  
    load(index: number) {
    this.loading[index] = true;
    setTimeout(() => this.loading[index] = false, 1000);
    }

  addManutencao() {
    this.http.post('http://192.168.1.59:5000/cadastrar/pedido_manutencao', this.manutencao).subscribe(
      (data: any) => {
        this.mostrarMensagemSucesso();
        setTimeout(() => {
          window.location.reload();
        }, 2000);
        console.log("Cadastrado com sucesso", data);
      }
    );
  }

  toggleNewDiv() {
    this.isNewDiv = !this.isNewDiv;
  }

  logout(){
    setTimeout(() => {
    this.router.navigate(['/auth/login']);
    },200)
    this.authService.logout();   
    sessionStorage.removeItem('currentUser');
    }

  mostrarMensagemSucesso() {
    Swal.fire({
      icon: 'success',
      title: 'Sucesso',
      text: 'Sucesso, aguarde por uma assistência!',
      confirmButtonText: 'Ok'
    });
  }
}
