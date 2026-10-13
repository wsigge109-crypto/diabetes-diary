// Контексты измерения (используются в форме записи и в журнале)
export const CONTEXTS = [
  { id: 'fasting', label: 'Натощак' },
  { id: 'before_meal', label: 'До еды' },
  { id: 'after_meal', label: 'После еды' },
  { id: 'bedtime', label: 'Перед сном' },
];

// Целевые диапазоны по умолчанию (ммоль/л), как в макете.
// Для «До еды» диапазон не задан — запись просто не оценивается.
export const DEFAULT_RANGES = {
  fasting: { hint: 'Утренние измерения', min: 4.0, max: 7.0 },
  after_meal: { hint: 'Через 2 часа', min: null, max: 9.0 },
  bedtime: { hint: 'Вечерний контроль', min: 5.0, max: 8.0 },
};

export function contextLabel(id) {
  return CONTEXTS.find((c) => c.id === id)?.label ?? id;
}

// true — в диапазоне, false — вне диапазона, null — диапазон не задан
export function checkRange(value, range) {
  if (!range) return null;
  const okMin = range.min == null || value >= range.min;
  const okMax = range.max == null || value <= range.max;
  return okMin && okMax;
}

export function formatRange(range) {
  if (!range) return '—';
  if (range.min == null && range.max != null) return `до ${range.max.toFixed(1)}`;
  if (range.max == null && range.min != null) return `от ${range.min.toFixed(1)}`;
  return `${range.min.toFixed(1)} – ${range.max.toFixed(1)}`;
}
