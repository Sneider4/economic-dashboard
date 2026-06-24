import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { WBDataPoint } from '../models/economic.models';

@Injectable({ providedIn: 'root' })
export class WorldBankService {
  private readonly base = 'https://api.worldbank.org/v2';

  constructor(private http: HttpClient) {}

  getLatest(country: string, indicator: string): Observable<{ value: number | null; year: string }> {
    const url = `${this.base}/country/${country}/indicator/${indicator}?format=json&mrv=3&per_page=3`;
    return this.http.get<any[]>(url).pipe(
      map(res => {
        const data: any[] = (res[1] || []).filter((d: any) => d.value !== null);
        if (data.length === 0) return { value: null, year: '' };
        return { value: data[0].value as number, year: data[0].date as string };
      })
    );
  }

  getHistory(countries: string[], indicator: string, years = 20): Observable<WBDataPoint[]> {
    const countryStr = countries.join(';');
    const perPage = countries.length * years + 20;
    const url = `${this.base}/country/${countryStr}/indicator/${indicator}?format=json&mrv=${years}&per_page=${perPage}`;
    return this.http.get<any[]>(url).pipe(
      map(res => (res[1] || []).filter((d: any) => d.value !== null) as WBDataPoint[])
    );
  }
}
