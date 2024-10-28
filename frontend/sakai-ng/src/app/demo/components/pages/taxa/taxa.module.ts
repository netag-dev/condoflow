import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TaxaComponent } from "./taxa.component";
import { FormsModule } from "@angular/forms";
import { TableModule } from "primeng/table";
import { RouterModule } from "@angular/router";
import { InputTextModule } from "primeng/inputtext";
import { CardModule } from "primeng/card";
import { TaxaRoutingModule } from "./taxa.routing.module";
import { ButtonModule }from "primeng/button";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        RouterModule,
        InputTextModule,
        CardModule,
        TaxaRoutingModule,
        ButtonModule
    ],
    declarations: [TaxaComponent]
})

export class TaxaModule { }