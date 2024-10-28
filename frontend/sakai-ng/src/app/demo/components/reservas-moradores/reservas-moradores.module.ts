import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TableModule } from "primeng/table";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { ReservasMoradoresComponent } from "./reservas-moradores.component";
import { MenubarModule } from "primeng/menubar";
import { CalendarModule } from "primeng/calendar";
import { ReservasMoradoresRoutingModule } from "./reservas-moradores.routing.module";
import { BadgeModule } from "primeng/badge";
import { DialogModule } from "primeng/dialog";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";

@NgModule({
    imports: [
        ButtonModule,
        TableModule,
        CommonModule,
        InputTextModule,
        MenubarModule,
        CalendarModule,
        ReservasMoradoresRoutingModule,
        BadgeModule,
        DialogModule,
        RouterModule,
        FormsModule
    ],
    declarations: [ReservasMoradoresComponent]
})

export class ReservasMoradoresModule { }