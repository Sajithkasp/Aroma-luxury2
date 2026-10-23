import { Currency } from '../types/store';

export function formatPrice(amount: number, currency: Currency = '$'): string {
  const formatted = amount.toLocaleString('en-US', {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });

  if (currency === 'Rs.' || currency === 'LKR') {
    return `${currency} ${formatted}`;
  }
  if (currency === '€') {
    return `${formatted} €`;
  }
  return `${currency}${formatted}`;
}

export function calculateDiscount(originalPrice?: number, currentPrice?: number): number {
  if (!originalPrice || !currentPrice || originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}
