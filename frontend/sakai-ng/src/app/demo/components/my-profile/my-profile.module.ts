import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MyProfileComponent } from "./my-profile.component";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";


@NgModule({
   
   imports: [
    CommonModule,
    FormsModule,
    ButtonModule

   ],
   declarations: [MyProfileComponent]

})

export class MyProfileModule {}