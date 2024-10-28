import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { DashboardUsuarioComponent } from "./dashboard-usuario.component";


@NgModule({
    imports: [RouterModule.forChild([
     {path: '', component: DashboardUsuarioComponent}   
])],
    exports: [RouterModule]
})

export class DashboardUsuarioRoutingModule {}
