import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstacionamentosService {

  SERVER_URL = 'http://127.0.0.1:5000';
  
  constructor(private http: HttpClient) { }

  public getEstacionamentos(): Observable<Estacionamento[]>{
      return this.http.get<Estacionamento[]>(`${this.SERVER_URL}/lista/estacionamento`);
  }

}


export interface Estacionamento {

  id_estacionamento:number;
  serie_estacionamento:string;
  unidade_id: number;
  bloco_id:number;
  tipo_estacionamento_id: number;
  status_condo_id: number;
   
}