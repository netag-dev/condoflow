import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoUnidadesService {

SERVER_URL = 'http://127.0.0.1:5000';

  constructor(private http:HttpClient) { }

  public getTipoUnidades(): Observable<TipoUnidades[]>{
    return this.http.get<TipoUnidades[]>(`${this.SERVER_URL}/lista/tipoUnidades`);    
  }
}

export interface TipoUnidades {
  id_tipo_unidade: number;
  nome_tipo_unidade: string;
}
