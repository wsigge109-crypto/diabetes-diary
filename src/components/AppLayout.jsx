import { Navigate, NavLink, Outlet, useLocation } from 'react-router-dom';
import Seo from './Seo.jsx';
import { PAGE_SEO } from '../utils/seo.js';
import { getToken } from '../utils/api.js';
import { logout } from '../utils/storage.js';

const LINKS = [
  { to: '/', label: 'Главная' },
  { to: '/quick', label: 'Быстрая запись' },
  { to: '/ranges', label: 'Целевые диапазоны' },
  { to: '/diary', label: 'Дневник' },
  { to: '/analytics', label: 'Аналитика' },
  { to: '/reminders', label: 'Напоминания' },
  { to: '/profile', label: 'Профиль' },
  { to: '/settings', label: 'Настройки' },
];

export default function AppLayout() {
  const { pathname } = useLocation();
  const current = LINKS.find((l) => l.to === pathname);

  const seo = PAGE_SEO[pathname] ?? PAGE_SEO['/'];

  if (!getToken()) return <Navigate to="/login" replace />;

  return (
    <div className="app">
      <Seo {...seo} />
      <nav className="sidebar" aria-label="Основное меню">
        <div className="sidebar__logo">Дневник</div>
        <ul>
          {LINKS.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end
                className={({ isActive }) =>
                  isActive ? 'sidebar__link sidebar__link--active' : 'sidebar__link'
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <NavLink to="/login" className="sidebar__logout" onClick={logout}>
          Выйти
        </NavLink>
      </nav>

      <div className="content">
        <header className="topbar">
          <h1>{current ? current.label : 'Дневник'}</h1>
          <span className="topbar__avatar" aria-hidden="true" />
        </header>
        <main className="page">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
