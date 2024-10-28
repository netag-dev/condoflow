import { Component, OnInit } from '@angular/core';
import { BlocosService, Bloco } from 'src/app/services/blocos.service';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { EventosService, Eventos } from 'src/app/services/eventos.service';

@Component({
    templateUrl: './mediademo.component.html'
})
export class MediaDemoComponent implements OnInit {

  isNewDiv: boolean;
  representatives: any[] = []; 
  loading = [false, false, false];
  searchQuery: string = '';
  rowsPerPageOptions: number[] = [10, 25, 50];
  blocos: any[] = [];
  eventos: Eventos[] = [];


  toggleNewDiv() {
    this.isNewDiv = !this.isNewDiv;
  }

  evento : any = {
     "numeros_vagas_eventos": "",
     "bloco_id": 0,
     "data_inicio_eventos": "",
     "data_fim_eventos": ""
  } 

    
    constructor(private eventosService:EventosService ,private bloco: BlocosService, private http: HttpClient) { }

    addEventos() {
        this.http.post('http://127.0.0.1:5000/cadastrar/eventos', this.evento).subscribe(
        (response: any) => {
            this.mostrarMensagemSucesso(); // Mostra uma mensagem de sucesso
            setTimeout(() => {
                window.location.reload();
            }, 2000)

        console.log(response);

        }
        )
    }

    ngOnInit() {
        this.carregarBlocos(); 
        this.carregarEventos();
    }
     
     carregarEventos() {
       this.eventosService.getEventos().subscribe(
         (response: any) => {
          this.eventos = response;  
            console.log(response);
         }
       )     
     }

    carregarBlocos(){
        this.http.get<any[]>('http://127.0.0.1:5000/lista/blocos').subscribe(
            (resultado: any) => {
              this.blocos = resultado.blocos;  
            console.log(resultado);
            }
        )
    }

    load(index: number) {
        this.loading[index] = true;
        setTimeout(() => (this.loading[index] = false), 1000);
      }

      mostrarMensagemSucesso() {
        Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: 'Eventos inserido com sucesso!',
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
