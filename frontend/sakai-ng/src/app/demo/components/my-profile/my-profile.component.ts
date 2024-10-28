import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/auth-service-service.service';

@Component({
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss'
})
export class MyProfileComponent implements OnInit{

  currentUser: any;

  constructor( 
    private router:Router,
    private http:HttpClient,
    private authService:AuthServiceService  

   ){}

ngOnInit(): void {
  this.fetchData();
  this.currentUser = this.authService.getCurrentUser();
  if(!this.authService.isLoggedIn()){
  this.router.navigate(['/auth/login']);
  return; 
  }

  const userInfoObservable = this.authService.fetchUserInfo();
    userInfoObservable.subscribe({
      next: (user) => {
        if (user) {
          this.currentUser = user; // Atualiza o currentUser local
        } else {
          console.error('User info not available');
        }
      },
      error: (err) => {
        console.error('Error fetching user info:', err);
        this.authService.setLoggedIn(false);
        this.authService.setCurrentUser(null);
        this.router.navigate(['/auth/login']);
      }
    });
}

logout():void {
  setTimeout(() => {
    this.router.navigate(['/auth/login']);
  }, 200)
  this.authService.logout();
  sessionStorage.removeItem('currentUser');
}

fetchData(): void{
    const token = this.authService.getToken();
    if(!token){
      console.error('Token not found in sessionStorage');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get('http://127.0.0.1:5000/user/protected', {headers}).subscribe(
      (resposta: any) => {
        console.log(resposta);
      }
    );
    
} 

}
