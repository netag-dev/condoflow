import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ServicosComponent } from "./servicos.component";

@NgModule({
    imports: [RouterModule.forChild([
        {path: '', component: ServicosComponent}
    ])],
    exports: [RouterModule]
})

export class ServicosRoutingModule {}