// lib/web-vitals.ts - Monitor Core Web Vitals for SEO

import { Metric } from 'web-vitals';

export function reportWebVitals(metric: Metric) {
  // Send metrics to your analytics service
  // Metrics tracked: LCP, FID, CLS, TTFB, FCP
  
  console.log(`${metric.name}: ${metric.value}ms`);
  
  // Send to analytics (e.g., Google Analytics, Datadog, etc.)
  if (process.env.NEXT_PUBLIC_ANALYTICS_ID) {
    // Example: Send to your backend
    fetch('/api/analytics', {
      method: 'POST',
      body: JSON.stringify(metric),
      headers: { 'Content-Type': 'application/json' },
    }).catch(err => console.error('Analytics error:', err));
  }
}

// Thresholds for good Core Web Vitals (Google's standards)
export const WEB_VITALS_THRESHOLDS = {
  LCP: 2500,    // Largest Contentful Paint - should be < 2.5s
  FID: 100,     // First Input Delay - should be < 100ms
  CLS: 0.1,     // Cumulative Layout Shift - should be < 0.1
  TTFB: 600,    // Time to First Byte - should be < 600ms
  FCP: 1800,    // First Contentful Paint - should be < 1.8s
};
