import { Metric } from 'web-vitals';

export function reportWebVitals(metric: Metric) {
  console.log(`${metric.name}: ${metric.value}ms`);
}

export const WEB_VITALS_THRESHOLDS = {
  LCP: 2500,
  FID: 100,
  CLS: 0.1,
  TTFB: 600,
  FCP: 1800,
};
