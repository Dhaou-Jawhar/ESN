import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ClientListComponent} from "../client/client-list/client-list.component";
import {ActionsListComponent} from "./actions-list/actions-list.component";
import {CandidatAddComponent} from "../candidat/candidat-add/candidat-add.component";
import {ActionsAddComponent} from "./actions-add/actions-add.component";
import {ClientUpdateComponent} from "../client/client-update/client-update.component";

const routes: Routes = [
    {
        path: '', // Chemin de base pour le module besoins
        redirectTo: 'actionsList', // Redirection par défaut
        pathMatch: 'full'
    },
    { path: 'actionsList', component: ActionsListComponent },
    { path: 'add',component:ActionsAddComponent},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActionsRoutingModule { }
