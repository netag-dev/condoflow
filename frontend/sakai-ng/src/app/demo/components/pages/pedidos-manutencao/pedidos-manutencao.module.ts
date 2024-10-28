import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PedidosManutencaoComponent } from "./pedidos-manutencao.component";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { FormsModule } from "@angular/forms";
import { CardModule } from "primeng/card";
import { HttpClientModule } from "@angular/common/http";
import { TableModule } from "primeng/table";
import { DialogModule } from "primeng/dialog";
import { PedidosManutencaoRoutingModule } from "./pedidos-manutencao.routing.module";




@NgModule({
    imports: [
       CommonModule,
       InputTextModule,
       ButtonModule,
       FormsModule,
       CardModule,
       HttpClientModule,
       TableModule,
       DialogModule,
       PedidosManutencaoRoutingModule

    ],

    declarations: [PedidosManutencaoComponent]
})

export class PedidosManutencaoModule {  }
