import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { TipoCondomin, TipoCondominService } from 'src/app/services/tipo-condomin.service';

@Component({
    templateUrl: './timelinedemo.component.html',
    styleUrls: ['./timelinedemo.scss']
})
export class TimelineDemoComponent implements OnInit {
  
    tipocondomin: any = {
        "nome_tipo_condominio": ""
    } 

 tipoCondomin: any = {};   
 tipoCondomins: TipoCondomin[] = [];
 tiposCondominio: TipoCondomin[] = [];

 constructor(private http: HttpClient, private tipoCondominService: TipoCondominService){}

    
 addTipoCondominio() { 
    if (!this.tipocondomin.nome_tipo_condominio.trim()) {
        this.mostrarMensagemVazio();
        return;
    }

    this.http.post('http://127.0.0.1:5000/cadastrar/tipoCondominio', this.tipocondomin)
        .subscribe((response: any) => {
            if(response.mensagem) {
                this.mostrarMensagemSucesso();
                this.tipocondomin.nome_tipo_condominio = "";
                console.log(response);
                setTimeout(() => {
                  window.location.reload();
                }, 2000)
            } else {
                // Tratar outros casos de resposta, se necessário
            }
        }, 
        (error: any) => {
            if(error.status === 4000) {
                this.mostrarMensagemClient();
            } else {
                console.error('Erro ao enviar requisição:', error);
            }
        });
}


    carregarTipoCondominio(){
       this.tipoCondominService.getTipoCondominio().subscribe(
        (data: any) => {
            this.tipoCondomins = data;
            console.log(data);
            const totalTipoCondominios = data.length;
            console.log('Total de tipo de condomínios:', totalTipoCondominios);
        }
       )
    }
  
    ngOnInit() {
        this.carregarTipoCondominio();
    }

    mostrarMensagemSucesso(){
        Swal.fire({
            icon: 'success',
            title: 'Sucesso!',
            text: 'Tipo de condomínio inserido com sucesso!',
            confirmButtonText: 'Ok'
          });
    }

    mostrarMensagemClient(){
        Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Erro desconhecido. Entre em contato com o administrador.',
            confirmButtonText: 'Ok'
        });
    }

    mostrarMensagemVazio(){
        Swal.fire({
            icon: 'warning',
            title: 'Aviso',
            text: 'Preencha os campos corretamente!',
            confirmButtonText: 'OK'
        });
    }
}
