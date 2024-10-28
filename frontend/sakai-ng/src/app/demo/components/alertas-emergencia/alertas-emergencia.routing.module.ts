import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AlertasEmergenciaComponent } from "./alertas-emergencia.component";

@NgModule({
    imports: [RouterModule.forChild([
        {path: '', component: AlertasEmergenciaComponent}
    ])],
    exports: [RouterModule]

})

export class AlertasEmergenciaRoutingModule{  }