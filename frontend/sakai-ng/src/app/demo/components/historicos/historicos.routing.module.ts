import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HistoricosComponent } from "./historicos.component";

@NgModule({
    imports: [RouterModule.forChild([
        {path: '', component: HistoricosComponent}
    ])],
    exports: [RouterModule]
})

export class HistoricosRoutingModule {} 