import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DespesasService, Despesa } from 'src/app/services/despesas.service';
import Swal from 'sweetalert2'; 
import { AuthServiceService } from 'src/app/services/auth-service-service.service';

@Component({
  templateUrl: './money.component.html',
  styleUrl: './money.component.scss'
})
export class MoneyComponent implements OnInit{

  isNewDiv: boolean;
  representatives: any[] = [];
  searchQuery: string = '';
  rowsPerPageOptions: number[] = [10, 25, 50];
  loading = [false, false, false]; 
  despesasMoradores: Despesa[] = []; 
  despesas: any[] = [];

  isInAnalise(estado: string): boolean {
    return estado === 'em análise';
  }

  isPago(estado: string): boolean {
    return estado === 'Pago';
  }
   
constructor(
  private authService: AuthServiceService,
  private despesasService: DespesasService, 
  private http: HttpClient) {

}

fetchData(){
  const token = this.authService.getToken();
  if(!token){
    console.error('Token not found in sessionStorage.');
    return;
  }
  const headers = new HttpHeaders({
    Authorization: `Beaber ${token}`
  });
  this.http.get<any>('http://192.168.1.59:5000/admin/lista/despesa_moradores', { headers }).subscribe(
    (resposta: any) => {
      this.despesas = resposta.despesas;
      console.log(resposta);
    }
  )
}

  load(index: number) {
    this.loading[index] = true;
    setTimeout(() => (this.loading[index] = false), 1000);
  }

   ngOnInit(): void {
    this.fetchData();
   }

   

   isPDF(filename: string): boolean {
    return filename.toLowerCase().endsWith('.pdf');
  }

   id_despesa!: any;    
   aprovarPagamento(id_despesa: number){
    this.http.put(`http://192.168.1.59:5000/aprovar/pagamento/${id_despesa}`, {}).subscribe(
      (response: any) => {
         this.mostrarMensagemSucesso();
         setTimeout(() => {
         window.location.reload();   
         }, 2000) 
        console.log(response);
      }
    )
   }

   mostrarMensagemSucesso() {
    Swal.fire({
      icon: 'success',
      title: 'Sucesso!',
      text: 'Pagamento aprovado!',
      confirmButtonText: 'Ok'
    });
  } 
 
}
