import {Component, OnInit} from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import {MessageService} from "primeng/api";
import {Router} from "@angular/router";
import {UserService} from "../../../service/user.service";
import {NgForm, ValidationErrors} from "@angular/forms";


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `],
    styleUrls: ['./login.component.scss'],

})
export class LoginComponent implements OnInit {

    uploadedPhoto: File | null = null;

    password!: string;
    email!: string;

    display: boolean = false;
    created = true;
    not_created = true;
    message!: string;
    user !: any;
    mail: string = '';
    mailToken: string = '';
    pass: string = '';
    showPassword: boolean = false;
    isUserSpace: boolean = true;
    showError: boolean = false;
    displayModal: boolean = false;
    successModalVisible: boolean = false;
    confirmPass: string = '';
    showFirstAttemptDialog = false;
    passwordMismatch = false;
    formSubmitted = false;
    constructor(private userService: UserService, private router: Router, private messageService: MessageService, public layoutService: LayoutService) {
    }

    ngOnInit(): void {
        localStorage.clear();

    }

    login(loginForm: NgForm): void {
            if (loginForm.valid) {
            this.userService.login(loginForm.value).subscribe({
                next: (response: any) => {
                    console.warn(response);
                    const {accessToken, refreshToken, firstName, lastName, usrMail, role, picture_url} = response;
                    this.userService.storeTokens(accessToken, refreshToken, firstName, lastName, usrMail,role, picture_url);
                    if (response.firstAttempt==true) {
                        console.log("Première connexion détectée !");

                        this.showFirstAttemptDialog = true;
                    }
                    else if (role === 'ADMIN' || role === 'MODERATOR'|| role === 'CANDIDAT') {
                        this.router.navigate(['dashboard']);
                    } else {
                        this.showError = true;

                        // Réinitialiser l'erreur après un certain temps
                        setTimeout(() => {
                            this.showError = false;
                        }, 2000);


                    }
                },
                error: (err: any) => {
                    this.userService.showErrorAlert(err);
                    this.showError = true;

                    // Réinitialiser l'erreur après un certain temps
                    setTimeout(() => {
                        this.showError = false;
                    }, 2000);
                }
            });
        }
    }

    onSubmit() {
        // Logique pour la réinitialisation du mot de passe ici
        this.displayModal = false; // Fermer la fenêtre après la soumission
    }

    onCancel() {
        this.displayModal = false; // Fermer la fenêtre sans soumettre
    }


    resetPassword() {
        this.userService.requestPasswordReset(this.mail).subscribe(
            response => {
                const message = response.message; // Extraire le message de la réponse

                if (message === "Vérification requise, un e-mail de vérification a été envoyé!") {
                    // Afficher le message de succès avec Toaster
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès!',
                        detail: message
                    });

                    // Ouvrir le dialogue de succès après un court délai
                    setTimeout(() => {
                        this.displayModal = false; // Fermer le dialogue de réinitialisation du mot de passe
                        this.successModalVisible = true; // Afficher le dialogue de succès
                    }, 2000); // Délai pour s'assurer que le toaster s'affiche avant le dialogue
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur!',
                        detail: message
                    });
                }
            },
            error => {
                console.error("Erreur lors de la demande de réinitialisation du mot de passe:", error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur!',
                    detail: 'Une erreur s\'est produite. Veuillez réessayer plus tard.'
                });
            }
        );
    }

    togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
    }

    submitSecondModalForm() {
        if (this.pass !== this.confirmPass) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur!',
                detail: 'Les mots de passe ne correspondent pas.'
            });
            return;
        }

        this.userService.confirmReset(this.mailToken, this.pass).subscribe(
            response => {
                const message = response.message;

                if (message === 'Veuillez vérifier le code envoyé par mail!') {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur!',
                        detail: message
                    });
                } else if (message === 'Mot de passe modifié avec succès!') {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès!',
                        detail: message
                    });

                    setTimeout(() => {
                        this.successModalVisible = false;
                    }, 2000);
                }
            },
            error => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur!',
                    detail: 'Une erreur s\'est produite. Veuillez réessayer plus tard.'
                });
            }
        );
    }


    onSubmitUpdate(form: NgForm): void {
        this.formSubmitted = true;

        const { password1, password2 } = form.value;
        this.passwordMismatch = password1 !== password2;

        if (form.valid && !this.passwordMismatch && this.uploadedPhoto) {
            const { nom, prenom, emailSecondaire, password1 } = form.value;

            this.userService.updateUserFirstAttempt(nom, prenom, emailSecondaire, password1, this.uploadedPhoto).subscribe({
                next: (response) => {
                    console.log('Utilisateur mis à jour avec succès!', response);

                    const { role } = response;
                    this.userService.storeImageUrl(response.pictureUrl);
                    if (role === 'ADMIN' || role === 'MODERATOR' || role === 'CANDIDAT') {
                        this.router.navigate(['dashboard']);
                    } else {
                        console.log('Accès refusé pour ce rôle');
                    }
                },
                error: (error) => {
                    console.error('Erreur de mise à jour de l\'utilisateur', error);
                }
            });
        }
    }

    onFileSelect(event: any): void {
        if (event.files && event.files.length > 0) {
            this.uploadedPhoto = event.files[0];
            console.warn('Fichier sélectionné:', this.uploadedPhoto);  // Vérifiez ici que l'image est bien sélectionnée
            this.messageService.add({
                severity: 'info',
                summary: 'Image de profil sélectionnée',
                detail: 'L\'image a été sélectionnée avec succès.'
            });
        }else {
            this.uploadedPhoto = null; // Réinitialise si aucune image n'est sélectionnée
        }
    }

    validatePasswords(): void {
        const password1 = (document.getElementById('password1') as HTMLInputElement)?.value;
        const password2 = (document.getElementById('password2') as HTMLInputElement)?.value;
        this.passwordMismatch = password1 !== password2;
    }




}
