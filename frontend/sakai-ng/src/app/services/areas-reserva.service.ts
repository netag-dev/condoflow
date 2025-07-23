import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AreasReservaService {

  constructor(private http: HttpClient) { }

  SERVER_URL = 'http://192.168.1.59:5000';

  public getAreasReserva(): Observable<AreasReservas[]>{
    return this.http.get<AreasReservas[]>(`${this.SERVER_URL}/lista/areas_reserva`);
  }

}

export interface AreasReservas{
  
  id_area_reserva: number;
  bloco_id: number;
  descricao: string;
  estado: string;

}

