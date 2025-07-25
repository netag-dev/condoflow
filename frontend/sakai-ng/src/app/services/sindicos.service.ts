import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SindicosService {

  SERVER_URL = 'http://192.168.1.59:5000';

  constructor(private http: HttpClient) { }

  public getSindicos(): Observable<Sindico[]>{
    return this.http.get<Sindico[]>(`${this.SERVER_URL}/lista/sindico`);
  }
  
  addSindico(sindico: any): Observable<any>{
    return this.http.post<Sindico[]>(`${this.SERVER_URL}/cadastrar/sindico`,sindico)
  }

  editar(id_sindico:any, sindico : any): Observable<{mensagem:any}>{
    return this.http.put<{mensagem:any}>(`${this.SERVER_URL}/editar/sindico/${id_sindico}`, sindico)
  }

}

export interface Sindico {
  id_sindico: number;
  telefone_sindico: string;
  bi_sindico: string;
  email_sindico: string;
  senha_sindico : string;
}
