import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SegurancaComponent } from "./seguranca.component";

@NgModule({
    imports: [RouterModule.forChild([
        {path: '', component: SegurancaComponent}
    ])],
    exports: [RouterModule]
})

export class SegurancaRoutingModule {  }