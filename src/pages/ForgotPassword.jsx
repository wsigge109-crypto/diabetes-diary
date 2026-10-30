import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout.jsx';
import Seo from '../components/Seo.jsx';
import { PAGE_SEO } from '../utils/seo.js';
import { requestPasswordReset } from '../utils/storage.js';

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await requestPasswordReset(new FormData(e.target).get('email'));
      setSent(true);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <AuthLayout heading="Забыли пароль?" text="Отправим ссылку для сброса на вашу почту.">
      <Seo {...PAGE_SEO['/forgot']} />
      <h1>Восстановление пароля</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required autoComplete="email" />
        <button type="submit" className="btn btn--primary btn--block">Отправить ссылку</button>
      </form>
      {error && <p className="error" role="alert">{error}</p>}
      {sent && <p className="success" role="status">Если такой email есть в системе, мы отправим на него ссылку.</p>}
      <p className="auth__note">
        Вспомнили пароль? <Link to="/login">Войти</Link>
      </p>
    </AuthLayout>
  );
}
