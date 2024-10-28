import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DespesasTipoService {

   SERVER_URL = 'http://127.0.0.1:5000';
   
  constructor(private http: HttpClient) { }

  public getTipoDespesas(): Observable<Despesas[]>{
    return this.http.get<Despesas[]>(`${this.SERVER_URL}/lista/tipoDespesas`);
  }
}

export interface Despesas {
    id_despesa: number;
    nome_despesa: string;
    valor_despesa: string;
}