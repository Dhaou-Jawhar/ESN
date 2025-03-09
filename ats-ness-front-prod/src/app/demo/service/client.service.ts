import { Injectable } from '@angular/core';
import {Observable, tap, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ClientService {
    private apiUrl = 'http://localhost:8085/clients';
  constructor(private http: HttpClient) { }

    getClients(page: number, size: number): Observable<any> {
        const url = `${this.apiUrl}/getAllClients?page=${page}&size=${size}`;
        return this.http.get(url);
    }

    createClient(client: any): Observable<any> {
        const url = `${this.apiUrl}/createClient`;
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<any>(url, client, { headers });
    }


    getClientByid(id: number): Observable<any> {
        const url = `${this.apiUrl}/getClient/${id}`;
        return this.http.get(url);
    }

    // Fonction pour mettre à jour un client
    updateClient(clientId: number, updatedClient: any): Observable<any> {
        const url = `${this.apiUrl}/updateClient/${clientId}`;

        // Log the exact data being sent
        console.log('Sending client update:', {
            clientId: clientId,
            clientData: JSON.parse(JSON.stringify(updatedClient)) // Deep clone to avoid reference issues
        });

        return this.http.put<any>(url, updatedClient, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            })
        }).pipe(
            catchError(error => {
                console.error('Detailed error:', error);
                return throwError(() => error);
            })
        );
    }


    updateClientBesoin(clientId: number, updatedBesoin: any): Observable<any> {
        const url = `${this.apiUrl}/updateClientBesoin/${clientId}`;
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.put<any>(url, updatedBesoin, { headers });
    }
    createBesoinAndAssignToClient(clientId: number, besoin: any): Observable<any> {
        const url = `${this.apiUrl}/createBesoinAndAdsignToClient/${clientId}`;
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.http.post(url, besoin, { headers });
    }
}
