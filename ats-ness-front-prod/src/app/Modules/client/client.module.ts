import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ClientRoutingModule,
      ReactiveFormsModule,
      FormsModule,
  ]
})
export class ClientModule { }
