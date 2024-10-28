import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { HttpClientModule } from '@angular/common/http';
import { InputMaskModule } from 'primeng/inputmask';
import { ServicosComponent } from './servicos.component';
import { ServicosRoutingModule } from './servicos-routing.module';

@NgModule({
    imports: [
        CommonModule,
        ButtonModule,
        RippleModule,
        SplitButtonModule,
        ToggleButtonModule,
        TableModule,
        InputTextModule,
        FormsModule,
        DialogModule,
        HttpClientModule,
        InputMaskModule,
        ServicosRoutingModule   
    ],
    declarations: [ServicosComponent]
})

export class ServicosModule {}