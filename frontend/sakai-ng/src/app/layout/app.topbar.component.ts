import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Reserva, ReservasService } from '../services/reservas.service';
import { AuthServiceService } from '../services/auth-service-service.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {
 
    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(private reservasService: ReservasService
        ,private authServiceService: AuthServiceService, private router:Router,private http:HttpClient, public layoutService: LayoutService) {
}

totalReservas: number = 0;
reservas: Reserva[] = [];
userEmail: string = '';

carregarReservas(){
      this.reservasService.getReservas().subscribe(
        (data: any) => {
             this.reservas = data;
             this.totalReservas = this.reservas.length;
             console.log(data);
        }
      );
}

ngOnInit(): void{
    this.carregarReservas();
    this.setUserEmail();
}

logout(){
    setTimeout(() => {
     this.router.navigate(['/auth/login']);
     },200)
     this.authServiceService.logout();   
     sessionStorage.removeItem('currentUser');
 }

 setUserEmail() {
    const currentUser = sessionStorage.getItem('currentUser');
    if (currentUser) {
      const userObj = JSON.parse(currentUser);
      this.userEmail = userObj.user.username;
    } else {
      console.error('User not found in sessionStorage');
    }
  }

    
}
