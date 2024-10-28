import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MoneyComponent } from "./money.component";

@NgModule({
    imports: [RouterModule.forChild([
        {path: '', component: MoneyComponent}
 ])],
 exports: [RouterModule]
})

export class MoneyRoutingModule { }