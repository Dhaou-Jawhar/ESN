import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CandidatDataComponent} from "../candidat/candidat-data/candidat-data.component";
import {CandidatProfileComponent} from "../candidat/candidat-profile/candidat-profile.component";
import {CandidatAddComponent} from "../candidat/candidat-add/candidat-add.component";
import {CvUploadComponent} from "../candidat/cv-upload/cv-upload.component";
import {CandidatUpdateComponent} from "../candidat/candidat-update/candidat-update.component";
import {SocieteFormComponent} from "./societe-form/societe-form.component";
import {SocieteUpdateComponent} from "./societe-update/societe-update.component";
import {SocieteListComponent} from "./societe-list/societe-list.component";
import {ClientUpdateComponent} from "../client/client-update/client-update.component";
import {SocieteClientsComponent} from "./societe-clients/societe-clients.component";

const routes: Routes =  [
    {
        path: '', // Chemin de base pour le module besoins
        redirectTo: 'societeList', // Redirection par défaut
        pathMatch: 'full'
    },
    { path: 'AddSociete', component:SocieteFormComponent },
    { path: 'societeList', component:SocieteListComponent },
    { path: 'editsociete/:id', component:SocieteUpdateComponent },
    { path: 'editSocieteClients/:id', component: SocieteClientsComponent },







];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SocieteRoutingModule { }
