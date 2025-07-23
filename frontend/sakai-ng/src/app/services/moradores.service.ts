import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MoradoresService {

  SERVER_URL = 'http://192.168.1.59:5000';

  constructor(private http: HttpClient) { }

  public getMoradores(): Observable<Morador[]>{
    return this.http.get<Morador[]>(`${this.SERVER_URL}/lista/moradores`);
  }
}

export interface Morador{
  nome_pessoa: string;
  email: string;
  telefone_pessoa: string;
  bi_pessoa: string;
  senha_usuario: string;
  fk_unidade: string
  fk_tipo_acesso: number;
  id_morador : string;
  id_pessoa : string;
}