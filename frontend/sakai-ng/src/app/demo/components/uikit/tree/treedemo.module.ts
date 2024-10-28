import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TreeDemoComponent } from './treedemo.component';
import { TreeDemoRoutingModule } from './treedemo-routing.module';
import { TreeModule } from 'primeng/tree';
import { TreeTableModule } from 'primeng/treetable';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { RouterModule } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
	imports: [
		CommonModule,
		TreeDemoRoutingModule,
		FormsModule,
		TreeModule,
		TreeTableModule,
		InputTextareaModule,
		ButtonModule,
		TableModule,
		InputTextModule,
		CalendarModule,
		DialogModule,
		RouterModule,
		DropdownModule
	],
	declarations: [TreeDemoComponent],
})
export class TreeDemoModule { }
