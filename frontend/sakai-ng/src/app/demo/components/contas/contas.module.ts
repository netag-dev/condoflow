import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContasComponent } from "./contas.component";
import { ContasRoutingModule } from "./contas.routing.module";
import { TreeModule } from 'primeng/tree';
import { TreeTableModule } from 'primeng/treetable';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
    imports: [
    ReactiveFormsModule,
    CommonModule,
    ContasRoutingModule,
    TreeModule,
    TreeTableModule,
    InputTextareaModule,
    BadgeModule,
    TableModule,
    ButtonModule,
    HttpClientModule,
    MenubarModule,
    InputTextModule,
    FormsModule,
    DialogModule,
    CalendarModule,
    RouterModule,
    DropdownModule

    ],

    declarations: [ContasComponent]
})

export class ContasModule {}