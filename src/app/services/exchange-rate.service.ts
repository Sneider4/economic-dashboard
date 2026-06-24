import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExchangeRateResponse } from '../models/economic.models';

@Injectable({ providedIn: 'root' })
export class ExchangeRateService {
  private readonly url = 'https://open.er-api.com/v6/latest/USD';

  constructor(private http: HttpClient) {}

  getRates(): Observable<ExchangeRateResponse> {
    return this.http.get<ExchangeRateResponse>(this.url);
  }
}
