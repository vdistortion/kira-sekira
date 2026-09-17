# Контентная модель

Имена ниже — технические имена коллекций Directus.

## `main_site` — singleton

- `site_name` — название/текстовый логотип;
- `main_photo` — главное фото;
- `tagline` — позиционирование;
- `experience_since` — год начала работы;
- `advantages_md` — текст блока «Обо мне»;
- `galleries` — M2M-связь с альбомами;
- `videos` — M2M-связь с видео.

Время работы не хранится в `main_site`.

## `contacts` — singleton

Общие для основного сайта и сайтов моделей:

- `phone`;
- `telegram` — готовый URL;
- `whatsapp` — готовый URL;
- `email`;
- `working_hours` — необязательное поле.

Frontend использует URL напрямую, не добавляя к нему домен мессенджера.

## `models`

- `subdomain`;
- `name`;
- `main_photo`;
- `description`;
- параметры: `bust`, `waist`, `hips`, `height`, `weight`,
  `clothing_size`, `shoe_size`, `hair_color`, `eye_color`;
- целевые необязательные поля: `location`, `tattoos`;
- M2M-связи с `galleries` и `videos`.

## `galleries`

- `title`;
- `slug`;
- `cover`;
- `description` — необязательное описание;
- `sort`;
- M2M-связи с `main_site` и `models`;
- 1:M-связь с `gallery_images`.

## `gallery_images`

- `gallery`;
- `image`;
- `sort`.

Alt-текст пока не является обязательным полем. Если он понадобится, его можно
формировать автоматически из названия галереи и имени файла, не заставляя
заказчицу заполнять его вручную для каждой фотографии.

## `videos`

- `title`;
- `url`;
- порядок связи с каждым сайтом.

Одно видео может быть показано на основном сайте и на сайтах моделей.

## `prices`

- `name`;
- `price`;
- `image`;
- `description`;
- `sort`.

Сама структура не фиксирует конкретные тарифы: цены и набор услуг меняются из
админки.

## `reviews`

- `author`;
- `text`;
- `photo`;
- `sort`.

Отзывы можно перенести из Wfolio вручную позже. На первом этапе важна сама
коллекция и возможность редактирования в Directus.
