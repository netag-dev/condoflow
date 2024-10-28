import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  logout(): Observable<any>{
    return this.http.post<any>('http://127.0.0.1:5000/sair/logout', {});
  }
}
