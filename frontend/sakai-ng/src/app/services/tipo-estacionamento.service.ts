import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoEstacionamentoService {

SERVER_URL = 'http://127.0.0.1:5000';  

  constructor(private http:HttpClient) { }

  public getTipoEstacionamento(): Observable<TipoEstacionamento[]>{
    return this.http.get<TipoEstacionamento[]>(`${this.SERVER_URL}/lista/tipoEstacionamento`);
  }

}

export interface TipoEstacionamento {
  id_tipo_estacionamento: number;
  nome_tipo_estacionamento: string;
}
