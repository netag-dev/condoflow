import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ManutencaoComponent } from "./manutencao.component";


@NgModule({
    imports: [RouterModule.forChild([
        {path: '', component: ManutencaoComponent}
    ])],
    exports: [RouterModule]
})

export class ManutencaoRoutingModule { }