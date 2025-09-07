export function formatDateBR(isoDate: string | null): string {
  if (isoDate === null) {
    return '-';
  }
  
  const date = typeof isoDate === 'string' ? new Date(isoDate) : isoDate;
  
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}
