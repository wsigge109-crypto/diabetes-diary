export const SITE_URL = 'https://example.com';
export const SITE_NAME = 'Дневник самоконтроля диабета';

export const PAGE_SEO = {
  '/': {
    title: `Главная — ${SITE_NAME}`,
    description:
      'Дневник самоконтроля диабета: текущий уровень глюкозы, среднее за неделю и доля измерений в целевом диапазоне.',
    path: '/',
  },
  '/quick': {
    title: `Быстрая запись — ${SITE_NAME}`,
    description: 'Добавьте измерение глюкозы с контекстом: натощак, до или после еды, перед сном.',
    path: '/quick',
    robots: 'noindex, nofollow',
  },
  '/ranges': {
    title: `Целевые диапазоны — ${SITE_NAME}`,
    description: 'Настройте индивидуальные целевые диапазоны глюкозы для разных ситуаций измерения.',
    path: '/ranges',
    robots: 'noindex, nofollow',
  },
  '/diary': {
    title: `Дневник — ${SITE_NAME}`,
    description: 'Журнал измерений глюкозы, инсулина и питания.',
    path: '/diary',
    robots: 'noindex, nofollow',
  },
  '/analytics': {
    title: `Аналитика — ${SITE_NAME}`,
    description: 'Графики и статистика по измерениям глюкозы.',
    path: '/analytics',
    robots: 'noindex, nofollow',
  },
  '/reminders': {
    title: `Напоминания — ${SITE_NAME}`,
    description: 'Напоминания об измерениях и приёме препаратов.',
    path: '/reminders',
    robots: 'noindex, nofollow',
  },
  '/profile': {
    title: `Профиль — ${SITE_NAME}`,
    description: 'Личные данные пользователя дневника самоконтроля.',
    path: '/profile',
    robots: 'noindex, nofollow',
  },
  '/settings': {
    title: `Настройки — ${SITE_NAME}`,
    description: 'Параметры приложения дневника самоконтроля диабета.',
    path: '/settings',
    robots: 'noindex, nofollow',
  },
  '/login': {
    title: `Вход — ${SITE_NAME}`,
    description: 'Войдите в дневник самоконтроля, чтобы видеть измерения глюкозы и статистику.',
    path: '/login',
    robots: 'noindex, nofollow',
  },
  '/register': {
    title: `Регистрация — ${SITE_NAME}`,
    description: 'Создайте аккаунт, чтобы вести дневник глюкозы, инсулина и питания.',
    path: '/register',
    robots: 'noindex, nofollow',
  },
  '/forgot': {
    title: `Восстановление пароля — ${SITE_NAME}`,
    description: 'Запросите ссылку для сброса пароля от дневника самоконтроля диабета.',
    path: '/forgot',
    robots: 'noindex, nofollow',
  },
};
