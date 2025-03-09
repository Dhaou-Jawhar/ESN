import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CandidatDataComponent} from "./candidat-data/candidat-data.component";
import {CandidatProfileComponent} from "./candidat-profile/candidat-profile.component";
import {CandidatAddComponent} from "./candidat-add/candidat-add.component";
import {CvUploadComponent} from "./cv-upload/cv-upload.component";
import {CandidatUpdateComponent} from "./candidat-update/candidat-update.component";

const routes: Routes = [
    {
        path: '', // Chemin de base pour le module besoins
        redirectTo: 'candidatList', // Redirection par défaut
        pathMatch: 'full'
    },
    { path: 'candidatList',  component: CandidatDataComponent },
    { path: 'profile/:id', component: CandidatProfileComponent },
    { path: 'add',component:CandidatAddComponent},
    { path: 'upload', component:CvUploadComponent },
    { path: 'edit/:id', component: CandidatUpdateComponent }




];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CandidatRoutingModule { }
