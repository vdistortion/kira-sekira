# Kira Sekira — платформа фотосайтов

Мультисайтовая платформа для фотографа: один **основной сайт**
(kira-sekira.ru) и **сайты моделей на поддоменах** (например,
`yana.kira-sekira.ru`), управляемые из единой **админки Directus**. Весь
контент хранится в админке — в коде Angular ничего не захардкожено.

## Архитектура

Актуальные требования, модель контента и принятые решения собраны в
[`docs/architecture/`](docs/architecture/README.md).

| Слой      | Технология                               | Назначение                 |
| --------- | ---------------------------------------- | -------------------------- |
| Фронтенд  | Angular 19 (SSG/пререндер)               | сайты `main` и `models`    |
| CMS / API | Directus 12 + Postgres 16 (Docker)       | хранение контента и файлов |
| Сборка    | монорепо Angular (`shared` + приложения) | переиспользуемый код       |

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

### Обработка изображений (webp)

Directus 12 не бандлит `sharp`, поэтому образ собирается кастомным
`directus/Dockerfile` (поверх `directus:12.0.2`, явно устанавливает
`image-manifest`/`to-webp` — он тянет `sharp` как зависимость — и
`@aws-sdk/client-s3`) и монтирует `directus/extensions`.
Расширение `convert-to-webp`
(`directus/extensions/convert-to-webp`) — это hook: уже загруженный WebP
оно не меняет, а любую другую растровую картинку уменьшает с сохранением
пропорций (максимальная сторона — `1000px`) и конвертирует в WebP.
Оригинал удаляется только после успешной записи WebP. Обработка работает
как с локальным хранилищем разработки, так и с production-бакетом Garage;
файлы в Garage не публикуются напрямую, а раздаются Directus через
`/assets`. SVG остаётся векторным. Файлы, загруженные до включения
расширения, остаются как есть.

## Быстрый старт (локально)

Требуется: Docker, Node.js 20+, Angular CLI (`npm i -g @angular/cli`).

```bash
cp .env.example .env            # при первом запуске
make bootstrap                  # Directus + схема + права + контент (сиды)
npm install
npm run build:shared
npx ng serve main --port 4200      # основной сайт  -> http://localhost:4200
npx ng serve models --port 4201    # сайт модели   -> http://localhost:4201
```

`make bootstrap` = `make schema-dev` (поднимает Directus, накатывает схему и
права) + `make seed` (загружает реальный контент: тексты, прайс, галереи из
фото). Для только схемы без сидов — `make schema-dev`.

Админка локально: http://studio.localhost:8055 (логин/пароль из `.env`).

## Управление контентом

Продакшен-админка: `https://studio.kira-sekira.ru`.

Подробная инструкция для заказчицы — [`docs/for-client.md`](docs/for-client.md).
Техническая модель коллекций и связи между ними — в
[`docs/architecture/content-model.md`](docs/architecture/content-model.md).

## Повторяемая миграция (важно)

Схема и базовый контент воспроизводимы скриптами. Сиды не заменяют
резервную копию: пользовательские изменения в Directus и загруженные файлы
нужно сохранять дампом БД и отдельно копировать из хранилища:

- `directus/snapshots/schema.yaml` — схема БД (источник правды).
- `directus/setup/permissions.py` — создаёт/чинит политики доступа.
- `directus/setup/seed_core.py` — тексты главной, контакты, прайсы, видео.
- `directus/setup/seed_real_galleries.py` — загружает фото из
  `IMAGES_ROOT/projects/<папка>/`, создаёт галереи основного сайта, ставит
  обложку и `main_photo`.
- `directus/setup/seed_models.py` — демо-модели (`yana`, `kirochka`) для
  локальной проверки UI. Реальные модели заводятся в админке.

Запуск сидов одной командой: `make seed` (реальный контент) и
`make seed-demo` (демо-модели). Вручную — с переменными окружения
`DIRECTUS_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `IMAGES_ROOT`:

```bash
DIRECTUS_URL=http://localhost:8055 ADMIN_EMAIL=... ADMIN_PASSWORD=... \
  IMAGES_ROOT=/home/v/Desktop/KiraSekiraProject/kira-images \
  python3 directus/setup/seed_core.py
