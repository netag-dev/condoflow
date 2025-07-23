import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/services/auth-service-service.service';

@Component({
  templateUrl: './pedidos-manutencao.component.html',
  styleUrl: './pedidos-manutencao.component.scss'
})
export class PedidosManutencaoComponent implements OnInit{

    isNewDiv: boolean;
    loading = [false, false, false];
    representatives: any[] = []; 
    searchQuery: string = '';
    rowsPerPageOptions: number[] = [10, 25, 50];
    showModal: boolean = false;
    pedidos: any[] = [];

    toggleNewDiv() {
      this.isNewDiv = !this.isNewDiv;
    }

    load(index: number){
      this.loading[index] = true;
      setTimeout(() => this.loading[index] = false, 1000);
    }

    constructor(
    private http: HttpClient,
    private authService: AuthServiceService) {}

    fetchData(){
      const token = this.authService.getToken();
      if(!token){
        console.error('Token not found in sessionStorage.');
        return;
      }
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
      });
      this.http.get<any>('http://192.168.1.59:5000/admin/lista/manutencao', { headers }).subscribe(
        (resposta: any) => {
          this.pedidos = resposta.manutencao;
          console.log(resposta);
        }
      )
    }

  ngOnInit(): void {
    this.fetchData();
  }


}
