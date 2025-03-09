import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
       // { path: 'condidature', data: { breadcrumb: 'Condidature' }, loadChildren: () => import('./condidature/condidat-add/condidature.module').then(m => m.CondidatureModule) },
       // { path: 'data', data: { breadcrumb: 'Condidat-data' }, loadChildren: () => import('./condidature/condidat-data/condidat-data.module').then(m => m.CondidatDataModule) },
       // { path: 'profile/:id', data: { breadcrumb: 'Candidat-profile' }, loadChildren: () => import('./condidature/candidat-profile/candidat-profile.module').then(m => m.CandidatProfileModule) },
       // { path: 'upload', data: { breadcrumb: 'Cv-upload' }, loadChildren: () => import('./condidature/cv-upload/cv-upload.module').then(m => m.CvUploadModule) },
       // { path: 'edit/:id', data: { breadcrumb: 'Candidat-update' }, loadChildren: () => import('./condidature/candidat-update/candidat-update.module').then(m => m.CandidatUpdateModule) },
       // { path: 'societe', data: { breadcrumb: 'Societe' }, loadChildren: () => import('./societe/societe-form/societe-form.module').then(m => m.SocieteFormModule) },
       // { path: 'editsociete/:id', data: { breadcrumb: 'Societe-update' }, loadChildren: () => import('./societe/societe-update/societe-update.module').then(m => m.SocieteUpdateModule) },
       // { path: 'societelist', data: { breadcrumb: 'SocieteList' }, loadChildren: () => import('./societe/societe-list/societe-list.module').then(m => m.SocieteListModule) },
       // { path: 'besoinlist', data: { breadcrumb: 'BesoinList' }, loadChildren: () => import('./besoin/besoin-list/besoin-list.module').then(m => m.BesoinListModule) },
        // { path: 'button', data: { breadcrumb: 'Button' }, loadChildren: () => import('./button/buttondemo.module').then(m => m.ButtonDemoModule) },
        // { path: 'charts', data: { breadcrumb: 'Charts' }, loadChildren: () => import('./charts/chartsdemo.module').then(m => m.ChartsDemoModule) },
        // { path: 'file', data: { breadcrumb: 'File' }, loadChildren: () => import('./file/filedemo.module').then(m => m.FileDemoModule) },
        // { path: 'floatlabel', data: { breadcrumb: 'Float Label' }, loadChildren: () => import('./floatlabel/floatlabeldemo.module').then(m => m.FloatlabelDemoModule) },
        // { path: 'formlayout', data: { breadcrumb: 'Form Layout' }, loadChildren: () => import('./formlayout/formlayoutdemo.module').then(m => m.FormLayoutDemoModule) },
        // { path: 'input', data: { breadcrumb: 'Input' }, loadChildren: () => import('./input/inputdemo.module').then(m => m.InputDemoModule) },
        // { path: 'invalidstate', data: { breadcrumb: 'Invalid State' }, loadChildren: () => import('./invalid/invalidstatedemo.module').then(m => m.InvalidStateDemoModule) },
        // { path: 'list', data: { breadcrumb: 'List' }, loadChildren: () => import('./list/listdemo.module').then(m => m.ListDemoModule) },
        // { path: 'media', data: { breadcrumb: 'Media' }, loadChildren: () => import('./media/mediademo.module').then(m => m.MediaDemoModule) },
        // { path: 'message', data: { breadcrumb: 'Message' }, loadChildren: () => import('./messages/messagesdemo.module').then(m => m.MessagesDemoModule) },
        // { path: 'misc', data: { breadcrumb: 'Misc' }, loadChildren: () => import('./misc/miscdemo.module').then(m => m.MiscDemoModule) },
        // { path: 'overlay', data: { breadcrumb: 'Overlay' }, loadChildren: () => import('./overlays/overlaysdemo.module').then(m => m.OverlaysDemoModule) },
        // { path: 'panel', data: { breadcrumb: 'Panel' }, loadChildren: () => import('./panels/panelsdemo.module').then(m => m.PanelsDemoModule) },
        // { path: 'table', data: { breadcrumb: 'Table' }, loadChildren: () => import('./table/tabledemo.module').then(m => m.TableDemoModule) },
        // { path: 'tree', data: { breadcrumb: 'Tree' }, loadChildren: () => import('./tree/treedemo.module').then(m => m.TreeDemoModule) },
        // { path: 'menu', data: { breadcrumb: 'Menu' }, loadChildren: () => import('./menus/menus.module').then(m => m.MenusModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class UIkitRoutingModule { }
