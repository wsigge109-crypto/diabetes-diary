import { useState } from 'react';
import { getRanges, saveRanges } from '../utils/storage.js';
import { CONTEXTS, DEFAULT_RANGES, formatRange } from '../utils/ranges.js';

const RANGE_CONTEXTS = CONTEXTS.filter((c) => DEFAULT_RANGES[c.id]);

function toDraft(ranges) {
  const draft = {};
  RANGE_CONTEXTS.forEach((c) => {
    const r = ranges[c.id] ?? DEFAULT_RANGES[c.id];
    draft[c.id] = {
      min: r.min == null ? '' : String(r.min),
      max: r.max == null ? '' : String(r.max),
    };
  });
  return draft;
}

function parseValue(str) {
  const s = str.trim().replace(',', '.');
  if (s === '') return null;
  const n = parseFloat(s);
  return Number.isNaN(n) ? NaN : n;
}

export default function Ranges() {
  const [ranges, setRanges] = useState(getRanges);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(() => toDraft(getRanges()));
  const [error, setError] = useState('');

  function startEdit() {
    setDraft(toDraft(ranges));
    setError('');
    setEditing(true);
  }

  function handleSave() {
    const next = {};
    for (const c of RANGE_CONTEXTS) {
      const min = parseValue(draft[c.id].min);
      const max = parseValue(draft[c.id].max);
      if (Number.isNaN(min) || Number.isNaN(max)) {
        setError(`«${c.label}»: введите числа`);
        return;
      }
      if (min == null && max == null) {
        setError(`«${c.label}»: укажите хотя бы одну границу`);
        return;
      }
      if (min != null && max != null && min >= max) {
        setError(`«${c.label}»: нижняя граница должна быть меньше верхней`);
        return;
      }
      next[c.id] = { hint: DEFAULT_RANGES[c.id].hint, min, max };
    }
    saveRanges(next);
    setRanges(next);
    setEditing(false);
    setError('');
  }

  function setField(id, field, value) {
    setDraft((d) => ({ ...d, [id]: { ...d[id], [field]: value } }));
  }

  return (
    <div className="ranges">
      <div className="ranges__head">
        <p className="muted">Значения в ммоль/л</p>
        {editing ? (
          <div className="ranges__actions">
            <button type="button" className="btn" onClick={() => setEditing(false)}>Отмена</button>
            <button type="button" className="btn btn--primary" onClick={handleSave}>Сохранить</button>
          </div>
        ) : (
          <button type="button" className="btn" onClick={startEdit}>Изменить</button>
        )}
      </div>

      {error && <p className="error" role="alert">{error}</p>}

      <ul className="ranges__list">
        {RANGE_CONTEXTS.map((c) => {
          const r = ranges[c.id] ?? DEFAULT_RANGES[c.id];
          return (
            <li key={c.id} className="panel ranges__item">
              <div>
                <strong>{c.label}</strong>
                <div className="muted small">{DEFAULT_RANGES[c.id].hint}</div>
              </div>
              {editing ? (
                <div className="ranges__inputs">
                  <input
                    aria-label={`${c.label}: от`}
                    placeholder="от"
                    inputMode="decimal"
                    value={draft[c.id].min}
                    onChange={(e) => setField(c.id, 'min', e.target.value)}
                  />
                  <span>–</span>
                  <input
                    aria-label={`${c.label}: до`}
                    placeholder="до"
                    inputMode="decimal"
                    value={draft[c.id].max}
                    onChange={(e) => setField(c.id, 'max', e.target.value)}
                  />
                </div>
              ) : (
                <strong>{formatRange(r)}</strong>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
