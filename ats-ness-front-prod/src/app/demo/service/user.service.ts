import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {MessageService} from "primeng/api";
import { environment } from 'src/environments/environment.prod';
import {catchError} from "rxjs/operators";

interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    firstName: string;
    lastName: string;
    usrMail: string;
    picture_url: string;
    role: any;
}
@Injectable({
    providedIn: 'root'
})
export class UserService {

    private authTokenKey = 'auth_token';
    private refreshTokenKey = 'refresh_token'
    private firstNameKey = 'firstName'
    private lastNameKey = 'lastName'
    private usrMailKey = 'usrMail'
    private pictureurlKey = 'picture_url'
    private roleKey = 'role'

    authToken$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

    //private PATH_OF_API = environment.apiUrl;
     PATH_OF_API = "http://localhost:8085";

    constructor(private http: HttpClient, private router: Router,private messageService: MessageService) {
        const authToken = localStorage.getItem(this.authTokenKey);
        this.authToken$.next(authToken);
    }
    mailVerif(token: string) {
        const url = `${this.PATH_OF_API}/auth/confirm?token=${token}`;
        return this.http.post(url, null, {responseType: 'text'});
    }


    login(loginData: any): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(this.PATH_OF_API + "/auth/authenticate", loginData);
    }

    refreshToken(): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'skip': 'request skipped'
            })
        };
        const refreshToken = localStorage.getItem(this.refreshTokenKey);
        return this.http.post<any>(this.PATH_OF_API + "/auth/refreshToken", {refreshToken}, httpOptions);
    }

    public storeTokens(token: string, refreshToken: string, firstName: string, lastName: string, usrMail: string,role:string, picture_url: string): void {
        localStorage.setItem(this.authTokenKey, token);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
        localStorage.setItem(this.firstNameKey, firstName);
        localStorage.setItem(this.lastNameKey, lastName);
        localStorage.setItem(this.usrMailKey, usrMail);
        localStorage.setItem(this.pictureurlKey, picture_url);
        localStorage.setItem(this.roleKey, role);

        this.authToken$.next(token);
    }
    public storeImageUrl(picture_url: string){
        localStorage.setItem(this.pictureurlKey, picture_url);
    }

    public showErrorAlert(error: HttpErrorResponse): void {
        let errorMessage = 'Une erreur s\'est produite. Veuillez réessayer plus tard.';
        let severity = 'error'; // Default severity

        // Déterminer le message d'erreur et la gravité
        if (error.error && error.error.message) {
            errorMessage = error.error.message; // Utiliser le message d'erreur du backend
            severity = 'error'; // Ajuster la gravité
        }

        // Afficher la notification avec SweetAlert2
        this.messageService.add({
            severity: severity,
            summary: severity === 'error' ? 'Erreur' : 'Avertissement',
            detail: errorMessage,
            life: 3000 // Durée d'affichage en millisecondes
        });
    }


    public register(registerData: any) {
        return this.http.post(this.PATH_OF_API + "/auth/register", registerData, {responseType: 'text'});
    }

    requestPasswordReset(email: string): Observable<{ message: string }> {
        const url = `${this.PATH_OF_API}/auth/resetPassword`;
        return this.http.post<{ message: string }>(url, null, {params: {email}});
    }


    confirmReset(mailToken: string, pass: string): Observable<{ message: string }> {
        const url = `${this.PATH_OF_API}/auth/confirmPassword`;
        return this.http.post<{ message: string }>(url, null, {params: {mailToken, pass}});
    }

// Fonction pour mettre à jour les informations de l'utilisateur après sa première connexion
    updateUserFirstAttempt(
        nom: string,
        prenom: string,
        emailSecondaire: string,
        password: string,
        imageProfil: File | null
    ): Observable<any> {
        const formData = new FormData();

        formData.append('nom', nom);
        formData.append('prenom', prenom);
        formData.append('emailSecondaire', emailSecondaire);
        formData.append('password1', password);

        if (imageProfil) {
            formData.append('imageProfil', imageProfil, imageProfil.name);
            console.log('Image ajoutée au FormData:', imageProfil.name);  // Vérifiez ici
        }

        const url = `${this.PATH_OF_API}/auth/first-attempt`;

        return this.http.put<any>(url, formData, {
            headers: {
                'Accept': 'application/json',  // Ne pas ajouter Content-Type avec FormData
            }
        });
    }

    addModerator(email: string): Observable<string> {
        const url = `${this.PATH_OF_API}/auth/addMod`;
        const params = { email }; // Ajout du paramètre email
        return this.http.get<string>(url, { params, responseType: 'text' as 'json' });
    }


    logout(): Observable<any> {
        const url = `${this.PATH_OF_API}/auth/logout`;
        localStorage.clear();
        this.router.navigate([""]);
        return this.http.post(url, null);
    }



}
