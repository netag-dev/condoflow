import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { TipoEstacionamentoService, TipoEstacionamento } from 'src/app/services/tipo-estacionamento.service';

@Component({
  templateUrl: './emptydemo.component.html'
})
export class EmptyDemoComponent implements OnInit {
  tipoEstacionamento: any = {
    "nome_tipo_estacionamento": ""
  }

  tipoEstacionamentos: TipoEstacionamento[] = [];

  constructor(private http: HttpClient, private tipoestacionamentoservico: TipoEstacionamentoService) {}

  addTipoEstacionamento() {
    if (!this.tipoEstacionamento.nome_tipo_estacionamento.trim()) {
      this.mostrarMensagemVazio();
      return;
    }

    this.http.post('http://127.0.0.1:5000/cadastrar/tipoEstacionamento', this.tipoEstacionamento).subscribe(
      (response: any) => {
        if (response.mensagem) {
          this.mostrarMensagemSucesso();
          this.tipoEstacionamento.nome_tipo_estacionamento = "";
          console.log(response);
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          // Handle other cases if needed
        }
      },
      (error: any) => {
        console.error('Erro ao enviar requisição:', error);
        if (error.status === 400) {
          // Handle bad request errors
        } else {
          // Handle other errors
        }
      }
    );
  }
    
    carregarTipoEstacionamento(){
      this.tipoestacionamentoservico.getTipoEstacionamento().subscribe(
        (data: any) => {
          this.tipoEstacionamentos = data;
          console.log(data);
          const totalTiposEstacionamentos = data.length;
          console.log('Total de tipo de estacionamento: ', totalTiposEstacionamentos);
        }
      )
    }

  ngOnInit(): void {
    this.carregarTipoEstacionamento();
  }

  mostrarMensagemSucesso() {
    Swal.fire({
      icon: 'success',
      title: 'Sucesso!',
      text: 'Tipo de estacionamento inserido com sucesso!',
      confirmButtonText: 'Ok'
    });
  }

  mostrarMensagemVazio() {
    Swal.fire({
      icon: 'warning',
      title: 'Aviso',
      text: 'Preencha corretamente o campo',
      confirmButtonText: 'OK'
    })
  }
}
