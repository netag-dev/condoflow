import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CondominService {
  SERVER_URL = 'http://192.168.1.59:5000';

  constructor(private http: HttpClient) { }

  public getCondominios(): Observable<Condominio[]>{
      return this.http.get<Condominio[]>(`${this.SERVER_URL}/lista/condominios`);    
  }
}

export interface Condominio{
   id_condominio: number;
   nome_condominio: string;
   tipo_condominio_id: number;
   sindico_id: number;
   endereco_id:number;

}

