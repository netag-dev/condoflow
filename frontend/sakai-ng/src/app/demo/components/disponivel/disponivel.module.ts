import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { DisponivelComponent } from "./disponivel.component";
import { RouterModule, Routes } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { MenubarModule } from "primeng/menubar";
import { BadgeModule } from "primeng/badge";
import { DialogModule } from "primeng/dialog";
const routes: Routes = [
  { path: '', component: DisponivelComponent }
];

@NgModule({
  declarations: [DisponivelComponent],
  imports: [
    CommonModule,
    ButtonModule,
    TableModule,
    MenubarModule,
    DialogModule,
    BadgeModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class DisponivelModule { }
