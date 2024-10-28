import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TaxaComponent } from "./taxa.component";

@NgModule({
    imports: [RouterModule.forChild([
        {path: '', component: TaxaComponent}
    ])],
    exports: [RouterModule]
})

export class TaxaRoutingModule {  }