import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { timeout, catchError, of } from 'rxjs';
import { Chart } from 'chart.js/auto';
import { WorldBankService } from '../../services/world-bank.service';
import { WBDataPoint } from '../../models/economic.models';

const COUNTRIES = [
  { code: 'COL', name: 'Colombia',      color: '#FCD116' },
  { code: 'USA', name: 'EE.UU.',        color: '#4285f4' },
  { code: 'BRA', name: 'Brasil',        color: '#34a853' },
  { code: 'MEX', name: 'México',        color: '#f59e0b' },
  { code: 'ARG', name: 'Argentina',     color: '#a78bfa' },
  { code: 'CHL', name: 'Chile',         color: '#f87171' },
];

@Component({
  selector: 'app-gdp-chart',
  imports: [],
  templateUrl: './gdp-chart.html',
  styleUrl: './gdp-chart.scss'
})
export class GdpChart implements AfterViewInit, OnDestroy {
  @ViewChild('gdpCanvas') gdpCanvas!: ElementRef<HTMLCanvasElement>;
  private chart?: Chart;
  loading = true;
  error = false;

  constructor(private wb: WorldBankService) {}

  ngAfterViewInit() {
    this.wb.getHistory(COUNTRIES.map(c => c.code), 'NY.GDP.MKTP.KD.ZG', 20).pipe(
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
    const years = [...new Set(data.map(d => d.date))].sort();

    const datasets = COUNTRIES.map(country => {
      const pts = data.filter(d => d.countryiso3code === country.code);
      return {
        label: country.name,
        data: years.map(y => pts.find(p => p.date === y)?.value ?? null),
        borderColor: country.color,
        backgroundColor: country.color + '18',
        tension: 0.4,
        fill: false,
        pointRadius: 2,
        pointHoverRadius: 5,
        borderWidth: 2,
      };
    });

    this.chart = new Chart(this.gdpCanvas.nativeElement, {
      type: 'line',
      data: { labels: years, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            labels: { color: '#94a3b8', usePointStyle: true, pointStyleWidth: 10, font: { size: 11 } }
          },
          tooltip: {
            backgroundColor: '#0f172a',
            titleColor: '#f1f5f9',
            bodyColor: '#94a3b8',
            borderColor: '#334155',
            borderWidth: 1,
            callbacks: { label: ctx => ` ${ctx.dataset.label}: ${(ctx.parsed.y as number)?.toFixed(2)}%` }
          }
        },
        scales: {
          x: {
            ticks: { color: '#64748b', maxTicksLimit: 10, font: { size: 11 } },
            grid: { color: 'rgba(255,255,255,0.04)' }
          },
          y: {
            ticks: { color: '#64748b', callback: v => `${v}%`, font: { size: 11 } },
            grid: { color: 'rgba(255,255,255,0.04)' }
          }
        }
      }
    });
  }
}
