import { NgModule } from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { ProductService } from './demo/service/product.service';
import { CountryService } from './demo/service/country.service';
import { CustomerService } from './demo/service/customer.service';
import { EventService } from './demo/service/event.service';
import { IconService } from './demo/service/icon.service';
import { NodeService } from './demo/service/node.service';
import { PhotoService } from './demo/service/photo.service';
import { HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { BlocksRoutingModule } from './blocks-routing.module';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DashboardUsuarioModule } from './demo/components/dashboard-usuario/dashboard-usuario.module';
import { ServicosModule } from './demo/components/servicos/servicos.module';
import { QRCodeModule } from 'angularx-qrcode';
import { MoneyModule } from './demo/components/money/money.module';
import { CalendarModule } from 'primeng/calendar';
import { MyProfileModule } from './demo/components/my-profile/my-profile.module';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io'; // Importe SocketIoConfig
import { LightboxModule } from 'ngx-lightbox';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



const config: SocketIoConfig = { url: 'http://localhost:5000', options: {} }; // Defina o objeto SocketIoConfig

@NgModule({
    declarations: [AppComponent, NotfoundComponent],
    imports: [AppRoutingModule, AppLayoutModule, 
             HttpClientModule, TableModule, 
             BlocksRoutingModule, CardModule,  FormsModule,
             ModalModule.forRoot(), ServicosModule, DashboardUsuarioModule,
             QRCodeModule, MoneyModule, CalendarModule,
              MyProfileModule, SocketIoModule.forRoot(config),
              LightboxModule, BrowserAnimationsModule
            ],
    providers: [
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        CountryService, CustomerService, EventService, IconService, NodeService,
        PhotoService, ProductService
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
