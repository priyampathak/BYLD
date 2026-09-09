export function formatDate(
  dateInput: string | Date | number,
  options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }
): string {
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-US', options);
  } catch {
    return '';
  }
}

export function formatShortDate(dateInput: string | Date | number): string {
  return formatDate(dateInput, { month: 'short', day: 'numeric' });
}

export function formatDateTime(dateInput: string | Date | number): string {
  return formatDate(dateInput, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
