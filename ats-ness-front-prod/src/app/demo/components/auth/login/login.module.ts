import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import {DialogModule} from "primeng/dialog";
import {OverlaysDemoRoutingModule} from "../../uikit/overlays/overlaysdemo-routing.module";
import {ToastModule} from "primeng/toast";
import {TooltipModule} from "primeng/tooltip";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {TableModule} from "primeng/table";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {SidebarModule} from "primeng/sidebar";
import {RippleModule} from "primeng/ripple";
import {ConfirmPopupModule} from "primeng/confirmpopup";
import {FileUploadModule} from "primeng/fileupload";

@NgModule({
    imports: [
        CommonModule,
        LoginRoutingModule,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        FormsModule,
        PasswordModule,
        DialogModule,
        CommonModule,
        OverlaysDemoRoutingModule,
        ToastModule,
        DialogModule,
        FormsModule,
        TooltipModule,
        InputTextModule,
        ButtonModule,
        OverlayPanelModule,
        TableModule,
        ConfirmDialogModule,
        SidebarModule,
        RippleModule,
        ConfirmPopupModule,
        FormsModule,
        ReactiveFormsModule,
        FileUploadModule,
    ],
    declarations: [LoginComponent]
})
export class LoginModule { }
