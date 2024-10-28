import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatusCondoService {

  SERVER_URL = 'http://127.0.0.1:5000';
   
  constructor(private http:HttpClient) { }

  public getStatus_condo(): Observable<statusCondos[]> {
    return this.http.get<statusCondos[]>('http://127.0.0.1:5000/lista/status_condo');
  }
  // http://localhost:5000/lista/status_condo
}
  // public getStatus(): Observable<Status[]>{
  //  return this.http.get<Status[]>(`${this.SERVER_URL}/lista/status`);
   
//}


export interface statusCondos{
    id_status_condo: number;
    nome_status_condo: string;
}