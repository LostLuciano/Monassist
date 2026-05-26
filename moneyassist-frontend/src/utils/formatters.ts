// src/utils/formatters.ts
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return '-';
  try {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return '-';
    }
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(parsedDate);
  } catch (e) {
    return '-';
  }
};

export const formatDateTime = (date: string | Date | null | undefined): string => {
  if (!date) return '-';
  try {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return '-';
    }
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(parsedDate);
  } catch (e) {
    return '-';
  }
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
