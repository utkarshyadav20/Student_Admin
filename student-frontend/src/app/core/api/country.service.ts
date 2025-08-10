import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Country {
  id?: number;
  name: string;
  phoneCode?: string;
  emojiU?: string;
  native?: string;
}

export interface CountryArray {
  countries: Country[];
}

@Injectable({
  providedIn: 'root'
})

export class CountryService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiBaseUrl;

  getCountries(): Observable<CountryArray> {
    return this.http.get<CountryArray>(`${this.apiUrl}/country`);
  }
}
