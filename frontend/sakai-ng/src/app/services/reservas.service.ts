import { HttpClient , HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthServiceService } from './auth-service-service.service';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {

  SERVER_URL = 'http://127.0.0.1:5000';

  constructor(
    private http: HttpClient,
    private authService: AuthServiceService
  ) { }

  public getReservas(): Observable<Reserva[]>{
    const token = this.authService.getToken();
    if(!token){
      console.error('Token not found in sessionStorage.')
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get<Reserva[]>(`${this.SERVER_URL}/lista/reservas`, {headers});
  }

  public getReservasTodos(): Observable<Reserva[]>{
    return this.http.get<Reserva[]>(`${this.SERVER_URL}/lista/reservas/todos`);
  }

  public getReservasAprovado(): Observable<Reserva[]>{
    return this.http.get<Reserva[]>(`${this.SERVER_URL}/lista/reservasAprovado`);
  }
}

export interface Reserva {
  id_reserva: number;
  usuario_id: string;
  bloco_id: number;
  data_da_reserva: Date
}