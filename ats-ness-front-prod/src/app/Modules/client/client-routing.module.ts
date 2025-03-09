import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ClientListComponent} from "./client-list/client-list.component";
import {ClientAddComponent} from "./client-add/client-add.component";
import {ClientUpdateComponent} from "./client-update/client-update.component";

const routes: Routes =[
    {
        path: '', // Chemin de base pour le module besoins
        redirectTo: 'clientList', // Redirection par défaut
        pathMatch: 'full'
    },
    { path: 'clientList', component: ClientListComponent },
    { path: 'add',component:ClientAddComponent},
    { path: 'edit/:id', component: ClientUpdateComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
