import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addEntry } from '../utils/storage.js';
import { CONTEXTS } from '../utils/ranges.js';

export default function QuickEntry() {
  const [glucose, setGlucose] = useState('');
  const [context, setContext] = useState('fasting');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    const value = parseFloat(glucose.replace(',', '.'));
    if (Number.isNaN(value) || value < 1 || value > 35) {
      setError('Введите значение от 1 до 35 ммоль/л');
      return;
    }
    addEntry({ glucose: Math.round(value * 10) / 10, context });
    navigate('/');
  }

  return (
    <form className="panel entry" onSubmit={handleSubmit}>
      <h2>Новое измерение</h2>
      <label htmlFor="glucose">Глюкоза, ммоль/л</label>
      <input
        id="glucose"
        value={glucose}
        onChange={(e) => setGlucose(e.target.value)}
        inputMode="decimal"
        placeholder="5.6"
        autoFocus
      />
      {error && <p className="error" role="alert">{error}</p>}

      <div className="chips" role="group" aria-label="Когда измерено">
        {CONTEXTS.map((c) => (
          <button
            key={c.id}
            type="button"
            className={context === c.id ? 'chip chip--active' : 'chip'}
            aria-pressed={context === c.id}
            onClick={() => setContext(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <button type="submit" className="btn btn--primary btn--block">Сохранить и вернуться</button>
    </form>
  );
}
