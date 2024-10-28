import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MoradoresComponent } from "./moradores.component";
import { MoradoresRoutingModule } from "./moradores.routing.module";
import { MenubarModule } from "primeng/menubar";
import { BadgeModule } from "primeng/badge";
import { TableModule } from "primeng/table";
import { DialogModule } from "primeng/dialog";
import { HttpClientModule } from "@angular/common/http";
import { ButtonModule } from "primeng/button";

@NgModule({
    imports: [
        CommonModule,
        MoradoresRoutingModule,
        MenubarModule,
        BadgeModule,
        TableModule,
        DialogModule,
        HttpClientModule,
        ButtonModule
    ],

    declarations: [MoradoresComponent]
})

export class MoradoresModule {  }