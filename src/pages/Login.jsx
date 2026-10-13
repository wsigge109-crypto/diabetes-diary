import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout.jsx';

export default function Login() {
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    // Настоящая авторизация появится вместе с backend
    navigate('/');
  }

  return (
    <AuthLayout
      heading="Дневник самоконтроля диабета"
      text="Отслеживайте глюкозу, инсулин и питание в одном месте."
    >
      <h2>Вход в аккаунт</h2>
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
