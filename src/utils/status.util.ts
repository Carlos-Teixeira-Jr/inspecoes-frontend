export function statusIcon(status: 'pendente' | 'concluida' | 'atrasada'): string {
  switch (status) {
    case 'pendente':
      return 'pi pi-clock text-yellow-500';
    case 'concluida':
      return 'pi pi-check-circle text-green-500';
    case 'atrasada':
      return 'pi pi-times-circle text-red-500';
    default:
      return '';
  }
}
