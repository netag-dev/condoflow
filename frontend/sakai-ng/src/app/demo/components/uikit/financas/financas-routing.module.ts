import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FinancasComponent } from "./financas.component";

@NgModule({
    imports: [RouterModule.forChild([
        {path: '', component: FinancasComponent}
    ])],
    exports: [RouterModule]
})

export class FinancasRoutingModule {}