import { Component, OnInit } from '@angular/core';
import { timeout, catchError, of } from 'rxjs';
import { WorldBankService } from './services/world-bank.service';
import { ExchangeRateService } from './services/exchange-rate.service';
import { KpiCard } from './components/kpi-card/kpi-card';
import { GdpChart } from './components/gdp-chart/gdp-chart';
import { InflationChart } from './components/inflation-chart/inflation-chart';
import { ExchangeRates } from './components/exchange-rates/exchange-rates';

interface Kpi {
  label: string;
  value: number | null;
  unit: string;
  icon: string;
  subtitle: string;
  accent: string;
  loading: boolean;
  decimals: number;
}

const TIMEOUT_MS = 12000;

@Component({
  selector: 'app-root',
  imports: [KpiCard, GdpChart, InflationChart, ExchangeRates],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  readonly currentYear = new Date().getFullYear();

  kpis: Kpi[] = [
    { label: 'Crecimiento PIB — Colombia', value: null, unit: '%',   icon: 'bi-graph-up-arrow',    subtitle: '', accent: '#3b82f6', loading: true, decimals: 2 },
    { label: 'Inflación — Colombia',        value: null, unit: '%',   icon: 'bi-arrow-up-right',    subtitle: '', accent: '#f59e0b', loading: true, decimals: 2 },
    { label: 'Desempleo — Colombia',        value: null, unit: '%',   icon: 'bi-people-fill',       subtitle: '', accent: '#a78bfa', loading: true, decimals: 1 },
    { label: 'Tasa USD / COP',             value: null, unit: 'COP', icon: 'bi-currency-exchange', subtitle: 'Tiempo real', accent: '#10b981', loading: true, decimals: 0 },
  ];

  constructor(private wb: WorldBankService, private er: ExchangeRateService) {}

  ngOnInit() {
    const indicators: [string, string][] = [
      ['NY.GDP.MKTP.KD.ZG', 'PIB'],
      ['FP.CPI.TOTL.ZG',    'Inflación'],
      ['SL.UEM.TOTL.ZS',    'Desempleo'],
    ];

    indicators.forEach(([indicator], i) => {
      this.wb.getLatest('COL', indicator).pipe(
        timeout(TIMEOUT_MS),
        catchError(() => of({ value: null, year: '' }))
      ).subscribe(r => {
        this.updateKpi(i, { value: r.value, subtitle: r.year ? `Año ${r.year}` : '', loading: false });
      });
    });

    this.er.getRates().pipe(
      timeout(TIMEOUT_MS),
      catchError(() => of(null))
    ).subscribe(data => {
      this.updateKpi(3, { value: data?.rates['COP'] ?? null, loading: false });
    });
  }

  private updateKpi(index: number, updates: Partial<Kpi>) {
    const updated = [...this.kpis];
    updated[index] = { ...updated[index], ...updates };
    this.kpis = updated;
  }
}
