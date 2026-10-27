import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout.jsx';
import Seo from '../components/Seo.jsx';
import { PAGE_SEO } from '../utils/seo.js';

export default function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    if (form.get('password') !== form.get('password2')) {
      setError('Пароли не совпадают');
      return;
    }
    setError('');
    navigate('/');
  }

  return (
    <AuthLayout
      heading="Начните вести дневник"
      text="Займёт меньше двух минут — доступ с любого устройства."
    >
      <Seo {...PAGE_SEO['/register']} />
      <h1>Регистрация</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Имя</label>
        <input id="name" name="name" type="text" required autoComplete="name" />
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required autoComplete="email" />
        <label htmlFor="password">Пароль</label>
        <input id="password" name="password" type="password" required minLength={6} autoComplete="new-password" />
        <label htmlFor="password2">Повторите пароль</label>
        <input id="password2" name="password2" type="password" required autoComplete="new-password" />
        {error && <p className="error" role="alert">{error}</p>}
        <button type="submit" className="btn btn--primary btn--block">Зарегистрироваться</button>
      </form>
      <p className="auth__note">
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </p>
    </AuthLayout>
  );
}
