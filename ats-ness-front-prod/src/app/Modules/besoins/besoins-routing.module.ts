import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BesoinListComponent } from './besoins-list/besoins-list.component';
import { BesoinsFormComponent } from './besoins-form/besoins-form.component';

const routes: Routes = [
  {
    path: '',
    component: BesoinListComponent
  },
  { path: 'AddBesoin', component:BesoinsFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BesoinsRoutingModule { }
