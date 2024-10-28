import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { PedidosManutencaoComponent } from "./pedidos-manutencao.component";


@NgModule({
  imports: [RouterModule.forChild([
    {path: '', component: PedidosManutencaoComponent}
  ])], 
  exports: [RouterModule]

})
export class PedidosManutencaoRoutingModule {  }
