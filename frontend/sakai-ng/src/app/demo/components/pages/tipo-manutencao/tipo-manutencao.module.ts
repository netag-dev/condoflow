import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TipoManutencaoComponent } from "./tipo-manutencao.component";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { TipoManutencaoRoutingModule } from "./tipo-manutencao.routing.module";



@NgModule({
    imports: [
        CommonModule,
        InputTextModule,
        ButtonModule,
        CardModule,
        FormsModule,
        HttpClientModule,
        TipoManutencaoRoutingModule            
    ],
    declarations: [TipoManutencaoComponent]
})

export class TipoManutencaoModule {  }