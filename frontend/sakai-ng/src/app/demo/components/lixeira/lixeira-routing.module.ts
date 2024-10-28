import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { LixeiraComponent } from "./lixeira.component";

@NgModule({
    imports: [RouterModule.forChild([
    { path: '', component: LixeiraComponent }    
    ])],
    exports: [RouterModule]
})

export class LixeiraRoutingModule {}