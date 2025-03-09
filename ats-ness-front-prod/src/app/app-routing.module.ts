import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";

@NgModule({
    imports: [
        RouterModule.forRoot([
            { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

            { path: 'auth', loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule) },

            {
                path: '', component: AppLayoutComponent,
                children: [
                    { path: 'dashboard', loadChildren: () => import('./demo/components/dashboard/dashboard.module').then(m => m.DashboardModule) },
                    { path: 'backoffice', loadChildren: () => import('./demo/components/uikit/uikit.module').then(m => m.UIkitModule) },
                    { path: 'utilities', loadChildren: () => import('./demo/components/utilities/utilities.module').then(m => m.UtilitiesModule) },
                    { path: 'documentation', loadChildren: () => import('./demo/components/documentation/documentation.module').then(m => m.DocumentationModule) },
                    { path: 'blocks', loadChildren: () => import('./demo/components/primeblocks/primeblocks.module').then(m => m.PrimeBlocksModule) },
                    { path: 'pages', loadChildren: () => import('./demo/components/pages/pages.module').then(m => m.PagesModule) },
                    { path: 'back-office/besoins', loadChildren: () => import('./Modules/besoins/besoins.module').then(m => m.BesoinsModule) }, // Route pour besoins
                    { path: 'back-office/candidat', loadChildren: () => import('./Modules/candidat/candidat.module').then(m => m.CandidatModule) }, // Route pour besoins
                    { path: 'back-office/societe', loadChildren: () => import('./Modules/societe/societe.module').then(m => m.SocieteModule) }, // Route pour besoins
                    { path: 'back-office/client', loadChildren: () => import('./Modules/client/client.module').then(m => m.ClientModule) }, // Route pour besoins
                    { path: 'back-office/actions', loadChildren: () => import('./Modules/actions/actions.module').then(m => m.ActionsModule) }, // Route pour besoins


                ]
            },

            { path: 'landing', loadChildren: () => import('./demo/components/landing/landing.module').then(m => m.LandingModule) },
            { path: 'notfound', component: NotfoundComponent },
            { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
