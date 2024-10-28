import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AlertasEmergenciaComponent } from "./alertas-emergencia.component";
import { AlertasEmergenciaRoutingModule } from "./alertas-emergencia.routing.module";
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";
import { CalendarModule } from "primeng/calendar";
import { MenubarModule } from "primeng/menubar";
import { BadgeModule } from "primeng/badge";
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { DialogModule } from "primeng/dialog";
import { ButtonModule } from "primeng/button";
import { InputTextareaModule } from 'primeng/inputtextarea';

@NgModule({
    imports: [
        ReactiveFormsModule,
        RouterModule,
        DialogModule,
        ButtonModule,
        HttpClientModule,
        BadgeModule,
        MenubarModule,
        CalendarModule,
        TableModule,
        InputTextModule,
        AlertasEmergenciaRoutingModule,
        FormsModule,
        CommonModule,
        InputTextareaModule
    ],

    declarations: [AlertasEmergenciaComponent]
})

export class AlertasEmergenciaModule {  }