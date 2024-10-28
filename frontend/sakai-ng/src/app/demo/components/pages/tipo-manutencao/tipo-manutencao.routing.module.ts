import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TipoManutencaoComponent } from "./tipo-manutencao.component";

@NgModule({
    imports: [RouterModule.forChild([
        {path: '', component: TipoManutencaoComponent}
    ])],
    exports: [RouterModule]
})

export class TipoManutencaoRoutingModule {  }