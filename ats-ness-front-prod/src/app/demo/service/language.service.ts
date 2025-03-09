import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  constructor( private http: HttpClient ) { }

  getLanguage() {
    return this.http.get<any>('assets/demo/data/language.json')
        .toPromise()
        .then(res => res.data as any[])
        .then(data => data);
}
}
