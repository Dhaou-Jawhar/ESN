import {LOCALE_ID, NgModule} from '@angular/core';
import {
    CommonModule,
    HashLocationStrategy,
    LocationStrategy,
    PathLocationStrategy,
    registerLocaleData
} from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { ProductService } from './demo/service/product.service';
import { CountryService } from './demo/service/country.service';
import { CustomerService } from './demo/service/customer.service';
import { EventService } from './demo/service/event.service';
import { IconService } from './demo/service/icon.service';
import { NodeService } from './demo/service/node.service';
import { PhotoService } from './demo/service/photo.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {BrowserModule} from "@angular/platform-browser";
import {ConfirmationService, MessageService} from "primeng/api";
import {ToastModule} from "primeng/toast";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {ButtonModule} from "primeng/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UserService} from "./demo/service/user.service";
import {TokenInterceptor} from "../../token.interceptor";
import {NgxStarsModule} from "ngx-stars";
import {BesoinsRoutingModule} from "./Modules/besoins/besoins-routing.module";
import {CandidatRoutingModule} from "./Modules/candidat/candidat-routing.module";
import {FileUpload, FileUploadModule} from "primeng/fileupload";
import {InputTextModule} from "primeng/inputtext";
import {DropdownModule} from "primeng/dropdown";
import {PasswordModule} from "primeng/password";
import {TabMenuModule} from "primeng/tabmenu";
import {StepsModule} from "primeng/steps";
import {AutoCompleteModule} from "primeng/autocomplete";
import {MultiSelectModule} from "primeng/multiselect";
import {CalendarModule} from "primeng/calendar";
import {CardModule} from "primeng/card";
import {CheckboxModule} from "primeng/checkbox";
import {ChipModule} from "primeng/chip";
import {TabViewModule} from "primeng/tabview";
import {RippleModule} from "primeng/ripple";
import {DialogModule} from "primeng/dialog";
import {RouterModule} from "@angular/router";
import {SocieteModule} from "./Modules/societe/societe.module";
import {ClientModule} from "./Modules/client/client.module";
import localeFr from '@angular/common/locales/fr';


@NgModule({
    declarations: [AppComponent, NotfoundComponent],
    imports: [AppRoutingModule,
        AppLayoutModule,
        BrowserAnimationsModule,
        BrowserModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatInputModule,
        HttpClientModule,
        BrowserModule,
        AppRoutingModule,
        ToastModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        ButtonModule,
        HttpClientModule,
        NgxStarsModule,
        BesoinsRoutingModule,
        CandidatRoutingModule,
        CommonModule,
        FormsModule,
        InputTextModule,
        DropdownModule,
        FileUploadModule,
        PasswordModule,
        ButtonModule,
        ToastModule,
        TabMenuModule,
        StepsModule,
        AutoCompleteModule,
        MultiSelectModule,
        CalendarModule,
        CardModule,
        CheckboxModule,
        ChipModule,
        TabViewModule,
        RippleModule,
        DialogModule,
        RouterModule,
        SocieteModule,
        ClientModule,



        ToastModule],
    providers: [
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        CountryService, CustomerService, EventService, IconService, NodeService,
        PhotoService, ProductService,MessageService,
        UserService,      FileUpload,ConfirmationService, { provide: LOCALE_ID, useValue: 'fr-FR' },

        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
    constructor() {
        registerLocaleData(localeFr);
    }
}
