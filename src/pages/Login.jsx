import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout.jsx';
import Seo from '../components/Seo.jsx';
import { PAGE_SEO } from '../utils/seo.js';
import { login } from '../utils/storage.js';

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    setLoading(true);
    setError('');
    try {
      await login({ email: form.get('email'), password: form.get('password') });
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      heading="Дневник самоконтроля диабета"
      text="Отслеживайте глюкозу, инсулин и питание в одном месте."
    >
      <Seo {...PAGE_SEO['/login']} />
      <h1>Вход в аккаунт</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required autoComplete="email" />
        <label htmlFor="password">Пароль</label>
        <input id="password" name="password" type="password" required autoComplete="current-password" />
        {error && <p className="error" role="alert">{error}</p>}
        <button type="submit" className="btn btn--primary btn--block" disabled={loading}>Войти</button>
      </form>
      <div className="auth__links">
        <Link to="/forgot">Забыли пароль?</Link>
        <Link to="/register">Регистрация</Link>
      </div>
    </AuthLayout>
  );
}
