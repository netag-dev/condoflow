import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentationRoutingModule } from './documentation-routing.module';
import { DocumentationComponent } from './documentation.component';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
    imports: [
        CommonModule,
        DocumentationRoutingModule,
        TableModule,
        FormsModule,
        ButtonModule,
        InputTextModule,
        InputMaskModule,
        DialogModule,
        DropdownModule
    ],
    declarations: [DocumentationComponent]
})
export class DocumentationModule { }
