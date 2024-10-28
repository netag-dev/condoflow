import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { AuthServiceService } from './auth-service-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor(
  private authService: AuthServiceService,
  private router: Router) {}

  canActivate(): boolean {
    
    if(this.authService.isLoggedIn()){
      return true;
    }else{
      this.router.navigate(['/auth/login']);
      return false;
    }

  }
 
  
}
