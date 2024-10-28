import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FinancasRoutingModule } from "./financas-routing.module";
import { FinancasComponent } from "./financas.component";

@NgModule({
    imports: [
        NgModule,
        CommonModule,
        FinancasRoutingModule
    ],
    declarations: [FinancasComponent],
})
export class FinancasModule { }