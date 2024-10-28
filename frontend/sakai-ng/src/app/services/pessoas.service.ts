import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PessoasService {
  SERVER_URL = 'http://127.0.0.1:5000';

  constructor(private http: HttpClient) { }

 public getPessoas(): Observable<Pessoa[]> {
  return this.http.get<Pessoa[]>('http://127.0.0.1:5000/lista/porteiros');
 }

 public eliminarPessoa(id_pessoa: number):Observable<any>{
  return this.http.delete<any>(`${this.SERVER_URL}/pessoas/delete/${id_pessoa}`);
 } 
}

export interface Pessoa {
  id_porteiro: number;
  nome_porteiro: string;
  telefone_porteiro: string;
  bi_porteiro: string;
  email_porteiro: string;
  senha_porteiro: string;
}