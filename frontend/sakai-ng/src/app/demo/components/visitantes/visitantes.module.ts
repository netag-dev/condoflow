// visitantes.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { VisitantesComponent } from './visitantes.component';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputMaskModule } from 'primeng/inputmask';

const routes: Routes = [
  { path: '', component: VisitantesComponent }
];

@NgModule({
  declarations: [VisitantesComponent],
  imports: [
    CommonModule,
    InputTextModule,
    FormsModule,
    MessageModule,
    InputMaskModule,
    ProgressBarModule,
    ButtonModule,
    RouterModule.forChild(routes),
    MenubarModule
  ]
})
export class VisitantesModule { }
