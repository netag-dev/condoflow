import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { RelatoriosComponent } from "./relatorios.component";

@NgModule({
    imports: [RouterModule.forChild([
        {path: '', component: RelatoriosComponent}
    ])],
    exports: [RouterModule]
})
export class RelatoriosRoutingModule {}