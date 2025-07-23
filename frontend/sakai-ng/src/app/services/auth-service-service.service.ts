import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private currentUser = new BehaviorSubject<any>(null);
  private apiUrl = 'http://localhost:5000'; 
  constructor(private http: HttpClient) {
    this.checkToken();
  }

  private apiUr = 'http://192.168.1.59:5000/user/reset-pass';

  resetPassword(token: string, newPassword: string): Observable<any> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

      const body = {
      token: token,
      new_password: newPassword
    };
    console.log('Sending request to reset password with body:', body);
    return this.http.post(this.apiUr, body, { headers: headers });
  }
 
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/forgot-pass`, { email });
  }

  loggedIn$ = this.loggedIn.asObservable();
  currentUser$ = this.currentUser.asObservable();

  private checkToken() {
    const storedCredentials = sessionStorage.getItem('currentUser');
    if (storedCredentials) {
      const credentials = JSON.parse(storedCredentials);
      if (credentials.token && credentials.user) {
        this.setLoggedIn(true);
        this.setCurrentUser(credentials.user);
      }
    }
  }

  setLoggedIn(isLoggedIn: boolean) {
    this.loggedIn.next(isLoggedIn);
  }

  isLoggedIn(): boolean {
    return this.loggedIn.value;
  }

  setCurrentUser(user: any) {
    const token = this.getToken();
    const credentials = { user, token };
    this.currentUser.next(user);
    sessionStorage.setItem('currentUser', JSON.stringify(credentials));
  }

  getCurrentUser(): any {
    const storedCredentials = sessionStorage.getItem('currentUser');
    return storedCredentials ? JSON.parse(storedCredentials).user : null;
  }

  setToken(token: string) {
    const user = this.getCurrentUser();
    const credentials = { user, token };
    sessionStorage.setItem('currentUser', JSON.stringify(credentials));
    this.setLoggedIn(true);
    this.currentUser.next(user);
  }

  getToken(): string | null {
    const storedCredentials = sessionStorage.getItem('currentUser');
    if (storedCredentials) {
      const credentials = JSON.parse(storedCredentials);
      return credentials.token;
    }
    return null;
  }

  fetchUserInfo(): Observable<any> {
    const token = this.getToken();
    if (token) {
      return this.http.get('http://192.168.1.59:5000/info/morador', {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`
        })
      }).pipe(
        tap((user) => this.setCurrentUser(user)),
        catchError(err => {
          console.error('Error fetching user info:', err);
          return of(null); 
        })
      );
    }
    return of(null); 
  }

  logout() {
    sessionStorage.removeItem('currentUser');
    this.setLoggedIn(false);
    this.setCurrentUser(null);
  }
}
