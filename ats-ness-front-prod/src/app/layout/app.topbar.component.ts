import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { LayoutService } from "./service/app.layout.service";
import { Router } from '@angular/router';
import {UserService} from "../demo/service/user.service";
import {MessageService} from "primeng/api";

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent implements OnInit{

    @ViewChild('menubutton') menuButton!: ElementRef;
    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;
    @ViewChild('topbarmenu') menu!: ElementRef;

    profilePictureUrl: string = '';
    isAdmin: boolean = false;
    displayDialog: boolean = false; // Affiche ou masque le p-dialog
    newAdminEmail: string = ''; // Stocke l'email saisi
    isEmailValid: boolean = false; // État de la validité de l'email
    emailError: boolean = false; // Affiche le message d'erreur
    constructor(public layoutService: LayoutService,
                private router: Router,
                private userService: UserService,
                private messageService: MessageService

    ) { }

    logout() {
        localStorage.clear();
        this.router.navigate(['/auth/login']);
    }

    changeTheme(theme: string, colorScheme: string) {
        this.theme = theme;
        this.colorScheme = colorScheme;
    }

    ngOnInit(): void {
        // Retrieve the picture URL from localStorage on component initialization
        const storedUrl = localStorage.getItem('picture_url');
        if (storedUrl) {
            this.profilePictureUrl = storedUrl;
        } else {
            // Set a default picture URL if nothing is in localStorage
            this.profilePictureUrl = 'assets/images/default-profile.png';
        }


        const role = localStorage.getItem('role');
        this.isAdmin = role === 'ADMIN';
    }

    set theme(val: string) {
        this.layoutService.config.update((config) => ({
            ...config,
            theme: val,
        }));
    }

    get theme(): string {
        return this.layoutService.config().theme;
    }

    set colorScheme(val: string) {
        this.layoutService.config.update((config) => ({
            ...config,
            colorScheme: val,
        }));
    }

    get colorScheme(): string {
        return this.layoutService.config().colorScheme;
    }




    // Ouvrir le p-dialog
    showDialog(): void {
        this.displayDialog = true;
    }

    // Fermer le p-dialog
    closeDialog(): void {
        this.displayDialog = false;
        this.resetDialog();
    }

    // Valider l'email
    validateEmail(): void {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex pour email valide
        this.isEmailValid = emailPattern.test(this.newAdminEmail.trim());
        this.emailError = !this.isEmailValid && this.newAdminEmail.trim() !== '';
    }



    // Réinitialiser les champs
    resetDialog(): void {
        this.newAdminEmail = '';
        this.isEmailValid = false;
        this.emailError = false;
    }


    addModerator(): void {
        if (this.isEmailValid) {
            this.userService.addModerator(this.newAdminEmail).subscribe({
                next: (response: string) => {
                    console.warn(response); // Vérifier la réponse

                    // Extraire l'email et le mot de passe avec une expression régulière
                    const regex = /Mod account : ([^|]+) \| (.+)/;
                    const matches = response.match(regex);
                    let email = '';
                    let password = '';

                    if (matches && matches.length === 3) {
                        email = matches[1].trim();     // Récupère l'email
                        password = matches[2].trim();  // Récupère le mot de passe
                    }

                    // Ajouter le message avec le détail des informations
                    // Dans votre component.ts
                    const message = [
                        'Modérateur ajouté avec succès avec les informations suivantes :',
                        `Email : ${email}`,
                        `Mot de passe : ${password}`
                    ].join('\n');

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: message,
                        sticky: true,
                        closable: true
                    });


                    this.displayDialog=false
                },
                error: (err) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Échec lors de l\'ajout du modérateur.',
                        sticky: true,
                        closable: true,
                    });
                    console.error(err);
                },
            });
        } else {
            this.messageService.add({
                severity: 'warn',
                summary: 'Attention',
                detail: 'Veuillez saisir un email valide.',
                sticky: false,  // Message disparaît automatiquement
            });
        }
    }

}
