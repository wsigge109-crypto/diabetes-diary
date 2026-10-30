# Backend — Дневник самоконтроля диабета

REST API на **FastAPI + SQLAlchemy (SQLite)**. Аутентификация — JWT (Bearer), пароли хешируются **bcrypt**.

## Запуск

```bash
cd backend
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements-dev.txt
uvicorn app.main:app --reload      # http://localhost:8000, документация: /docs
```

Фронтенд (из корня проекта): `npm install && npm run dev` — Vite проксирует `/api` на `localhost:8000`.

Docker (фронтенд + бэкенд): `docker compose up --build` → http://localhost:8080

Тесты: `pytest`

## Переменные окружения

| Переменная | По умолчанию | Описание |
|---|---|---|
| `DATABASE_URL` | `sqlite:///./diary.db` | строка подключения SQLAlchemy |
| `SECRET_KEY` | `dev-secret-change-me` | ключ подписи JWT (в проде обязательно сменить) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `10080` (7 дней) | время жизни токена |
| `CORS_ORIGINS` | `http://localhost:5173` | разрешённые origin через запятую |

## API

| Метод | Путь | Описание |
|---|---|---|
| POST | `/api/auth/register` | `{name, email, password}` → `{access_token, user}` |
| POST | `/api/auth/login` | `{email, password}` → `{access_token, user}` |
| POST | `/api/auth/forgot` | `{email}` — всегда 200 (не раскрывает наличие email) |
| GET | `/api/auth/me` | текущий пользователь |
| GET | `/api/entries?days=7` | записи пользователя (новые первыми) |
| POST | `/api/entries` | `{glucose: 1..35, context, datetime?}` |
| DELETE | `/api/entries/{id}` | удалить запись |
| GET | `/api/stats` | текущий уровень, среднее за неделю, % в диапазоне |
| GET | `/api/ranges` | целевые диапазоны (по умолчанию — `DEFAULT_RANGES`) |
| PUT | `/api/ranges` | `{fasting: {min, max}, after_meal: {...}, bedtime: {...}}` |

`context`: `fasting`, `before_meal`, `after_meal`, `bedtime` (диапазоны — только для `fasting`, `after_meal`, `bedtime`).

Все пути, кроме `register/login/forgot`, требуют заголовок `Authorization: Bearer <token>`.

## Структура

```
app/
  main.py        приложение, CORS, создание таблиц
  config.py      настройки из env
  database.py    engine, сессия
  models.py      User, Entry, TargetRange
  schemas.py     Pydantic-схемы и валидация
  security.py    bcrypt, JWT, get_current_user
  routers/       auth, entries (+stats), ranges
tests/           pytest
```
