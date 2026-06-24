import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { timeout, catchError, of } from 'rxjs';
import { Chart } from 'chart.js/auto';
import { WorldBankService } from '../../services/world-bank.service';
import { WBDataPoint } from '../../models/economic.models';

const COUNTRIES = [
  { code: 'COL', name: 'Colombia',  flag: '🇨🇴' },
  { code: 'ARG', name: 'Argentina', flag: '🇦🇷' },
  { code: 'BRA', name: 'Brasil',    flag: '🇧🇷' },
  { code: 'MEX', name: 'México',    flag: '🇲🇽' },
  { code: 'CHL', name: 'Chile',     flag: '🇨🇱' },
  { code: 'USA', name: 'EE.UU.',   flag: '🇺🇸' },
  { code: 'DEU', name: 'Alemania',  flag: '🇩🇪' },
  { code: 'CHN', name: 'China',     flag: '🇨🇳' },
];

@Component({
  selector: 'app-inflation-chart',
  imports: [],
  templateUrl: './inflation-chart.html',
  styleUrl: './inflation-chart.scss'
})
export class InflationChart implements AfterViewInit, OnDestroy {
  @ViewChild('inflationCanvas') inflationCanvas!: ElementRef<HTMLCanvasElement>;
  private chart?: Chart;
  loading = true;
  error = false;
  latestYear = '';

  constructor(private wb: WorldBankService) {}

  ngAfterViewInit() {
    this.wb.getHistory(COUNTRIES.map(c => c.code), 'FP.CPI.TOTL.ZG', 3).pipe(
      timeout(15000),
      catchError(() => of([]))
    ).subscribe(data => {
      if (data.length === 0) { this.error = true; } else { this.buildChart(data); }
      this.loading = false;
    });
  }

  ngOnDestroy() {
    this.chart?.destroy();
  }

  private buildChart(data: WBDataPoint[]) {
    const entries = COUNTRIES.map(c => {
      const pts = data
        .filter(d => d.countryiso3code === c.code)
        .sort((a, b) => parseInt(b.date) - parseInt(a.date));
      return { label: `${c.flag} ${c.name}`, value: pts[0]?.value ?? null, year: pts[0]?.date ?? '' };
    }).filter(e => e.value !== null) as { label: string; value: number; year: string }[];

    if (entries.length === 0) { this.error = true; return; }

    entries.sort((a, b) => b.value - a.value);
    this.latestYear = entries[0].year;

    this.chart = new Chart(this.inflationCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: entries.map(e => e.label),
        datasets: [{
          label: 'Inflación (%)',
          data: entries.map(e => e.value),
          backgroundColor: entries.map(e =>
            e.value > 20 ? '#ef4444' : e.value > 8 ? '#f59e0b' : '#10b981'
          ),
          borderRadius: 6,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0f172a',
            titleColor: '#f1f5f9',
            bodyColor: '#94a3b8',
            borderColor: '#334155',
            borderWidth: 1,
            callbacks: { label: ctx => ` ${(ctx.parsed.y as number).toFixed(2)}%` }
          }
        },
        scales: {
          x: { ticks: { color: '#94a3b8', font: { size: 12 } }, grid: { display: false } },
          y: {
            ticks: { color: '#64748b', callback: v => `${v}%`, font: { size: 11 } },
            grid: { color: 'rgba(255,255,255,0.04)' }
          }
        }
      }
    });
  }
}
