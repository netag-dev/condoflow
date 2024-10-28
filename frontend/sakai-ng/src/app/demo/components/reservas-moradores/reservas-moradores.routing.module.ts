import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ReservasMoradoresComponent } from "./reservas-moradores.component";


@NgModule({
    imports: [RouterModule.forChild([
        {path: '', component: ReservasMoradoresComponent}
    ])],
    exports: [RouterModule]
})

export class ReservasMoradoresRoutingModule {}