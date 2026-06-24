export interface WBDataPoint {
  date: string;
  value: number | null;
  country: { id: string; value: string };
  countryiso3code: string;
}

export interface ExchangeRateResponse {
  result: string;
  base_code: string;
  rates: Record<string, number>;
  time_last_update_utc: string;
}
