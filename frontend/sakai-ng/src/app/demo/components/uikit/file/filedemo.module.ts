import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';
import { FileDemoRoutingModule } from './filedemo-routing.module';
import { FileDemoComponent } from './filedemo.component';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { RippleModule } from 'primeng/ripple';
import { HttpClientModule } from '@angular/common/http';
import { InputMaskModule } from 'primeng/inputmask';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableDemoRoutingModule } from '../table/tabledemo-routing.module';
//import { TableDemoComponent } from '../table/tabledemo.component';
//import { ProgressBarModule } from 'primeng/progressbar';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		FileDemoRoutingModule,
		FileUploadModule,
		TableModule,
		InputTextModule,
		ButtonModule,
		ToggleButtonModule,
		RippleModule,
		HttpClientModule,
		InputMaskModule,
		DialogModule,
		MultiSelectModule,
		TableDemoRoutingModule,
		//TableDemoComponent,
		DropdownModule
	//	ProgressBarModule
	],
	declarations: [FileDemoComponent],
})
export class FileDemoModule { }
