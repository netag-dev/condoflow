import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
             
                items: [
                    { label: 'Dashboard' , icon: 'pi pi-fw pi-home', routerLink: ['/'] }
                ]
            },

            {
              
                icon: 'pi pi-fw pi-briefcase',
                items: [
            
                    {
                        label: 'Pessoas',
                        icon: 'pi pi-fw pi-users',
                        items: [
                            {
                                label: 'Segurança / Porteiro',
                                icon: 'pi pi-fw pi-user-plus',
                                routerLink: ['uikit/table']
                            },
                            {
                                label: 'Moradores',
                                icon: 'pi pi-fw pi-user-plus',
                                routerLink: ['/uikit/file']
                            },{
                                label: 'Visitantes',
                                icon: 'pi pi-fw pi-user-plus',
                                routerLink: ['/uikit/misc']
                            },
                            {
                                label: 'Visitantes Autorizado',
                                icon: 'pi pi-fw pi-user-plus',
                                routerLink: ['/blocks']
                            },
                            {
                                label: 'Síndicos',
                                icon: 'pi pi-fw pi-user-plus',
                                routerLink: ['/uikit/button']
                            }

                          
                           
                        ]
                    },
                ]
            },


            {
              
                icon: 'pi pi-fw pi-briefcase',
                items: [
            
                    {
                        label: 'Condomínios',
                        icon: 'pi pi-fw pi-building',
                        items: [
                            {
                                label: 'Blocos',
                                icon: 'pi pi-fw pi-table',
                                routerLink: ['/uikit/floatlabel']
                            },{
                                label: 'Unidades',
                                icon: 'pi pi-fw pi-cog',
                                routerLink: ['/documentation']
                            },
                                                
                           
                        ]
                    },
                ]
            },

      
            {
              
                icon: 'pi pi-fw pi-briefcase',
                items: [
            
                    {
                        label: 'Reservas',
                        icon: 'pi pi-fw pi-building',
                        items: [
                        {
                                label: 'Vagas de estacionamento',
                                items: [
                                    { 
                                        label: 'Eventos',
                                        icon: 'pi pi-fw pi-cog',
                                        routerLink: ['/uikit/media']
                                    }
                                    
                                ]
                            },
                            {
                                label: 'Áreas comuns',
                                items: [
                                    { 
                                        label: 'Áreas comuns',
                                        icon: 'pi pi-fw pi-cog',
                                        routerLink: ['/uikit/tree']
                                    },
                                    {
                                        label: 'Pedidos de Reserva',
                                        icon: 'pi pi-fw pi-cog',
                                        routerLink: ['/uikit/formlayout']
                                    },

                                    {
                                        label:'Pedidos Aceites',
                                        icon:'pi pi-fw pi-cog',
                                        routerLink: ['/servicos']
                                    }
                                    
                                ]
                            },
                           
                        ]
                    },
                ]
            },

            {
               
            items: [
            { label: 'Condomínio', icon: 'pi pi-fw pi-home', routerLink: ['/pages/crud'] },
            { label: 'Estacionamento', icon: 'pi pi-car', routerLink: ['/uikit/input'] },
            { label: 'Finanças', icon: 'pi pi-money-bill', routerLink: ['/money'] },
            { label: 'Relatórios', icon: 'pi pi-fw pi-list', routerLink: ['/relatorios'] },
            { label: 'Pedidos de Manutenção', icon: 'pi pi-spin pi-spinner', routerLink: ['pages/pedidos-manutencao'] },
                    
                ]
            },
           
            {
              
                icon: 'pi pi-spin pi-briefcase',
                items: [
            
                    {
                        label: 'Configurações',
                        icon: 'pi pi-spin pi-wrench',
                        items: [
                            {
                                label: 'Status',
                                icon: 'pi pi-fw pi-plus',
                                routerLink: ['/uikit/list']
                            },

                            {
                                label: 'Tipo de Condomínio',
                                icon: 'pi pi-fw pi-plus',
                                routerLink: ['/pages/timeline']
                            },

                            {
                                label: 'Tipo de Unidade',
                                icon: 'pi pi-fw pi-plus',
                                routerLink: ['/utilities/icons']
                            },
                            {
                                label: 'Tipo de Estacionamento',
                                icon: 'pi pi-fw pi-plus',
                                routerLink: ['/pages/empty']
                            },

                            {
                                label: 'Tipo de Manutenção',
                                icon: 'pi pi-fw pi-plus',
                                routerLink: ['/pages/tipo-manutencao']
                            },
                            
                            {
                                label: 'Despesa do condomínio',
                                icon: 'pi pi-fw pi-plus',
                                routerLink: ['/pages/taxas-condominio']
                            },

                            
                            {
                                label: 'Reciclagem',
                                icon: 'pi pi-fw pi-trash',
                                routerLink: ['/lixeira']
                            }

                          
                           
                        ]
                    },
                ]
            },
          
        ];
    }
}
