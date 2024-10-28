import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MenuItem } from 'primeng/api';
import Swal from 'sweetalert2';

@Component({
  templateUrl: './visitantes.component.html',
  styleUrls: ['./visitantes.component.scss'],
})
export class VisitantesComponent implements OnInit {
  sidebarVisible = false;

  items: MenuItem[] = [];
  nomeMorador: string = '';
  visitante: any = {
    id_visitante: 0,
    nome_visitante: '',
    apelido_visitante: '',
    contacto_visitante: '',
    bilhete_visitante: '',
    bloco_id: 0,
    unidade_id: 0,
    comprovativo_despesa: ''
  };

  addAngolaCountryCode() {
  
  }

  blocos: any[] = [];
  unidades: any[] = [];
  permissoes: any[] = [];
  formSubmitted: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.visitante.contacto_visitante = '+244';
    this.carregarBlocos();
    this.carregarUnidades();
    this.carregarPermissoes();

    const savedPermissoes = localStorage.getItem('permissoes');
    if (savedPermissoes) {
      this.permissoes = JSON.parse(savedPermissoes);
      this.formSubmitted = true;
    }
  }

  carregarPermissoes() {
    this.http.get('http://127.0.0.1:5000/lista/permissao/visitas').subscribe(
      (resultado: any) => {
        this.permissoes = resultado;
        localStorage.setItem('permissoes', JSON.stringify(this.permissoes));
        console.log(resultado);
      }
    );
  }

  onFileSelected(event: any) {
    this.visitante.comprovativo_despesa = event.target.files[0];
  }

  addVisitante() {
    if (!this.visitante.nome_visitante || !this.visitante.apelido_visitante || !this.visitante.contacto_visitante || 
        !this.visitante.bilhete_visitante || !this.visitante.bloco_id || !this.visitante.unidade_id) {
      this.mostrarMensagemVazio();
      return;
    }

    const formData = new FormData();
    formData.append('nome_visitante', this.visitante.nome_visitante);
    formData.append('apelido_visitante', this.visitante.apelido_visitante);
    formData.append('contacto_visitante', this.visitante.contacto_visitante);
    formData.append('bilhete_visitante', this.visitante.bilhete_visitante);
    formData.append('bloco_id', this.visitante.bloco_id);
    formData.append('unidade_id', this.visitante.unidade_id);
    formData.append('comprovativo_despesa', this.visitante.comprovativo_despesa);
    
    this.http.post('http://127.0.0.1:5000/cadastrar/visitas', formData).subscribe(
      (response: any) => {
        if (response.mensagem) {
          this.mostrarMensagemSucesso();
          setTimeout(() => {
            window.location.reload();
          }, 3000);
          this.formSubmitted = true;
          this.carregarPermissoes();
        }
      },
      (error: any) => {
        if (error.status === 400) {
          this.mostrarMensagemClient();
        } else if (error.status === 404) {
          this.mostrarMensagemPage();
        } else if (error.status === 500) {
          this.mostrarMensagemInfo();
        }
      }
    );
  }
  

  carregarBlocos() {
    this.http.get<any[]>('http://127.0.0.1:5000/lista/blocos').subscribe(
      (resultado: any) => {
        this.blocos = resultado.blocos;
        console.log(resultado);
      },
      (error: any) => {
        if (error.status === 400) {
          this.mostrarMensagemClient();
        } else if (error.status === 404) {
          this.mostrarMensagemPage();
        } else if (error.status === 500) {
          this.mostrarMensagemInfo();
        }
      }
    );
  }

  carregarUnidades() {
    this.http.get<any[]>('http://127.0.0.1:5000/lista/unidade').subscribe(
      (resultado) => {
        this.unidades = resultado;
        console.log(resultado);
      }
    );
  }

  carregarMoradorPorUnidade(unidade_id: number) {
    this.http.get<any>(`http://127.0.0.1:5000/lista/morador/unidade/${unidade_id}`).subscribe(
      (resultado) => {
        if (resultado.nome_morador) {
          this.nomeMorador = resultado.nome_morador;
        } else {
          this.nomeMorador = 'Morador não encontrado';
        }
        console.log(this.nomeMorador);  // Log the nomeMorador to the console
      },
      (error: any) => {
        this.nomeMorador = 'Erro ao buscar morador';
        console.error(error);
      }
    );
  }

  mostrarMensagemSucesso() {
    Swal.fire({
      icon: 'success',
      title: 'Sucesso!',
      text: 'Sucesso, Aguarde aprovação!',
      confirmButtonText: 'Ok'
    });
  }

  mostrarMensagemErro() {
    Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: 'Erro ao cadastrar!',
      confirmButtonText: 'Ok'
    });
  }

  mostrarMensagemVazio() {
    Swal.fire({
      icon: 'warning',
      title: 'Aviso',
      text: 'Preencha os campos corretamente!',
      confirmButtonText: 'OK'
    });
  }

  mostrarMensagemInfo() {
    Swal.fire({
      icon: 'warning',
      title: 'Aviso',
      text: 'Dado já existente, verifique os dados por favor!',
      confirmButtonText: 'Ok'
    });
  }

  mostrarMensagemClient() {
    Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: 'Número de quarto inválido!',
      confirmButtonText: 'Ok'
    });
  }

  mostrarMensagemPage() {
    Swal.fire({
      icon: 'warning',
      title: 'Aviso',
      text: 'Essa página não existe!',
      confirmButtonText: 'Ok'
    });
  }

  updateMessage() {
    Swal.fire({
      icon: 'success',
      title: 'Sucesso',
      text: 'Atualizado com sucesso!',
      confirmButtonText: 'OK'
    });
  }
}
