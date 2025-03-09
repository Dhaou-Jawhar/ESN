import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {MessageService} from "primeng/api";
import { environment } from 'src/environments/environment.prod';
import {Technology} from "../models/Technology";
import {map} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class CandidatService {

    private apiUrl = environment.UrlCandidat;
    private apiUrl2 = environment.UrlRating;
    private apiUrl5 = 'http://localhost:8085/technology';

    // private apiUrl = 'http://localhost:8085/candidats';
    private apiUrl4 = environment.UrlLanguage;
    constructor(private http: HttpClient,private messageService: MessageService) { }


parseCV(formData: FormData): Observable<any> {
    const apiUrl3 = 'https://ness-ats-api-parser-dev.azurewebsites.net/v2/parse-cv';

    // Set headers if needed (if the API requires authentication, add headers here)
    const headers = new HttpHeaders({
        'Accept': 'application/json'
    });

    return this.http.post<any>(apiUrl3, formData, { headers });
}


    createCandidat(formData: FormData): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/create`, formData);
    }

    public showError(error: HttpErrorResponse): void {
        let errorMessage = 'Une erreur s\'est produite. Veuillez réessayer plus tard.';
        let severity = 'warn'; // Default severity

        // Déterminer le message d'erreur et la gravité
        if (error.error && error.error.message) {
            errorMessage = error.error.message; // Utiliser le message d'erreur du backend
            severity = 'warn'; // Ajuster la gravité
        }

        // Afficher la notification avec SweetAlert2
        this.messageService.add({
            severity: severity,
            summary: severity === 'error' ? 'Erreur' : 'Avertissement',
            detail: errorMessage,
            life: 3000 // Durée d'affichage en millisecondes
        });
    }

    getAllCandidats(page: number, size: number): Observable<any> {
        const url = `${this.apiUrl}/getAll?page=${page}&size=${size}`;
        return this.http.get<any>(url);
    }


    // Method to update the state (etat) of a candidate
    updateEtat(id: number, etat: string): Observable<any> {
        const url = `${this.apiUrl}/updateEtat/${id}/${etat}`;
        return this.http.put<any>(url, {});  // Empty body since it's a PUT request
    }


    getCandidatById(id: number): Observable<any> {
        const url = `${this.apiUrl}/getCandidat/${id}`;
        return this.http.get(url);
    }

    getCandidatActions(id: number): Observable<any> {
        const url = `${this.apiUrl}/getCandidatActions/${id}`;
        return this.http.get(url);
    }

    addRating(rateValue:number,id:number){

        const url = `${this.apiUrl2}/add/${rateValue}/${id}`;

        return this.http.post<any>(url, {});
    }
    addRatingLangue(rateValue:number,id:number){

        const url = `${this.apiUrl4}/add/${rateValue}/${id}`;

        return this.http.post<any>(url, {});
    }

    getAverageRatingByCandidat(id: number): Observable<number> {
        const url = `${this.apiUrl2}/getRatingByCandidat/${id}`;
        return this.http.get<number>(url);
    }
    getAverageRatingByLanguage(id: number): Observable<number> {
        const url = `${this.apiUrl4}/getRatingByLangueId/${id}`;
        return this.http.get<number>(url);
    }

    // Méthode pour ajouter et évaluer une technologie
    addAndRateTechnology(id: number, value: number, technology: Technology): Observable<any> {
        const url = `${this.apiUrl5}/addAnRateTechno/${id}/${value}`;
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.http.post(url, technology, { headers }).pipe(
            map(response => response as any)
        );
    }

    // Méthode pour récupérer le rating d'une technologie

    getAverageRatingForTechno(id: number): Observable<number> {
        const url = `${this.apiUrl5}/getRatingByTechnoId/${id}`;
        return this.http.get<number>(url);
    }


    // Méthode pour mettre à jour les années d'expérience d'une technologie
    updateTechnologyExperience(id: number, experience: number): Observable<Technology> {
        const url = `${this.apiUrl5}/updateTechnologyExperience/${id}/${experience}`;
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.http.post<Technology>(url, null, { headers });
    }

    // Méthode pour supprimer une technologie évaluée

    removeTechnology(id: number): Observable<string> {
        const url = `${this.apiUrl5}/${id}`;
        return this.http.delete(url, { responseType: 'text' });
    }


    updateCandidat(formData: FormData,id: number): Observable<any> {

        return this.http.put<any>(`${this.apiUrl}/updateCandidat/${id}`, formData);
    }

}
