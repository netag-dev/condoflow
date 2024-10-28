import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TableModule } from "primeng/table";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { BadgeModule } from "primeng/badge";
import { MenubarModule } from "primeng/menubar";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { ManutencaoComponent } from "./manutencao.component";
import { ManutencaoRoutingModule } from "./manutencao.routing.module";
import { InputTextareaModule } from "primeng/inputtextarea";


@NgModule({
     imports: [
        ButtonModule,
        CommonModule,
        TableModule,
        FormsModule,
        RouterModule,
        BadgeModule,
        MenubarModule,
        ManutencaoRoutingModule,
        InputTextModule,
        InputTextareaModule
     ],
     declarations: [ManutencaoComponent]
})

export class ManutencaoModule {}
