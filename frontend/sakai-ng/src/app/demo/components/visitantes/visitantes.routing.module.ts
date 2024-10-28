import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { VisitantesComponent } from "./visitantes.component";

@NgModule({
    imports: [RouterModule.forChild([
    {path: '', component: VisitantesComponent}
])],

    exports: [RouterModule]
})


export class VisitantesRoutingModule { }