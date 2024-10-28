import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MoneyComponent } from "./money.component";
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { InputTextModule } from "primeng/inputtext";
import { DialogModule } from "primeng/dialog";

@NgModule({
    declarations: [MoneyComponent],
    imports: [
        CommonModule,
        FormsModule,
        AccordionModule,
        ButtonModule,
        TableModule,
        InputTextModule,
        DialogModule
    ]
})

export class MoneyModule {  


}