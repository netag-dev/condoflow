import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmptyDemoRoutingModule } from './emptydemo-routing.module';
import { EmptyDemoComponent } from './emptydemo.component';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
//import { QRCodeModule } from 'primeng/qrcode';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';




@NgModule({
    imports: [
        CommonModule,
        EmptyDemoRoutingModule,
        InputTextModule,
        ButtonModule,
       // QRCodeModule,
       CardModule,
       FormsModule,
       HttpClientModule
    ],
    declarations: [EmptyDemoComponent]
})
export class EmptyDemoModule { }
