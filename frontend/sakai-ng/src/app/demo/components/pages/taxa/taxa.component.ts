import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  templateUrl: './taxa.component.html',
  styleUrl: './taxa.component.scss'
})
export class TaxaComponent {

  constructor(private http: HttpClient) {}

  despesas: any = {
    "nome_tipo_despesa": "",
    "tipo_valor_despesa": null
  }


  addTaxa(){
     this.http.post('http://localhost:5000/cadastrar/tipoDespesa', this.despesas).subscribe(
      (response: any) => {
        if(response.mensagem){
          this.mostrarMensagemSucesso();
          setTimeout(() => {
            window.location.reload();
          }, 2000)
        }        
        console.log(response);
      }
     )
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
       text: 'Despesa cadastrado com sucesso!',
       confirmButtonText: 'OK'
   });
}   

}
