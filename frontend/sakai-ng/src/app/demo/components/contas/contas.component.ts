import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Visitante, VisitantesService } from 'src/app/services/visitantes.service';
import { Despesas } from 'src/app/services/despesas-tipo.service';
import { HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { DespesasService, Despesa } from 'src/app/services/despesas.service';
import { Lightbox } from 'ngx-lightbox';
import { AuthServiceService } from 'src/app/services/auth-service-service.service';

@Component({
  templateUrl: './contas.component.html',
  styleUrls: ['./contas.component.scss']
})
export class ContasComponent implements OnInit {

  items: MenuItem[];
  searchQuery: string = '';
  rowsPerPageOptions: number[] = [10, 25, 50];
  loading = [false, false, false]; 
  representatives: any[] = [];
  isNewDiv: boolean = false;
  despesas: any[] = [];
  valorSelecionado: number | null = null;
  valorDespesa: number | null = null;
  visitantes: Visitante[] = [];
  despesasMoradores: Despesa[] = [];
  private _albums: any[] = [];
  updateInterval: any;
  contas: any[] = [];
  carregaDespesas: any[] = [];
  userEmail: string = '';

  despesasData: any = {
    "despesa_id": '',
    "valor_despesa": '',
    "morador_id": '',
    "comprovativo_despesa": '',
    "unidade_id": '',
    "mes_despesa": new Date()
  };

  isInAnalise(estado: string): boolean {
    return estado === 'em análise';
  }

  isPago(estado: string): boolean {
    return estado === 'Pago';
  }

  constructor(private _lightbox:Lightbox,
  private despesasService: DespesasService,
  private visitanteService: VisitantesService, 
  private http: HttpClient, private router: Router,
  private authService: AuthServiceService
  ) {
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

      this.despesas.forEach(despesa => {
      if (!this.isPDF(despesa.comprovativo_despesa)) {
      const src = 'http://127.0.0.1:5000/uploads/' + despesa.comprovativo_despesa;
      const caption = 'Comprovativo do pagamento';
      const thumb = src;
      const album = {
      src: src,
      caption: caption,
      thumb: thumb
        };
        this._albums.push(album);
      }
    });
  
  }

  openLightbox(index: number): void {
    this._lightbox.open(this._albums, index);
  }

  getImageIndex(filename: string): number {
    return this._albums.findIndex(album => album.src.includes(filename));
  }

    close(): void {
    this._lightbox.close();
    }

      fetchData(){
      const token = this.authService.getToken();
      if(!token){
      console.error('Token not found in sessionStorage.')
      return;
      }

      const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
      });

        this.http.get<any>('http://127.0.0.1:5000/dados/contas', {headers}).subscribe(
        (resposta: any) => {
        this.contas = resposta.tipos_despesas;
        this.despesasData.morador_id = resposta.dados_morador.id_morador;
        this.despesasData.unidade_id = resposta.dados_morador.id_unidade;
        console.log(resposta)
      }
    );

    this.http.get<any>('http://127.0.0.1:5000/lista/despesa_moradores', { headers }).subscribe(
      (resposta: any) => {
        this.carregaDespesas = resposta.despesas;
        console.log(resposta);
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

    ngOnInit() {
      this.fetchData()    
      this.carregarDespesasTipo();
     // this.carregarVisitantes();
      this.updateInterval = setInterval(() => {
      
     }, 1000);
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

    ngOnDestroy(){
    if (this.updateInterval) {
    clearInterval(this.updateInterval);
    }
    }

    isPDF(filename: string): boolean {
    return filename.toLowerCase().endsWith('.pdf');
    }

        carregarDespesasTipo() {
        this.http.get<{tipos: any[], Mensagem: string}>('http://127.0.0.1:5000/lista/tipoDespesas').subscribe(
        (resultado) => {
        this.despesas = resultado.tipos;
        console.log(resultado);
      },
        (error) => {
        console.error('Erro ao carregar despesas:', error);
      }
    );
  }

  onChangeDespesa() {
    console.log('Despesa ID selecionado:', this.despesasData.despesa_id);
    if (this.despesasData.despesa_id && this.despesas && this.despesas.length) {
      const despesaSelecionada = this.despesas.find(despesa => despesa.id_despesa == this.despesasData.despesa_id);
      console.log('Despesa selecionada:', despesaSelecionada);
      this.valorDespesa = despesaSelecionada ? despesaSelecionada.valor_despesa : null;
      console.log('Valor da despesa selecionada:', this.valorDespesa);
      this.despesasData.valor_despesa = this.valorDespesa; 
    } else {
      this.valorDespesa = null;
      this.despesasData.valor_despesa = null; 
    }
  }
  
  
  total: number = 0;
  

  toggleNewDiv() {
    this.isNewDiv = !this.isNewDiv;
  }
  onFileSelected(event: any) {
    this.despesasData.comprovativo_despesa = event.target.files[0];
  }

  addPagamento() {
    if (!this.despesasData.despesa_id || !this.despesasData.valor_despesa || !this.despesasData.morador_id || !this.despesasData.mes_despesa) {
      console.log('Todos os campos devem ser preenchidos.');
      return;
    } 
    
    const formData = new FormData();
    formData.append('despesa_id', this.despesasData.despesa_id);
    formData.append('valor_despesa', this.despesasData.valor_despesa);
    formData.append('morador_id', this.despesasData.morador_id);
    formData.append('comprovativo_despesa', this.despesasData.comprovativo_despesa);
    formData.append('unidade_id', this.despesasData.unidade_id);
    formData.append('mes_despesa', this.despesasData.mes_despesa);
  
    const headers = new HttpHeaders(); 
  
     this.http.post('http://127.0.0.1:5000/cadastrar/despesas', formData).subscribe(
      (response: any) => {
        if(response.mensagem){
          this.mostrarMensagemSucesso();
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
        else{
          console.error(response);
        }
      },
      (error: any) => {
      console.error(error);
      this.mostrarMensagemErro();
      }
    ); 
  }

  load(index: number) {
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

  mostrarMensagemSucesso() {
  Swal.fire({
  icon: 'success',
  title: 'Sucesso!',
  text: 'Despesa paga com sucesso!',
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
