import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaDemoComponent } from './mediademo.component';
import { MediaDemoRoutingModule } from './mediademo-routing.module';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { GalleriaModule } from 'primeng/galleria';
import { CarouselModule } from 'primeng/carousel';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';


@NgModule({
	imports: [
		CommonModule,
		MediaDemoRoutingModule,
		ButtonModule,
		ImageModule,
		DialogModule,
		GalleriaModule,
		CarouselModule,
		TableModule,
		InputTextModule,
		CalendarModule,
		FormsModule,
		DropdownModule
	],
	declarations: [MediaDemoComponent]
})
export class MediaDemoModule { }
