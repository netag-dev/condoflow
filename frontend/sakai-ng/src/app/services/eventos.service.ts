import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EventosService {

  SERVER_URL = 'http://192.168.1.59:5000'

  constructor(private http: HttpClient) { }

  public getEventos(): Observable<Eventos[]>{
    return this.http.get<Eventos[]>(`${this.SERVER_URL}/lista/eventos`);
  }

}

export interface Eventos{
    numeros_vagas_eventos: number,
    bloco_id:number,
    data_inicio_eventos: Date,
    data_fim_eventos: Date
}
