import { Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PessoasService, Pessoa } from 'src/app/services/pessoas.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-table-demo',
  templateUrl: './tabledemo.component.html'
})


export class TableDemoComponent implements OnInit {

 
  constructor(private route: ActivatedRoute, private router: Router, private pessoasService: PessoasService, private http: HttpClient) { }
 
   
  //Endpoint que pega pessoas por id 

  ngOnInit() { 
    this.carregarPorteiros()
  }

  loading = [false, false, false];
  pessoas: Pessoa[] = [];
  enderecos: any[] = [];
  status: any[] = [];
  isNewDiv: boolean = false;
  divModify: boolean = false;
  representatives: any[] = []; 
  statuses: any[] = []; 
  showModal: boolean = false;
  pessoa: any = {};
  searchQuery: string = '';
  rowsPerPageOptions: number[] = [10, 25, 50]; 
  listaPorteiros: any[] = [];


  abrirModal(porteiro: any){
    this.divModify = true
    this.porteiro = {...porteiro}
    console.log(this.porteiro)
  }
  
  fecharModal() {
    this.showModal = false;
  }

  carregarPorteiros() {
    this.http.get<any>('http://192.168.1.59:5000/lista/porteiros').subscribe(
      data => {
        this.listaPorteiros = data;  
        console.log(data);
      },
      error => {
        console.error('Erro ao carregar porteiros:', error);
      }
    );
  }

  porteiro: any = {
  "nome_porteiro": "",
  "telefone_porteiro": "",
  "bi_porteiro": "",
  "email_porteiro": "",
  "senha_porteiro" :""
  };



  addPorteiro(){
      this.http.post('http://192.168.1.59:5000/cadastrar/porteiro', this.porteiro).subscribe(
        (response: any) => {
          if(response.mensagem){
            this.mostrarMensagemSucesso();
            setTimeout(() => {
             window.location.reload(); 
            }, 2000);
          }
          else {
            console.error(response)   
          }
          //console.log(response)

        },
        (error: any) => {
          console.error(error);
          this.mostrarMensagemErro();
        }
      )
  }

  toggleNewDiv() {
    this.isNewDiv = !this.isNewDiv;
  }

  eliminarPorteiro(idPorteiro : any){
    this.http.delete<{mensagem:any}>(`http://192.168.1.59:5000/deletar/porteiro/${idPorteiro}`).subscribe({
      next:(dados)=>{
        Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: dados.mensagem,
          confirmButtonText: 'Ok'
        });
        this.carregarPorteiros()
      }
    })
  }

  edit(){
    this.http.put<{mensagem: any}>(`http://192.168.1.59:5000/editar/porteiro/${this.porteiro.id_porteiro}`,this.porteiro)
  }



 
 
  /* Método de cadastrar pessoas */
/*
  addRelative() {
    if (!this.employeeObj.nome_pessoa ||
        !this.employeeObj.telefone_pessoa || 
        !this.employeeObj.endereco_id || 
        !this.employeeObj.status_id) {
      this.mostrarMensagemVazio();
      return; 
    }
  
    // Aqui você faz a solicitação para verificar se os dados já existem na BD...

    this.http.get(`http://192.168.1.59:5000/pessoas/${this.employeeObj.nome_pessoa}`).subscribe(
      (response: any) => {
        if (response.Mensagem) {
          // Se os dados já existirem, mostre uma mensagem de erro ou trate conforme necessário
          this.mostrarMensagemInfo();
        } else {
          // Se os dados não existirem, adicione-os normalmente
          this.http.post('http://192.168.1.59:5000/pessoas', this.employeeObj).subscribe(
            (response: any) => {
              if (response.Mensagem) {
                this.mostrarMensagemSucesso();
                setTimeout(() => {
                  window.location.reload();
                }, 2000)
              } else {
                // Tratar caso não seja possível adicionar os dados
              }
            },
            (error: any) => {
              // Tratar erros ao adicionar os dados
            }
          );
        }
      },
      (error: any) => {
        // Tratar erros ao verificar se os dados já existem
      }
    );
  }
  */

 /*  addRelative() {
   if(!this.employeeObj.nome_pessoa ||
   !this.employeeObj.telefone_pessoa || 
   !this.employeeObj.endereco_id || 
   !this.employeeObj.status_id ){
   this.mostrarMensagemVazio();
    return; 
     }
    this.http.post('http://192.168.1.59:5000/pessoas', this.employeeObj).subscribe(
      (response: any) => {
        if (response.Mensagem) {
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

 
  getEmployee(id_pessoa: number){
  this.http.get(`http://localhost:5000/pessoas/edit/${id_pessoa}`).subscribe((data: any) => {
        console.log('Dados da pessoa', data)    
        this.pessoa = data.Pessoa;
        this.showModal = true;      
    },
      (error: any) => {
          console.log(error)
      }
   )
  }  
    
mostrarMensagemSucesso() {
    Swal.fire({
      icon: 'success',
      title: 'Sucesso!',
      text: 'Novo Porteiro inserido com sucesso!',
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

  load(index: number){
    this.loading[index] = true;
    setTimeout(() => this.loading[index] = false, 1000);
  }

  trackByFn(index: any, item: any) {
    return index; // or item.id
  }

  onSort() {
    // Se necessário
  }

  expandAll() {
    // Se necessário
  }

  formatCurrency(value: number) {
    // Se necessário
  }

  clear() {
    // Se necessário
  }
}
