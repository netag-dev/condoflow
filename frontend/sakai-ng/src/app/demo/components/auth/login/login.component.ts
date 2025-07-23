import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api'
import Swal from 'sweetalert2';
import { AuthServiceService } from 'src/app/services/auth-service-service.service';

@Component({
   selector: 'app-login',
    templateUrl: './login.component.html',
    providers: [MessageService],
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class LoginComponent {
    loginObj: any = {username: '', password: ''};

    constructor(private router:Router,
        public layoutService: LayoutService, 
        private http:HttpClient,
        private authService: AuthServiceService
        )
     {}

    login(credentials: any) {   
        if(!credentials.username || !credentials.password){
            this.mostrarMensagemAviso();
            return;    
        }
        this.http.post<any>('http://192.168.1.59:5000/user/login', credentials, {withCredentials: true}).subscribe(    
        (response: any) => {
        if (response.token) {
            const token = response.token;
            this.authService.setToken(token);
            this.authService.setCurrentUser({ username: credentials.username, token: token });
            this.mostrarMensagemSucesso().then(() => {
               if(response.type === 'admin'){
                this.router.navigate(['/']);
               } else if(response.type === 'morador'){
                this.router.navigate(['/moradores']);
               } else if(response.type === 'porteiro'){
                this.router.navigate(['seguranca']);
               }  
            });
        } else{
        this.mostrarMensagemErro();
        }
    },
    (error: HttpErrorResponse) => {
        console.error('Error:', error);
        this.mostrarMensagemErro();
    }
);
}

      
 

mostrarMensagemSucesso() {
return  Swal.fire({
icon: 'success',
title: 'Sucesso!',
text: 'Login efetuado com sucesso!',
confirmButtonText: 'YES',
        
});
}

mostrarMensagemErro() {
Swal.fire({
icon: "error",
title: "Erro!",
text: "Email ou senha está incorreto, por favor tente novamente!",
confirmButtonText: "YES"
});
}

      mostrarMensagemAviso(){
        Swal.fire({
            icon: "warning",
            title: "Aviso",
            text: "Preencha os campos corretamente!",
            confirmButtonText: "YES"
        })
      }

}