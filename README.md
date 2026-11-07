# MILUSHI GARDEN

Сайт сімейного господарства **Milushi Garden** (Милуші, Волинь): каталог сезонної продукції та замовлення через Telegram / Viber / телефон.

## Стек

- React + Vite + TypeScript
- Tailwind CSS v4
- React Router (`/`, `/catalog`, `/product/:slug`)
- Локальні дані в `src/data/` (без кошика, оплати й бекенду)

## Локальний запуск

```bash
npm install
npm run dev
```

Збірка:

```bash
npm run build
npm run preview
```

## Структура

- `src/data/products.ts` — каталог товарів
- `src/data/site.ts` — контакти, тексти, навігація
- `src/lib/order.ts` — текст замовлення та deep links
- `src/pages/` — Home, Catalog, Product
- `public/images/` — плейсхолдер-зображення (замінити на реальні фото)

## Контакти (плейсхолдери)

Перед запуском для покупців замініть у `src/data/site.ts`:

- `contacts.phone` / `contacts.phoneDisplay`
- `contacts.telegram`
- `contacts.viber`
- `contacts.email` (за потреби)

## Деплой на Vercel

1. Запуште репозиторій на GitHub.
2. У [Vercel](https://vercel.com) → **Add New Project** → імпортуйте репо.
3. Framework Preset: **Vite**. Build: `npm run build`, Output: `dist`.
4. У репозиторії вже є `vercel.json` з SPA rewrite на `index.html` для клієнтських маршрутів.
5. Підключіть Production до гілки `main` і (за потреби) додайте власний домен.

Повний production-attach і домен може знадобитися зробити власнику акаунту Vercel вручну.
