import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DespesasService {

  SERVER_URL = 'http://192.168.1.59:5000';

  constructor(private http: HttpClient) { }

  public getDespesas(): Observable<Despesa[]>{
    return this.http.get<Despesa[]>(`${this.SERVER_URL}/admin/lista/despesa_moradores`);
  }

}

export interface Despesa {
     id_despesa: number;
     despesa_id: string;
     valor_despesa: number;
     morador_id: string;
     comprovativo_despesa:string;
     mes_despesa: Date;
     estado: string;

}
