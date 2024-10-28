import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DashboardUsuarioRoutingModule } from "./dashboard-usuario-routing.module";
import { DashboardUsuarioComponent } from "./dashboard-usuario.component";
import { ButtonModule } from "primeng/button";
import { SidebarModule } from "primeng/sidebar";
import { RippleModule } from "primeng/ripple";
import { MenubarModule } from "primeng/menubar";
import { InputTextModule } from "primeng/inputtext";
import { BadgeModule } from "primeng/badge";
import { TableModule } from "primeng/table";
import { HttpClientModule } from "@angular/common/http";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";

@NgModule({
    imports: [
        CommonModule,
        ButtonModule,
        DashboardUsuarioRoutingModule,
        SidebarModule,
        RippleModule,
        MenubarModule,
        InputTextModule,
        BadgeModule,
        TableModule,
        HttpClientModule,
        CalendarModule,
        DialogModule       
      //  IconsModule
    ],
    declarations: [DashboardUsuarioComponent]
})
export class DashboardUsuarioModule { }
