import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout.jsx';

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <AuthLayout heading="Забыли пароль?" text="Отправим ссылку для сброса на вашу почту.">
      <h2>Восстановление пароля</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" required autoComplete="email" />
        <button type="submit" className="btn btn--primary btn--block">Отправить ссылку</button>
      </form>
      {sent && <p className="success" role="status">Если такой email есть в системе, мы отправим на него ссылку.</p>}
      <p className="auth__note">
        Вспомнили пароль? <Link to="/login">Войти</Link>
      </p>
    </AuthLayout>
  );
}
