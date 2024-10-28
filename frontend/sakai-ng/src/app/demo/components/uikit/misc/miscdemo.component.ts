import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { VisitantesService, Visitante } from 'src/app/services/visitantes.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
    templateUrl: './miscdemo.component.html'
})
export class MiscDemoComponent implements OnInit{

     loading = [false, false, false]; 
     isNewDiv: boolean;
     visitantes: Visitante[] = [];
     enderecos: any[] = [];
     status: any[] = [];
     representatives: any[] = []; 
     statuses: any[] = [];
     searchQuery: string = '';
     rowsPerPageOptions: number[] = [10, 25, 50];
     showModal: boolean = false; 

     isNotAutorizado(estado: string): boolean {
      return estado === 'Não Autorizado';
 }
  
  isAutorizado(estado: string): boolean {
      return estado === 'Autorizado';
 }
      

     constructor(private visitanteService: VisitantesService, 
        private http:HttpClient, private router: Router){}
     
      id_visitante!:any;    
      autorizarEntrada(id_visitante: number){
       this.http.put(`http://127.0.0.1:5000/aprovar/visita/${id_visitante}`, {}).subscribe(
        (response:any) => {
          this.mostrarMensagemSucesso();
          setTimeout(() => {
            window.location.reload();
          }, 2000);
          console.log(response);
        }
       ) 
        const visitante = this.visitantes.find(v => v.id_visitante === id_visitante);
        if(id_visitante){
          const payload = {
            destinatario: visitante.contacto_visitante,
            mensagem: 'Olá, estás autorizado a entrar!'
          };
          this.http.post('http://127.0.0.1:5000/cadastrar/enviar_sms', payload).subscribe(
            (response: any) => {
              console.log('SMS enviado com sucesso:', response);
            }
          )
        }
      }
         
         
    ngOnInit() {
        this.carregarVisitantes();
        this.carregarEndereco();
        this.carregarStatus(); 
    }

    fecharModal(){
        this.showModal = false;
    }

    cols: any[] = [
        { field: 'id_visitante', header: 'Id' },
        { field: 'nome_visitante', header: 'Nome' },
        { field: 'apelido_visitante', header: 'Apelido' },
        { field: 'contacto_visitante', header: 'Contacto' },
        { field: 'bilhete_visitante', header: 'Bilhete' },
        {field: 'nome_bloco' , header: 'Bloco' },
        { field: 'metragem_unidade', header: 'Unidade' },
        { field: 'estado', header: 'Estado' }
      ];

      visitante: any = {
        "id_pessoa": 0,
        "nome_pessoa": "",
        "telefone_pessoa": "",
        "endereco_id": 0,
        "status_id": 0,
        "bi_pessoa": ""
      };

      toggleNewDiv() {
        this.isNewDiv = !this.isNewDiv;
      }

      
    
      carregarVisitantes() {     
        this.visitanteService.getVisitantes().subscribe(
          (data: any) => {
            this.visitantes = data;
            console.log(data);
            const totalVisitantes = data.length;
            console.log('Total de Visitantes:' , totalVisitantes);           
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

      carregarStatus() {
        this.http.get<any[]>('http://127.0.0.1:5000/status').subscribe(
          (resultado) => {
            const res = resultado;
            const values = Object.values(res);
            this.status.push(values[0]);
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

      carregarEndereco() {
        this.http.get<any[]>('http://127.0.0.1:5000/endereco').subscribe(
          (resultado) => {
            const res = resultado;
            const values = Object.values(res);
            this.enderecos.push(values[0]);
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

      addVisitante() {
        if(!this.visitante.nome_pessoa ||
        !this.visitante.telefone_pessoa || 
        !this.visitante.endereco_id || 
        !this.visitante.status_id ){
        this.mostrarMensagemVazio();
         return; 
          }
         this.http.post('http://127.0.0.1:5000/cadastrar/visitante', this.visitante).subscribe(
           (response: any) => {
             if (response.mensagem) {
               this.mostrarMensagemSucesso();
                setTimeout(() => {
                 window.location.reload();
                }, 2000)
             } else {
              //  this.mostrarMensagemErro();
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
       /* Fim do método Para cadastrar .  */
       load(index: number){
        this.loading[index] = true;
        setTimeout(() => this.loading[index] = false, 1000);
      }

      mostrarMensagemSucesso() {
        Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: 'Visitante Permitido!',
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
