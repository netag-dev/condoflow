import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { FormsModule } from "@angular/forms";
import { DialogModule } from "primeng/dialog";
import { VisitasComponent } from "./visitas.component";
import { MenubarModule } from "primeng/menubar";
import { BadgeModule } from "primeng/badge";
import { VisitasRoutingModule } from "./visitas.routing.module";
import { InputTextModule } from "primeng/inputtext";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
    imports: [
        CommonModule,
        ButtonModule,
        TableModule,
        FormsModule,
        DialogModule,
        MenubarModule,
        BadgeModule,
        VisitasRoutingModule,
        InputTextModule,
        HttpClientModule
    ],
    declarations: [VisitasComponent]
})

export class VisitasModule {  }