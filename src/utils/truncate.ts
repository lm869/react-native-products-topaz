export function truncate(text: string, max: number): string {
  if (!text) return '';
  if (max <= 0) return '';
  if (text.length <= max) return text;
  if (max <= 1) return '…';
  return text.slice(0, max - 1).trimEnd() + '…';
}
