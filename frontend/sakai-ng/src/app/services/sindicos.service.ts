import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SindicosService {

  SERVER_URL = 'http://127.0.0.1:5000';

  constructor(private http: HttpClient) { }

  public getSindicos(): Observable<Sindico[]>{
    return this.http.get<Sindico[]>(`${this.SERVER_URL}/lista/sindico`);
  }

}

export interface Sindico {
  id_pessoa: number;
  nome_pessoa: string;
  telefone_pessoa: string;
  endereco_id: number;
  status_id: number;
  bi_pessoa: string;

}
