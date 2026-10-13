import { Link } from 'react-router-dom';

export default function Placeholder() {
  return (
    <div className="empty">
      <p>Этот раздел появится в следующих версиях.</p>
      <Link to="/quick" className="btn btn--primary">Добавить измерение</Link>
    </div>
  );
}
