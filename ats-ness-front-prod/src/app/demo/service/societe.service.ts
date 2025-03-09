import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, throwError} from 'rxjs';
import { Societe } from '../models/societe';
import {catchError} from "rxjs/operators";

@Injectable({
    providedIn: 'root',
})
export class SocieteService {
  /*- API -*/
    private apiUrl = 'http://localhost:8085/societe';
    private addUrl = 'http://localhost:8085/societe/creer';
    private getByID = 'http://localhost:8085/societe/getSociete';



/* -------------------- */

    constructor(private http: HttpClient) {}

    createSociete(data: FormData): Observable<any> {
        return this.http.post(this.addUrl, data).pipe(
            catchError(this.handleError) // Capture et traite les erreurs
        );
    }
    private handleError(error: HttpErrorResponse) {
        // Vérifiez si l'erreur provient du backend
        if (error.status >= 400 && error.status <= 599) {
            // Erreur de type 409 (Conflit), retour du message d'erreur
            return throwError(error.error);  // Récupère le message d'erreur retourné par le backend
        } else {
            // Pour d'autres erreurs, on retourne un message générique
            return throwError('Une erreur est survenue, veuillez réessayer plus tard.');
        }
    }
    getSocieteByid(id: number): Observable<any> {
        const url = `${this.getByID}/${id}`;
        return this.http.get(url);
    }

    updateSociete(id: number, societeData: Societe, logo?: File, organigrammes?: File[]): Observable<any> {
        const formData = new FormData();

        formData.append('societeData', new Blob([JSON.stringify(societeData)], { type: 'application/json' }));

        if (logo) {
          formData.append('logo', logo);
        }

        if (organigrammes && organigrammes.length > 0) {
          organigrammes.forEach(file => formData.append('organigrammes', file, file.name));
        }

        return this.http.put(`${this.apiUrl}/update/${id}`, formData);
      }


      deleteOrganigram(societeId: number, organigrammeUrl: string): Observable<any> {
        const params = new HttpParams().set('organigrammeUrl', organigrammeUrl);

        return this.http.delete(`${this.apiUrl}/${societeId}/organigrammes`, {
          params,
          responseType: 'text' as 'json', // Expect plain text response
        });
      }

      deleteBesoin(besoinId: number): Observable<any> {
        return this.http.delete(`http://localhost:8085/societe/delete/${besoinId}`, { responseType: 'text' });
      }


      createBesoinAndAssignToSociete(societeId: number, besoin: any): Observable<any> {
        const url = `${this.apiUrl}/createBesoinAndAdsignToSociete/${societeId}`;
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.http.post(url, besoin, { headers });
      }

      updateSocieteBesoin(societeId: number, updatedBesoin: any): Observable<any> {
        const url = `${this.apiUrl}/updateSocieteBesoin/${societeId}`;
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.put<any>(url, updatedBesoin, { headers });
    }

      getAllSocietes(): Observable<Societe[]> {
        return this.http.get<Societe[]>(`${this.apiUrl}/getAllSociete`);
    }


}
