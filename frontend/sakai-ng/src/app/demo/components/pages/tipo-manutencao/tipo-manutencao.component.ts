import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  templateUrl: './tipo-manutencao.component.html',
  styleUrl: './tipo-manutencao.component.scss'
})
export class TipoManutencaoComponent implements OnInit {

  tipoManu: any = {
      "descricao_manutencao": ''
  }

  constructor(private http: HttpClient) {}

  addTipoManutencao(){
    this.http.post('http://192.168.1.59:5000:/cadastrar/tipoManutencao', this.tipoManu).subscribe(
      (data: any) => {
      this.mostrarMensagemSuccesso();
      setTimeout(() => {
        window.location.reload();
      }, 2000)  
      console.log("Cadastrado com sucesso", data);
      }   
  )
  }

  ngOnInit(): void {
    
  }

  mostrarMensagemSuccesso(){
      Swal.fire({
        icon: 'success',
        title: 'Sucesso',
        text: 'Tipo de manutenção cadastrado.',
        confirmButtonText: 'Ok'

      });
  }

}
