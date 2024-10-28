import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ReservasService , Reserva} from 'src/app/services/reservas.service';


@Component({
  templateUrl: './servicos.component.html',
  styleUrls: ['./servicos.component.scss']
})

export class ServicosComponent implements OnInit{
  
  loading = [false, false, false];
  representatives: any[] = []; 
  searchQuery: string = '';
  rowsPerPageOptions: number[] = [10, 25, 50];
  reservas: Reserva[] = [];
  statuses: any[] = [];

  


  constructor
   (private reservasService: ReservasService, private http: HttpClient ){}

  isPendente(status: string): boolean {
    return status === 'pendente';
}

isAprovado(status: string): boolean {
    return status === 'aprovado';
}

isCancelado(status: string): boolean {
    return status === 'cancelado';
}

ngOnInit(): void{
   this.carregarReservasAprovados();
}

carregarReservasAprovados(){
   this.http.get<any[]>('http://127.0.0.1:5000/lista/reservasAprovado').subscribe(
    (resultado: any) => {
      this.reservas = resultado;
      console.log(resultado);
    }
   );

}

cols: any[] = [
  { field: 'id_reserva', header: 'ID' },
  { field: 'email_usuario', header: 'Usuário' },
  { field: 'nome_bloco', header: 'Nome do Bloco' },
  { field: 'data_da_reserva', header: 'Data da Reserva' },
  { field: 'status', header: 'Estado' }

];


}
