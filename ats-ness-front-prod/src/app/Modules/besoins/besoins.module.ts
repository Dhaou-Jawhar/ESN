import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BesoinsRoutingModule } from './besoins-routing.module';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { SidebarModule } from 'primeng/sidebar';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { BesoinListComponent } from './besoins-list/besoins-list.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BesoinsFormComponent } from './besoins-form/besoins-form.component';
import { Tooltip } from 'chart.js';
import { TooltipModule } from 'primeng/tooltip';
import { FieldsetModule } from 'primeng/fieldset';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import {AutoCompleteModule} from "primeng/autocomplete";
import {EditorModule} from "primeng/editor";
import {PanelModule} from "primeng/panel";
import {MultiSelectModule} from "primeng/multiselect";


@NgModule({
  declarations: [BesoinListComponent, BesoinsFormComponent],
  exports: [BesoinListComponent, BesoinsFormComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        BesoinsRoutingModule,
        TableModule,
        TagModule,
        ChipModule,
        ButtonModule,
        InputTextModule,
        CardModule,
        DividerModule,
        DialogModule,
        RippleModule,
        ToastModule,
        SidebarModule,
        CalendarModule,
        InputNumberModule,
        InputTextareaModule,
        CheckboxModule,
        DropdownModule,
        ProgressSpinnerModule,
        TooltipModule,
        FieldsetModule,
        ConfirmDialogModule,
        AutoCompleteModule,
        EditorModule,
        PanelModule,
        MultiSelectModule
    ]
})
export class BesoinsModule { }
