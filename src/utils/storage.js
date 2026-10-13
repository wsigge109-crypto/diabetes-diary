import { DEFAULT_RANGES } from './ranges.js';

const ENTRIES_KEY = 'diary_entries';
const RANGES_KEY = 'diary_ranges';

function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function getEntries() {
  try {
    const data = JSON.parse(localStorage.getItem(ENTRIES_KEY));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function addEntry({ glucose, context }) {
  const entry = {
    id: makeId(),
    datetime: new Date().toISOString(),
    glucose,
    context,
  };
  const all = [entry, ...getEntries()];
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(all));
  return entry;
}

export function getRanges() {
  try {
    const data = JSON.parse(localStorage.getItem(RANGES_KEY));
    return data && typeof data === 'object' ? data : DEFAULT_RANGES;
  } catch {
    return DEFAULT_RANGES;
  }
}

export function saveRanges(ranges) {
  localStorage.setItem(RANGES_KEY, JSON.stringify(ranges));
}
