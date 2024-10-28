import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ContasComponent } from "./contas.component";

@NgModule({
    imports: [RouterModule.forChild([
        {path: '', component: ContasComponent}
])],
    exports: [RouterModule]
})

export class ContasRoutingModule {  }