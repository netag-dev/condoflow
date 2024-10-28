import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BlocosService, Bloco } from 'src/app/services/blocos.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
    templateUrl: './floatlabeldemo.component.html',
})
export class FloatLabelDemoComponent implements OnInit {

    blocos: any = {
        "id_bloco": 0,
        "nome_bloco": "",
        "condominio_id":0 
    }

    toggleNewDiv() {
        this.isNewDiv = !this.isNewDiv;
      }

      fecharModal() {
        this.showModal = false;
      }

    loading = [false, false, false];
    isNewDiv: boolean;
    representatives: any[] = []; 
    statuses: any[] = [];
    searchQuery: string = '';
    rowsPerPageOptions: number[] = [10, 25, 50];
    showModal: boolean = false;
    condominios: any[] = [];
    bloc: Bloco[] = [];

    cols: any[] = [
        { field: 'id_bloco', header: 'ID' },
        { field: 'nome_bloco', header: 'Bloco' },
        { field: 'condominio_id', header: 'Condomínio' }        
      ];  

constructor(private http: HttpClient, 
    private blocoService: BlocosService, 
    private router: Router) {
      
}

ngOnInit() {
    this.carregarCondominios();
    this.carregarBlocos();
 }

carregarBlocos() {
    this.blocoService.getBlocos().subscribe(
        (data: any) => {
          this.bloc = data.blocos;
          console.log(data);
          const totalBlocos = data.length;
          console.log('Total de Blocos:' , totalBlocos);           
        },
        (error: any) => {
          if (error.status === 400) {
            this.mostrarMensagemClient();
          } else if (error.status === 404) {
            this.mostrarMensagemPage();
            this.router.navigateByUrl('/');
          } else if (error.status === 500) {
                this.mostrarMensagemInfo();
          } else {
           // this.mostrarMensagemErro();
          }
        }
      );
}

    addBloco(){
     if(!this.blocos.nome_bloco || !this.blocos.condominio_id){
         this.mostrarMensagemVazio();
         return;
     }
      this.http.post('http://127.0.0.1:5000/cadastrar/bloco', this.blocos).subscribe(
        (response: any) => {
        if (response.mensagem) {
            this.mostrarMensagemSucesso();
            console.log(response);
            setTimeout(() => {
                window.location.reload();
            }, 2000)
        }     else{

        }
        
        }, 
       (error: any) => {
        if (error.status === 400) {
            this.mostrarMensagemClient();
          } else if (error.status === 404) {
            this.mostrarMensagemPage();
            this.router.navigateByUrl('/');
          } else if (error.status === 500) {
                this.mostrarMensagemInfo();
          } else {
            //this.mostrarMensagemErro();
          }
        }
      );  
    }

    carregarCondominios(){
        this.http.get<any[]>('http://127.0.0.1:5000/lista/condominios').subscribe(
            (resultado: any) => {
             this.condominios = resultado.condominios;    
            console.log(this.condominios);
            }
        )
    }

    load(index: number){
        this.loading[index] = true;
        setTimeout(() => this.loading[index] = false, 1000);
      }
      
      mostrarMensagemSucesso() {
        Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: 'Bloco inserido com sucesso!',
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
