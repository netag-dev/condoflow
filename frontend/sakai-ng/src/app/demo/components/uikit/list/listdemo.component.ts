import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { StatusCondoService, statusCondos } from 'src/app/services/status-condo.service';

@Component({
    templateUrl: './listdemo.component.html'
})
export class ListDemoComponent implements OnInit {

 statusCondo: any = {
    "nome_status_condo": ""
 }

 statusCondos: statusCondos[] = [];

    constructor(private http: HttpClient, private statusCondoService: StatusCondoService) { }

    addStatus(){
        if (!this.statusCondo.nome_status_condo.trim()) {
            this.mostrarMensagemVazio();
            return;
        }
        this.http.post('http://127.0.0.1:5000/cadastrar/status', this.statusCondo).subscribe(
            (response: any) => {
                if (response.mensagem){
                    this.mostrarMensagemSucesso();
                    this.statusCondo.nome_status_condo = "";
                    console.log(response);
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000)
                } else {

                }
            }, 
            (error: any) => {
                if (error.status === 400) {

                } else if(error.status === 404){

                } else if (error.status === 500){

                }
            }
        );
   }

   carregarStatus() {
        this.statusCondoService.getStatus_condo().subscribe(
            (data: any) => {
                this.statusCondos = data;
                console.log(data);
                const totalStatus = data.length;
                console.log('Total de status:', totalStatus);
            }
        )
   }

    ngOnInit() {
       
    this.carregarStatus();
    
    }

  
    mostrarMensagemSucesso() {
        Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: 'Status inserido com sucesso!',
          confirmButtonText: 'Ok'
        });
      }

      mostrarMensagemVazio(){
        Swal.fire({
          icon: 'warning',
          title: 'Aviso',
          text: 'Preencha os campos corretamente!',
          confirmButtonText: 'OK'
        })
     }

    
}
