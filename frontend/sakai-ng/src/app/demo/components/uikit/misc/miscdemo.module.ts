import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiscDemoComponent } from './miscdemo.component';
import { MiscDemoRoutingModule } from './miscdemo-routing.module';
import { ProgressBarModule } from 'primeng/progressbar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from 'primeng/button';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ScrollTopModule } from 'primeng/scrolltop';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { TableDemoRoutingModule } from '../table/tabledemo-routing.module';
import { InputMaskModule } from 'primeng/inputmask';
import { DialogModule } from 'primeng/dialog';

@NgModule({
	imports: [
		CommonModule,
		MiscDemoRoutingModule,
		ProgressBarModule,
		BadgeModule,
		AvatarModule,
		ScrollPanelModule,
		TagModule,
		ChipModule,
		ButtonModule,
		SkeletonModule,
		AvatarGroupModule,
		ScrollTopModule,
		TableModule,
		InputTextModule,
		FormsModule, 
		TableDemoRoutingModule, 
		InputMaskModule,
		DialogModule
	],
	declarations: [MiscDemoComponent]
})
export class MiscDemoModule { }
