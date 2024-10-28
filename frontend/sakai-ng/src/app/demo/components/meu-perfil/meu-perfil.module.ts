import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MeuPerfilComponent } from "./meu-perfil.component";
import { ButtonModule } from "primeng/button";
import { HttpClientModule } from "@angular/common/http";
import { TableModule } from "primeng/table";
import { InputTextModule } from "primeng/inputtext";
import { BadgeModule } from "primeng/badge";
import { ReactiveFormsModule } from "@angular/forms";
import { MeuPerfilRoutingModule } from "./meu-perfil.routing.module";
import { MenubarModule } from "primeng/menubar";
import { CardModule } from "primeng/card";

@NgModule({
    imports: [
        ReactiveFormsModule,
        CommonModule,
        MeuPerfilRoutingModule,
        BadgeModule,
        FormsModule,
        HttpClientModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        MenubarModule,
        CardModule
    ],

    declarations: [MeuPerfilComponent]
})

export class MeuPerfilModule {}