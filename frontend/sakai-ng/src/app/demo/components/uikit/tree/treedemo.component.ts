import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AreasReservaService, AreasReservas } from 'src/app/services/areas-reserva.service';
import Swal from 'sweetalert2';
import { Route, Router } from '@angular/router';

@Component({
    templateUrl: './treedemo.component.html'
})
export class TreeDemoComponent implements OnInit {

    isNewDiv: boolean;
    loading = [false, false, false];
    showModal: boolean = false;
    searchQuery: string = '';
    rowsPerPageOptions: number[] = [10 , 25 , 50];
    blocos:any[] = [];
    areaReservas: AreasReservas[] = [];

    area_reserva : any = {
        "bloco_id": 0,
        "descricao": ""
    }

    fecharModal(){
        this.showModal = false;
    }
    
    toggleNewDiv() {
        this.isNewDiv = !this.isNewDiv;
      }

    constructor(private router: Router,private areasReserva: AreasReservaService, private http: HttpClient) {}

    ngOnInit() {
        this.carregarBlocos(); 
        this.carregarAreasReservas();
         }
    carregarBlocos(){
        this.http.get<any[]>('http://192.168.1.59:5000/lista/blocos').subscribe(
            (resultado: any) => {
              this.blocos = resultado.blocos;  
            console.log(resultado);
            }
        )
    }

    carregarAreasReservas(){
        this.areasReserva.getAreasReserva().subscribe(
           (resultado: any) => {
            this.areaReservas = resultado;
            console.log(resultado);
           }
    )
    }

    addAreaReserva() {

        // Faz a solicitação HTTP POST com os dados da área de reserva
        this.http.post('http://192.168.1.59:5000/cadastrar/area_reserva', this.area_reserva).subscribe(
            (resultado: any) => {
                if (resultado.mensagem) {
                    this.mostrarMensagemSucesso(); // Mostra uma mensagem de sucesso
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000)
                } else {
                    // Trate outros cenários se necessário
                }
            },
            (error: any) => {
                // Trata os diferentes códigos de status de erro
                if (error.status === 400) {
                    this.mostrarMensagemClient(); // Mostra uma mensagem de erro do cliente
                } else if (error.status === 404) {
                    this.mostrarMensagemPage(); // Mostra uma mensagem se a página não for encontrada
                    this.router.navigateByUrl('/');
                } else if (error.status === 500) {
                    this.mostrarMensagemInfo(); // Mostra uma mensagem de erro interno do servidor
                } else {
                    // Trate outros erros, se necessário
                }
            }
        );
    }
    
    load(index: number){
        this.loading[index] = true;
        setTimeout(() => this.loading[index] = false, 1000);
      }

      displayModal: boolean = false;
    
      verCompleto(){
        this.displayModal = true;
      }

      mostrarMensagemSucesso() {
        Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: 'Área comuns inserido com sucesso!',
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
