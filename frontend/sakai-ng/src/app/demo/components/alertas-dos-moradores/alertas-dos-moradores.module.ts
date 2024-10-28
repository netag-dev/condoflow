import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AlertasDosMoradoresComponent } from "./alertas-dos-moradores.component";
import { AlertasDosMoradoresRoutingModule } from "./alertas-dos-moradores.routing.module";
import { MenubarModule } from "primeng/menubar";
import { TableModule } from "primeng/table";
import { HttpClientModule } from "@angular/common/http";
import { ButtonModule } from "primeng/button";
import { TabMenuModule } from "primeng/tabmenu";
import { InputTextModule } from "primeng/inputtext";
import { DialogModule } from "primeng/dialog";

@NgModule({
    imports: [
        CommonModule,
        MenubarModule,
        TableModule,
        TabMenuModule,
        DialogModule,
        AlertasDosMoradoresRoutingModule,
        InputTextModule,
        ButtonModule,
        HttpClientModule
    ],

    declarations: [AlertasDosMoradoresComponent]
})

export class AlertasDosMoradoresModule {  }