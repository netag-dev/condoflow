import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { DisponivelComponent } from "./disponivel.component";

@NgModule({
    imports: [RouterModule.forChild([
        {path: '', component: DisponivelComponent}
    ])],

    exports: [RouterModule]
})

export class DisponivelRoutingModule {}