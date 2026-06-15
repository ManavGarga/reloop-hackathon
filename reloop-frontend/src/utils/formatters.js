/**
 * ReLoop Global Formatter Utilities
 * Centralized currency and date formatting — apply everywhere.
 */

/**
 * Format a number as Indian Rupee currency.
 * Output: ₹18,999 or ₹1,25,000
 * Never shows decimals. Never shows raw numbers without ₹.
 */
export function formatCurrency(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(amount));
}

/**
 * Format a date string or Date object as human-readable.
 * Output: "March 15, 2024" or "June 7, 2025"
 * Never shows: 2024-03-15 / 15/03/2024 / 03-15-2024
 */
export function formatDate(dateInput) {
  if (!dateInput) return '';
  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime())) return String(dateInput);
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch {
    return String(dateInput);
  }
}

/**
 * Format a date as short month + year.
 * Output: "Mar 2024"
 */
export function formatDateShort(dateInput) {
  if (!dateInput) return '';
  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime())) return String(dateInput);
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
    }).format(date);
  } catch {
    return String(dateInput);
  }
}
