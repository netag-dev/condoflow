import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonDemoRoutingModule } from './buttondemo-routing.module';
import { ButtonDemoComponent } from './buttondemo.component';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { HttpClientModule } from '@angular/common/http';
import { InputMaskModule } from 'primeng/inputmask';


@NgModule({
	imports: [
		CommonModule,
		ButtonDemoRoutingModule,
		ButtonModule,
		RippleModule,
		SplitButtonModule,
		ToggleButtonModule,
		TableModule,
		InputTextModule,
		DialogModule, 
		FormsModule,
		HttpClientModule, 
		InputMaskModule
	],
	declarations: [ButtonDemoComponent]
})
export class ButtonDemoModule { }
