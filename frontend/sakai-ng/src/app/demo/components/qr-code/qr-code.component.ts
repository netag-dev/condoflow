import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
 
  templateUrl: './qr-code.component.html',
  styleUrl: './qr-code.component.scss'
})
export class QRCodeComponent {
 
    myAngularxQrCode: string;

    constructor(private router: Router) {
      this.myAngularxQrCode = 'Cadastra-se como visitante!';
    }

    onQRCodeScanned(event: string) {
      if (event === this.myAngularxQrCode) {
        this.router.navigate(['/visitantes']);
        console.log(event)
      } else {
        console.log('QR Code inválido');
      }
    }

}
