import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconsComponent } from './icons/icons.component';
import { UtilitiesRoutingModule } from './utilities-routing.module';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card'
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        UtilitiesRoutingModule,
        InputTextModule,
        ButtonModule,
        CardModule,
        FormsModule
    ],
    declarations: [IconsComponent]
})
export class UtilitiesModule { }
