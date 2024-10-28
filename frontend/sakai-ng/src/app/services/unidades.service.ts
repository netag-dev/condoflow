import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnidadesService {

   SERVER_URL = 'http://127.0.0.1:5000';
   
  constructor(private http: HttpClient) { }

  public getUnidades(): Observable<Unidade[]> {
      return this.http.get<Unidade[]>(`${this.SERVER_URL}/lista/unidade`);
  }
}

export interface Unidade{
  id_unidade: number;
  numero_quarto_unidade: string;
  metragem_unidade: string;
  tipo_unidade_id: number;
  unidade_id: number;
} 