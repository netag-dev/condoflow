import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MyProfileComponent } from "./my-profile.component";

@NgModule({
    imports: [RouterModule.forChild([
        {path: '', component: MyProfileComponent}
    ])],
    exports: [RouterModule]
})

export class MyProfileRoutingModule { }

