import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HistoricosComponent } from "./historicos.component";
import { HistoricosRoutingModule } from "./historicos.routing.module";
import { MenubarModule } from "primeng/menubar";
import { BadgeModule } from "primeng/badge";
import { TableModule } from "primeng/table";
import { DialogModule } from "primeng/dialog";
import { HttpClientModule } from "@angular/common/http";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { FormsModule } from "@angular/forms";
import { AccordionModule } from "primeng/accordion";
import { TabMenuModule } from "primeng/tabmenu";

@NgModule({
    imports: [
        CommonModule,
        HistoricosRoutingModule,
        MenubarModule,
        BadgeModule,
        TableModule,
        DialogModule,
        HttpClientModule,
        ButtonModule,
        InputTextModule,
        FormsModule,
        AccordionModule,
        TableModule,
        TabMenuModule
    ],
    declarations: [HistoricosComponent]
})

export class HistoricosModule {}