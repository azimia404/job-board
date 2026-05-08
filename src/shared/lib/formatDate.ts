export function formatRelativeDate(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 3600) return "Только что";
  if (diff < 86400) return `${Math.floor(diff / 3600)}ч назад`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}д назад`;
  return `${Math.floor(diff / 604800)} нед. назад`;
}