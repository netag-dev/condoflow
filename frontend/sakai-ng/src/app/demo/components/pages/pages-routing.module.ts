import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'crud', loadChildren: () => import('./crud/crud.module').then(m => m.CrudModule) },
        { path: 'empty', loadChildren: () => import('./empty/emptydemo.module').then(m => m.EmptyDemoModule) },
        { path: 'timeline', loadChildren: () => import('./timeline/timelinedemo.module').then(m => m.TimelineDemoModule) },
        { path: 'taxas-condominio', loadChildren: () => import('./taxa/taxa.module').then(m => m.TaxaModule) },
        { path: 'pedidos-manutencao', loadChildren: () => import('./pedidos-manutencao/pedidos-manutencao.module').then(m => m.PedidosManutencaoModule) },
        { path: 'tipo-manutencao', loadChildren: () => import('./tipo-manutencao/tipo-manutencao.module').then(m => m.TipoManutencaoModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
