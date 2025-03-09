import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ActionsService {
    private apiUrl = 'http://localhost:8085/actions';
  constructor(private http: HttpClient) { }

    addActionToClient(clientId: number, action: any): Observable<any> {
        const url = `${this.apiUrl}/addActionToClient/${clientId}`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });

        return this.http.post<any>(url, action, { headers });
    }

    addActionToCandidat(candidatId: number, action: any): Observable<any> {
        const url = `${this.apiUrl}/addActionToCandidat/${candidatId}`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });

        return this.http.post<any>(url, action, { headers });
    }

    getActions(page: number, size: number): Observable<any> {
        const url = `${this.apiUrl}/getAllActions?page=${page}&size=${size}`;
        return this.http.get(url);
    }

    getCandidatsActions(page: number, size: number): Observable<any> {
        const url = `${this.apiUrl}/getAllCandidatsActions?page=${page}&size=${size}`;
        return this.http.get(url);
    }

    getBesoinsActions(page: number, size: number): Observable<any> {
        const url = `${this.apiUrl}/getAllBesoinsActions?page=${page}&size=${size}`;
        return this.http.get(url);
    }

    getActionById(id: number): Observable<any> {
        const url = `${this.apiUrl}/getAction/${id}`;
        return this.http.get(url);
    }

    updateAction(id: number, action: any): Observable<any> {
        const url = `${this.apiUrl}/updateAction/${id}`;

        return this.http.put<any>(url, action)
            .pipe(
                catchError((error) => {
                    console.error('Erreur lors de la mise à jour de l\'action:', error);
                    throw error;
                })
            );
    }
    deleteAction(actionId: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/removeAction/${actionId}`, { responseType: 'text' });
    }
}
