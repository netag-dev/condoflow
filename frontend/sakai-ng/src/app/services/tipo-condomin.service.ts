import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoCondominService {

  SERVER_URL = 'http://127.0.0.1:5000';

  constructor(private http:HttpClient) { }

  public getTipoCondominio(): Observable<TipoCondomin[]> {
  return this.http.get<TipoCondomin[]>('http://127.0.0.1:5000/lista/tipocondominio');
}

}

export interface TipoCondomin{
    id_tipo_condominio: number;
    nome_tipo_condominio: string;
}
