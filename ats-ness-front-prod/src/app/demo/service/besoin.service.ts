import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class BesoinService {
    private apiUrl = 'http://localhost:8085/besoins';


    constructor(private http: HttpClient) { }


    getBesoinById(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/getBesoin/${id}`);
    }

    getAllBesoins(): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}/getAll`);
    }

    createBesoin(besoinData: any): Observable<any> {
      return this.http.post<any>(`${this.apiUrl}/createBesoin`, besoinData);
  }

}
