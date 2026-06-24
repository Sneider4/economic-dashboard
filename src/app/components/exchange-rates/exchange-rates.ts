import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { timeout, catchError, of } from 'rxjs';
import { ExchangeRateService } from '../../services/exchange-rate.service';

interface CurrencyRate {
  code: string;
  name: string;
  flag: string;
  rateCOP: number;
}

const CURRENCIES = [
  { code: 'EUR', name: 'Euro',      flag: '🇪🇺' },
  { code: 'GBP', name: 'Libra',     flag: '🇬🇧' },
  { code: 'JPY', name: 'Yen',       flag: '🇯🇵' },
  { code: 'BRL', name: 'Real',      flag: '🇧🇷' },
  { code: 'MXN', name: 'Peso MX',  flag: '🇲🇽' },
  { code: 'CLP', name: 'Peso CL',  flag: '🇨🇱' },
  { code: 'ARS', name: 'Peso AR',  flag: '🇦🇷' },
  { code: 'CNY', name: 'Yuan',      flag: '🇨🇳' },
];

@Component({
  selector: 'app-exchange-rates',
  imports: [DecimalPipe],
  templateUrl: './exchange-rates.html',
  styleUrl: './exchange-rates.scss'
})
export class ExchangeRates implements OnInit {
  loading = true;
  error = false;
  copRate = 0;
  lastUpdate = '';
  currencies: CurrencyRate[] = [];

  constructor(private er: ExchangeRateService) {}

  ngOnInit() {
    this.er.getRates().pipe(
      timeout(12000),
      catchError(() => of(null))
    ).subscribe(data => {
      if (!data) { this.error = true; this.loading = false; return; }
      const cop = data.rates['COP'] ?? 0;
      this.copRate = cop;
      this.lastUpdate = new Date(data.time_last_update_utc).toLocaleDateString('es-CO', {
        day: '2-digit', month: 'short', year: 'numeric'
      });
      this.currencies = CURRENCIES
        .map(c => ({ ...c, rateCOP: data.rates[c.code] ? cop / data.rates[c.code] : 0 }))
        .filter(c => c.rateCOP > 0);
      this.loading = false;
    });
  }
}
