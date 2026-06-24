import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-kpi-card',
  imports: [],
  templateUrl: './kpi-card.html',
  styleUrl: './kpi-card.scss'
})
export class KpiCard {
  @Input() label = '';
  @Input() value: number | null = null;
  @Input() unit = '%';
  @Input() icon = 'bi-graph-up';
  @Input() subtitle = '';
  @Input() accent = '#3b82f6';
  @Input() loading = true;
  @Input() decimals = 1;

  get formattedValue(): string {
    if (this.value === null) return '—';
    return this.value.toLocaleString('es-CO', { minimumFractionDigits: this.decimals, maximumFractionDigits: this.decimals });
  }
}
