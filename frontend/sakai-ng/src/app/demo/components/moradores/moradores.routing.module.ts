import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MoradoresComponent } from "./moradores.component";

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: MoradoresComponent }
])],
   exports: [RouterModule]
})

export class MoradoresRoutingModule {  }