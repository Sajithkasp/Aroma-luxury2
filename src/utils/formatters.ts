import { Currency } from '../types/store';

export function formatPrice(amount: number | undefined | null, currency: Currency = '$'): string {
  const safeAmount = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
  const safeCurrency = currency || '$';
  const formatted = safeAmount.toLocaleString('en-US', {
    minimumFractionDigits: safeAmount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });

  if (safeCurrency === 'Rs.' || safeCurrency === 'LKR') {
    return `${safeCurrency} ${formatted}`;
  }
  if (safeCurrency === '€') {
    return `${formatted} €`;
  }
  return `${safeCurrency}${formatted}`;
}

export function calculateDiscount(originalPrice?: number, currentPrice?: number): number {
  if (!originalPrice || !currentPrice || originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}
