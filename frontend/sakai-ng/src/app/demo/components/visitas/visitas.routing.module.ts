import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { VisitasComponent } from "./visitas.component";

@NgModule ({
    imports: [RouterModule.forChild([
        {path: '', component: VisitasComponent}
    ])],
    exports: [RouterModule]
})

export class VisitasRoutingModule {  }