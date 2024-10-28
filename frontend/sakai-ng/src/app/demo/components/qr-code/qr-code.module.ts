import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrCodeRoutingModule } from './qr-code.routing.module';
import { QRCodeComponent } from './qr-code.component';
import { QRCodeModule } from 'angularx-qrcode';
import { ProgressBarModule } from 'primeng/progressbar';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [QRCodeComponent],
  imports: [
    CommonModule,
    QrCodeRoutingModule,
    QRCodeModule,
    ProgressBarModule,
    RouterModule
  ]
})
export class QrCodeModule { }
