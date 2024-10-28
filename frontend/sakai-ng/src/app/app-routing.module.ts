import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { AuthGuardService } from './services/auth-guard.service';

@NgModule({
    imports: [
        RouterModule.forRoot([
    {
    path: '', component: AppLayoutComponent,
    children: [
    { path: '', loadChildren: () => import('./demo/components/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate:[AuthGuardService] },
    { path: 'uikit', loadChildren: () => import('./demo/components/uikit/uikit.module').then(m => m.UIkitModule), canActivate:[AuthGuardService] },
    { path: 'utilities', loadChildren: () => import('./demo/components/utilities/utilities.module').then(m => m.UtilitiesModule), canActivate:[AuthGuardService] },
    { path: 'documentation', loadChildren: () => import('./demo/components/documentation/documentation.module').then(m => m.DocumentationModule), canActivate:[AuthGuardService] },
    { path: 'relatorios', loadChildren: () => import('./demo/components/relatorios/relatorios-routing.module').then(m => m.RelatoriosRoutingModule), canActivate:[AuthGuardService] },
    { path: 'money', loadChildren:() => import ('./demo/components/money/money-routing.module').then(m => m.MoneyRoutingModule), canActivate:[AuthGuardService] },
    { path: 'lixeira', loadChildren: () => import('./demo/components/lixeira/lixeira-routing.module').then(m => m.LixeiraRoutingModule), canActivate:[AuthGuardService] },
    { path: 'servicos', loadChildren:() => import ('./demo/components/servicos/servicos.module').then(m => m.ServicosModule), canActivate:[AuthGuardService] },
    { path: 'blocks', loadChildren: () => import('./demo/components/primeblocks/primeblocks.module').then(m => m.PrimeBlocksModule), canActivate:[AuthGuardService] },
    { path: 'pages', loadChildren: () => import('./demo/components/pages/pages.module').then(m => m.PagesModule), canActivate:[AuthGuardService] },
    { path: 'my-profile', loadChildren: () => import('./demo/components/my-profile/my-profile-routing.module').then(m => m.MyProfileRoutingModule) }  
 ]   
    },
    { path: 'auth', loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule) },
    { path: 'landing', loadChildren: () => import('./demo/components/landing/landing.module').then(m => m.LandingModule)},
    { path: 'notfound', component: NotfoundComponent },
    { path: 'dashboard-user', loadChildren: () => import('./demo/components/dashboard-usuario/dashboard-usuario.module').then( m => m.DashboardUsuarioModule)},
    { path: 'visitantes', loadChildren: () => import('./demo/components/visitantes/visitantes.module').then(m => m.VisitantesModule)},
    { path: 'qr-code', loadChildren: () => import('./demo/components/qr-code/qr-code.module').then(m => m.QrCodeModule)},
    { path: 'disponivel', loadChildren: () => import('./demo/components/disponivel/disponivel.module').then(m => m.DisponivelModule),canActivate:[AuthGuardService] },
    { path: 'moradores', loadChildren: () => import('./demo/components/moradores/moradores.module').then(m => m.MoradoresModule), canActivate:[AuthGuardService]},
    { path: 'visitas', loadChildren: () => import('./demo/components/visitas/visitas.module').then(m => m.VisitasModule), canActivate:[AuthGuardService] },
    { path: 'contas', loadChildren: () => import('./demo/components/contas/contas.module').then(m => m.ContasModule), canActivate:[AuthGuardService] },
    { path: 'meu-perfil', loadChildren: () => import('./demo/components/meu-perfil/meu-perfil.module').then(m => m.MeuPerfilModule), canActivate:[AuthGuardService]},
    { path: 'reservas-moradores', loadChildren: () => import('./demo/components/reservas-moradores/reservas-moradores.module').then(m => m.ReservasMoradoresModule), canActivate:[AuthGuardService]},
    { path: 'alertas-emergencia', loadChildren: () => import('./demo/components/alertas-emergencia/alertas-emergencia.module').then(m => m.AlertasEmergenciaModule), canActivate:[AuthGuardService] },
    { path: 'historicos', loadChildren: () => import('./demo/components/historicos/historicos.module').then(m => m.HistoricosModule), canActivate:[AuthGuardService] },
    { path: 'manutencao', loadChildren: () => import('./demo/components/manutencao/manutencao.module').then(m => m.ManutencaoModule), canActivate:[AuthGuardService] },
    { path: 'seguranca', loadChildren: () => import('./demo/components/seguranca/seguranca.module').then(m => m.SegurancaModule), canActivate:[AuthGuardService] },
    {path: 'pedido-de-socorro', loadChildren: () => import('./demo/components/alertas-dos-moradores/alertas-dos-moradores.module').then(m => m.AlertasDosMoradoresModule), canActivate: [AuthGuardService]},
    { path: '**', redirectTo: '/notfound' },
    ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
