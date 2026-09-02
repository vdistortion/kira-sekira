# Kira Sekira — платформа фотосайтов

Мультисайтовая платформа для фотографа: один **основной сайт**
(kira-sekira.ru) и **сайты моделей на поддоменах** (например,
`yana.kira-sekira.ru`), управляемые из единой **админки Directus**. Весь
контент хранится в админке — в коде Angular ничего не захардкожено.

## Архитектура

| Слой | Технология | Назначение |
|------|-----------|-----------|
| Фронтенд | Angular 19 (SSG/пререндер) | сайты `main` и `models` |
| CMS / API | Directus 12 + Postgres 16 (Docker) | хранение контента и файлов |
| Сборка | монорепо Angular (`shared` + приложения) | переиспользуемый код |

- **`main`** — основной сайт kira-sekira.ru (главная, портфолио-галереи,
  видео, прайс, контакты).
- **`models`** — сайт конкретной модели; один билд обслуживает все поддомены,
  модель определяется по `window.location.hostname` (subdomain).
- **`studio`** — контейнер Directus (админка).
- **`shared`** — библиотека: `DirectusService`, пайпы (`markdown`,
  `youtubeEmbed`), `DIRECTUS_API_URL`.

Окружения: `environment.ts` (прод, `https://studio.kira-sekira.ru`) и
`environment.development.ts` (локал, `http://studio.localhost:8055`).
Пререндер (SSG) при сборке в проде берёт данные из прод-API; `ng serve`
(дев) — из локального API.

## Быстрый старт (локально)

Требуется: Docker, Node.js 20+, Angular CLI (`npm i -g @angular/cli`).

```bash
cp .env.example .env            # при первом запуске
make schema-dev                 # поднимает Directus, накатывает схему, права, контент
npm install
npm run build:shared
npx ng serve main --port 4200      # основной сайт  -> http://localhost:4200
npx ng serve models --port 4201    # сайт модели   -> http://localhost:4201
```

Админка локально: http://studio.localhost:8055 (логин/пароль из `.env`).

## Управление контентом (админка)

Админка прод: `https://studio.kira-sekira.ru`. Основные коллекции:

- **main_site** (синглтон) — теглайн, «с кем работаю с», описание, главное фото.
- **contacts** (синглтон) — телефон, Telegram, WhatsApp, Email, часы приёма.
  Общие для всех сайтов.
- **prices** — пакеты (Стандарт/Премиум) + обложка.
- **galleries** — альбомы (галереи). **Общие**: один альбом можно привязать и к
  основному сайту, и к сайту модели.
- **gallery_images** — фото внутри альбома.
- **videos** — видео-проходки. Хранятся как **внешние ссылки** (YouTube/VK), не
  как файлы. Привязываются к main_site и/или моделям.
- **models** — модели: поддомен, имя, главное фото, параметры (грудь, талия,
  бёдра, размер одежды, рост, вес, размер обуви, цвет волос/глаз), описание,
  альбомы, видео.
- **directus_files** — все загруженные изображения.

Права: админ — полный доступ; **Public** — только чтение нужных коллекций
(чтобы сайт грузил данные без токена).

## Повторяемая миграция (важно)

Схема и контент воспроизводимы скриптами — пересоздание БД не теряет данные
при наличии снапшота и сидов:

- `directus/snapshots/schema.yaml` — схема БД (источник правды).
- `directus/setup/permissions.py` — создаёт/чинит политики доступа.
- `directus/setup/seed.py` — загружает фото и создаёт галереи основного сайта.
- `directus/setup/seed_core.py` — тексты главной, контакты, прайсы, видео.
- `directus/setup/seed_models.py` — демо-модель (поддомен `model1`).

Запуск сидов: `DIRECTUS_URL=... ADMIN_EMAIL=... ADMIN_PASSWORD=... python3
directus/setup/seed.py` и т.д. Все идемпотентны.

## Деплой

- `make schema-release` — то же, что `schema-dev`, но поднимает прод-стек
  (`compose.release.yaml`).
- Сборка сайтов: `ng build main -c production` / `ng build models -c production`
  (SSG, пререндер маршрутов).

## Соглашения

- **Контента в коде Angular нет** — только в админке.
- Синглтоны (`contacts`, `main_site`) обновляются через **PATCH**, не POST.
- M2M-связи читаются через переходные таблицы по внешним ключам
  (`main_site_id`, `galleries_id`, `videos_id`, `models_id`); целевой объект —
  во вложенном поле (`galleries.galleries_id.*`).
- Новые модели/галереи добавляются в админке, без правок кода.

## Структура репозитория

```
projects/shared      общая библиотека (сервис, пайпы, env-токен)
projects/main        основной сайт
projects/models      сайты моделей на поддоменах
directus/snapshots   схема БД
directus/setup       скрипты прав доступа и сидов
compose.yaml         локальный стек (Directus + Postgres)
compose.release.yaml прод-стек
Makefile             schema-dev / schema-release / permissions
```
