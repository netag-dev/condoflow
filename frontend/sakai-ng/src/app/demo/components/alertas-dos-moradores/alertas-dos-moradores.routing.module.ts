import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AlertasDosMoradoresComponent } from "./alertas-dos-moradores.component";

@NgModule({
    imports: [RouterModule.forChild([
        {path: '', component: AlertasDosMoradoresComponent}
    ])],
    exports: [RouterModule]
})

export class AlertasDosMoradoresRoutingModule {  }