import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { AccessRoutingModule } from './access-routing.module';
import { AccessComponent } from './access.component';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        AccessRoutingModule,
        ButtonModule,
        PasswordModule,
        InputTextModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [AccessComponent]
})
export class AccessModule { }
