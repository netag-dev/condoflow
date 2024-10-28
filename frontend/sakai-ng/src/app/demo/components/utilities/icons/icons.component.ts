import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import {TipoUnidades, TipoUnidadesService } from 'src/app/services/tipo-unidades.service';

@Component({
    templateUrl: './icons.component.html',
})
export class IconsComponent implements OnInit {

   tipoUnidades: any = {
    "nome_tipo_unidade": ""
   }

   tipoUnidade:TipoUnidades[] = [];
   tipoUni: any = {
    "nome_tipo_unidade": ""
   };

    constructor(private http: HttpClient, private tipounidadeService:TipoUnidadesService) { }

    addTipoUnidades() {
        if (!this.tipoUni.nome_tipo_unidade.trim()) {
            this.mostrarMensagemVazio();
            return;
        }
        this.http.post('http://127.0.0.1:5000/cadastrar/tipoUnidades', this.tipoUni).subscribe(
            (response: any) => {
                if (response.mensagem) {
                    this.mostrarMensagemSucesso();
                    this.tipoUni.nome_tipo_unidade = "";
                    console.log(response);
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000)
                } else {

                }
            },
            (error: any) => {
                if (error.status === 4000) {

                } else {
                    console.error('Erro ao enviar requisição:', error);
                }
            });
    }
      
    carregarTiposUnidades() {
        this.tipounidadeService.getTipoUnidades().subscribe(
            (data: TipoUnidades[]) => {
                this.tipoUnidades = data;
                console.log(data);
                if (this.tipoUnidades && this.tipoUnidades.length) {
                    console.log('Total de tipo de Unidades:', this.tipoUnidades.length);
                } else {
                    console.log('Nenhum tipo de unidade encontrado.');
                }
            },
            (error) => {
                console.error('Erro ao carregar tipos de unidades:', error);
            }
        );
    }
    
    
    ngOnInit() {
        this.carregarTiposUnidades();
    }

   mostrarMensagemVazio(){
     Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'Preencha o campo corretamente!',
        confirmButtonText: 'OK'
     });
   }
   
mostrarMensagemSucesso(){
    Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: 'Tipo de unidade inserido com sucesso!',
        confirmButtonText: 'OK'
    });
}   


}
