import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SegurancaComponent } from "./seguranca.component";
import { SegurancaRoutingModule } from "./seguranca.routing.module";
import { MenubarModule } from "primeng/menubar";
import { BadgeModule } from "primeng/badge";
import { TableModule } from "primeng/table";
import { DialogModule } from "primeng/dialog";
import { HttpClientModule } from "@angular/common/http";
import { ButtonModule } from "primeng/button";
import { TabMenuModule } from "primeng/tabmenu";
import { InputTextModule } from "primeng/inputtext";

@NgModule({
    imports: [
        CommonModule,
        MenubarModule,
        BadgeModule,
        TabMenuModule,
        TableModule,
        DialogModule,
        ButtonModule,
        HttpClientModule,
        SegurancaRoutingModule,
        InputTextModule
    ],
    declarations: [SegurancaComponent]
})

export class SegurancaModule {  }