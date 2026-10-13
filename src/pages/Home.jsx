import { Link } from 'react-router-dom';
import { getEntries, getRanges } from '../utils/storage.js';
import { checkRange, contextLabel } from '../utils/ranges.js';

const DAY = 24 * 60 * 60 * 1000;

function formatWhen(iso) {
  const d = new Date(iso);
  const time = d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  if (d.toDateString() === new Date().toDateString()) return time;
  return `${d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}, ${time}`;
}

function Chart({ entries }) {
  const points = [...entries].reverse(); // от старых к новым
  if (points.length < 2) {
    return <p className="muted chart__empty">Добавьте минимум две записи за неделю, чтобы увидеть график.</p>;
  }
  const W = 600;
  const H = 200;
  const pad = 16;
  const maxY = Math.max(12, ...points.map((p) => p.glucose));
  const minY = 2;
  const x = (i) => pad + (i * (W - pad * 2)) / (points.length - 1);
  const y = (v) => H - pad - ((v - minY) / (maxY - minY)) * (H - pad * 2);
  const line = points.map((p, i) => `${x(i)},${y(p.glucose)}`).join(' ');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart__svg" role="img" aria-label="График глюкозы за 7 дней">
      <polyline points={line} fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinejoin="round" />
      {points.map((p, i) => (
        <circle key={p.id} cx={x(i)} cy={y(p.glucose)} r="3.5" fill="var(--color-primary)" />
      ))}
    </svg>
  );
}

export default function Home() {
  const entries = getEntries();
  const ranges = getRanges();
  const weekEntries = entries.filter((e) => Date.now() - new Date(e.datetime).getTime() <= 7 * DAY);

  const current = entries[0];
  const avg = weekEntries.length
    ? weekEntries.reduce((s, e) => s + e.glucose, 0) / weekEntries.length
    : null;

  const rated = weekEntries
    .map((e) => checkRange(e.glucose, ranges[e.context]))
    .filter((r) => r !== null);
  const inRange = rated.length ? Math.round((rated.filter(Boolean).length / rated.length) * 100) : null;

  if (entries.length === 0) {
    return (
      <div className="empty">
        <p>Записей пока нет. Добавьте первое измерение, и здесь появится статистика.</p>
        <Link to="/quick" className="btn btn--primary">Добавить измерение</Link>
      </div>
    );
  }

  return (
    <>
      <section className="stats">
        <div className="stat stat--mint">
          <span className="stat__label">Текущий уровень</span>
          <span className="stat__value">{current.glucose.toFixed(1)} ммоль/л</span>
        </div>
        <div className="stat stat--peach">
          <span className="stat__label">Среднее за неделю</span>
          <span className="stat__value">{avg == null ? '—' : `${avg.toFixed(1)} ммоль/л`}</span>
        </div>
        <div className="stat stat--yellow">
          <span className="stat__label">В целевом диапазоне</span>
          <span className="stat__value">{inRange == null ? '—' : `${inRange}%`}</span>
        </div>
      </section>

      <section className="grid">
        <div className="panel chart">
          <h3>Глюкоза за 7 дней</h3>
          <Chart entries={weekEntries} />
        </div>

        <div className="panel recent">
          <h3>Последние записи</h3>
          <ul>
            {entries.slice(0, 6).map((e) => {
              const ok = checkRange(e.glucose, ranges[e.context]);
              const cls = ok === false ? 'recent__bar recent__bar--out' : 'recent__bar';
              return (
                <li key={e.id} className="recent__item">
                  <span className={cls} />
                  <div className="recent__info">
                    <strong>{contextLabel(e.context)}</strong>
                    <span className="muted small">{formatWhen(e.datetime)}</span>
                  </div>
                  <strong>{e.glucose.toFixed(1)}</strong>
                </li>
              );
            })}
          </ul>
          <Link to="/quick" className="btn btn--primary btn--block">Добавить измерение</Link>
        </div>
      </section>
    </>
  );
}