```

Все сиды идемпотентны.

## Миграция и синхронизация (локал ↔ прод)

Полный перенос данных между локальным стеком и продом на VPS — одной
командой. Синхронизируются и БД, и файлы (Garage).

**Подготовка (один раз):**

1. В `.env` заполнить блок «Синхронизация»: `VPS_SSH_HOST` (алиас из
   `~/.ssh/config`) и `GARAGE_BUCKET` / `GARAGE_ACCESS_KEY_ID` /
   `GARAGE_SECRET_ACCESS_KEY` (те же значения, что в GitHub-секретах).
2. `make sync-setup` — ставит rclone и прописывает remote «garage».

**Команды:**

| Команда                               | Что делает                                    |
| ------------------------------------- | --------------------------------------------- |
| `make bootstrap`                      | поднять локально с нуля: схема + права + сиды |
| `make check`                          | диагностика готовности к синхронизации        |
| `make tunnel-up` / `make tunnel-down` | SSH-туннель до Garage (нужен для файлов)      |
| `make pull`                           | прод → локал: файлы + БД                      |
| `make push`                           | локал → прод: файлы + БД                      |

Отдельные части: `make db-pull`/`db-push` (только БД), `make
files-pull`/`files-push` (только файлы).

Нюансы:

- Файлы на проде лежат в Garage, локально — в volume `directus_uploads`.
  После `db-pull`/`db-push` скрипт переключает колонку
  `directus_files.storage` на нужный драйвер (`local`/`garage`), поэтому
  картинки не ломаются.
- Если docker-том `directus_uploads` недоступен с хоста (Docker Desktop,
  rootless-демон, права на `/var/lib/docker`), sync.sh автоматически
  выгружает/заливает файлы через контейнер `studio` (tar). Путь можно
  задать принудительно переменной `LOCAL_UPLOADS`.
- `make push` зеркалирует локальную БД на прод (в т.ч. удаления). Для
  предпросмотра без записи: `DRY_RUN=1 make files-push` (и аналогично для
  pull).
- После `make pull` админ-логин локально становится продовским (данные БД
  зеркалированы целиком).

### Резервные копии

Автоматические production-бэкапы пока не настроены. Makefile предоставляет
ручные команды `make db-dump-prod` и `make uploads-dump-prod`, но они сохраняют
файлы на том же компьютере. Для реальной защиты нужно дополнительно настроить
расписание и off-site-хранилище для PostgreSQL-дампа и Garage.

Локальный предпросмотр моделей можно делать двумя способами. Для проверки
реальных поддоменов добавьте в `/etc/hosts` `127.0.0.1 yana.localhost
kirochka.localhost` и открывайте `http://yana.localhost:4201` или
`http://kirochka.localhost:4201`. Либо используйте один адрес с параметром
`?m=<subdomain>`: `http://localhost:4201/?m=kirochka`. Без параметра локальный
адрес открывает демо-модель `yana`.

## Автоматические бэкапы на VPS

Локальные бэкапы не нужны: локальный стек можно пересоздать из схемы и
сидов. На production VPS бэкапируются PostgreSQL и файлы Garage.

Первоначально на VPS:

```bash
cd ~/projects/kira-sekira
mkdir -p backups/db backups/files backups/state
sudo apt-get install -y apache2-utils
htpasswd -c .backup-htpasswd backup-admin
# пароль сохранить в менеджере паролей, файл не коммитить
make backup-install
make backup-web
```

`make backup-install` устанавливает ежедневный systemd-timer. Перед сохранением
нового PostgreSQL-дампа и зеркала Garage скрипт сравнивает их с предыдущим
состоянием. Если данные не менялись, новые копии не создаются и файлы не
пересинхронизируются. Дампы БД старше 14 дней удаляются. Файлы зеркала хранятся
в `backups/files/`.

Страница доступна через Caddy по адресу:

```text
https://backups.kira-sekira.ru
```

Она защищена HTTP Basic Auth. Поддомен должен указывать на IP VPS, как и
остальные домены проекта. Это временная схема для удобной проверки и скачивания
дампов: копии всё равно находятся на том же VPS и не заменяют off-site-бэкап.

Проверка таймера и ручной запуск:

```bash
systemctl list-timers kira-sekira-backup.timer
sudo systemctl start kira-sekira-backup.service
journalctl -u kira-sekira-backup.service -n 100 --no-pager
```

## Деплой

- `make schema-release` — то же, что `schema-dev`, но поднимает прод-стек
  (`compose.release.yaml`).
- Сборка сайтов: `ng build main -c production` / `ng build models -c production`
  (SSG, пререндер маршрутов).
- Автодеплой по пушам в `release` выполняет CI (`deploy-release.yaml`): он
  накатывает схему и права. Контент на свежем проде заводится так:
  `make bootstrap` локально → `make push` (файлы + БД).

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
directus/extensions  hook-расширения (convert-to-webp)
scripts/sync.sh      синхронизация локал <-> прод (БД + файлы)
compose.yaml         локальный стек (Directus + Postgres)
compose.release.yaml прод-стек
Makefile             bootstrap / schema-* / seed / pull / push
```
