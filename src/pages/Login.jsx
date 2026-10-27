import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout.jsx';
import Seo from '../components/Seo.jsx';
import { PAGE_SEO } from '../utils/seo.js';

export default function Login() {
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
   
    navigate('/');
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
        <input id="email" type="email" required autoComplete="email" />
        <label htmlFor="password">Пароль</label>
        <input id="password" type="password" required autoComplete="current-password" />
        <button type="submit" className="btn btn--primary btn--block">Войти</button>
      </form>
      <div className="auth__links">
        <Link to="/forgot">Забыли пароль?</Link>
        <Link to="/register">Регистрация</Link>
      </div>
    </AuthLayout>
  );
}
