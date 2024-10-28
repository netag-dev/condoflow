import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthServiceService } from 'src/app/services/auth-service-service.service';


@Injectable({
  providedIn: 'root'
})
export class VisitantesService {

  SERVER_URL = 'http://127.0.0.1:5000';

  constructor(
    private http:HttpClient,
    private authService: AuthServiceService) { }

 

  public getVisitantes(): Observable<Visitante[]>{
    const token = this.authService.getToken();
    if(!token){
      console.error('Token not found in sessionStorage.')
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get<Visitante[]>(`${this.SERVER_URL}/lista/visitas`, { headers });
  }

  public getVisitantesAprovado(): Observable<Visitante[]>{
    return this.http.get<Visitante[]>(`${this.SERVER_URL}/lista/visitantesAutorizado`);
  }
}

export interface Visitante {
  id_visitante: number;
  nome_visitante: string;
  apelido_visitante: string;
  contacto_visitante: string;
  bilhete_visitante: string;
  nome_bloco: number;
  metragem_unidade: number;
  estado: string;
}
