export function formatCurrency(value) {
  if (value === undefined || value === null || value === '') return '¥0';
  return `¥${Number(value).toLocaleString('ja-JP')}`;
}

export function remainingDays(start, end) {
  const today = new Date();
  const endDate = new Date(end);
  return Math.max(0, Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)));
}
