import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlocosService {

  SERVER_URL = 'http://127.0.0.1:5000';

  constructor(private http: HttpClient) { }

 public getBlocos(): Observable<Bloco[]>{
    return this.http.get<Bloco[]>(`${this.SERVER_URL}/lista/blocos`);
  }
}

export interface Bloco{
   id_bloco: number;
   nome_bloco: string;
   condominio_id: number; 
}