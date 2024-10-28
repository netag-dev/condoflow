import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MeuPerfilComponent } from "./meu-perfil.component";

@NgModule({
    imports: [RouterModule.forChild([
        {path: '', component: MeuPerfilComponent}
    ])],
    exports: [RouterModule]
})

export class MeuPerfilRoutingModule {}