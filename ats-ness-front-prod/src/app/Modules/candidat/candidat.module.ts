import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CandidatRoutingModule } from './candidat-routing.module';
import {FileUpload, FileUploadModule} from "primeng/fileupload";
import {RippleModule} from "primeng/ripple";
import {DropdownModule} from "primeng/dropdown";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {FormsModule} from "@angular/forms";
import {CalendarModule} from "primeng/calendar";
import {ChartModule} from "primeng/chart";
import {PaginatorModule} from "primeng/paginator";
import {TableModule} from "primeng/table";
import {DataViewModule} from "primeng/dataview";
import {PickListModule} from "primeng/picklist";
import {OrderListModule} from "primeng/orderlist";
import {RatingModule} from "primeng/rating";
import {ToastModule} from "primeng/toast";
import {DialogModule} from "primeng/dialog";
import {CardModule} from "primeng/card";
import {SliderModule} from "primeng/slider";
import {MultiSelectModule} from "primeng/multiselect";
import {ProgressBarModule} from "primeng/progressbar";
import {NgxStarsModule} from "ngx-stars";


@NgModule({
  declarations: [],
    imports: [
        CommonModule,
        FileUploadModule,
        RippleModule,
        CandidatRoutingModule,
        DropdownModule, // Import PrimeNG dropdown module
        InputTextModule, // Import PrimeNG input text module
        ButtonModule, // Import PrimeNG button module
        FormsModule, // Import FormsModule for template-driven forms
        CalendarModule,
        ChartModule,
        PaginatorModule,
        TableModule,
        DataViewModule,
        PickListModule,
        OrderListModule,
        RatingModule,
        ToastModule,
        DialogModule,
        CardModule,
        SliderModule,
        MultiSelectModule,
        ProgressBarModule,
        NgxStarsModule,


    ],
})
export class CandidatModule { }
