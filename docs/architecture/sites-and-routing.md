# Сайты, домены и маршрутизация

## Домены

```text
kira-sekira.ru                  основной сайт фотографа
model.kira-sekira.ru            сайт конкретной модели
studio.kira-sekira.ru           Directus
```

Поддерживаются только поддомены `*.kira-sekira.ru`. Отдельные домены вроде
`yana-katunova.ru` в текущую архитектуру не входят.

## Определение модели

Один production-билд `models` обслуживает все поддомены. Первая часть hostname
используется как значение `models.subdomain`.

Примеры:

```text
yana.kira-sekira.ru      -> models.subdomain = yana
kirochka.kira-sekira.ru  -> models.subdomain = kirochka
```

Локально можно использовать реальные `*.localhost`-поддомены или параметр
`?m=<subdomain>`.

## Маршруты

Основной сайт:

```text
/                       главная
/:slug                  детальная страница галереи
```

Сайт модели:

```text
/                       профиль модели
/portfolio/:slug        детальная страница галереи
```

## Хранилища

- локальная разработка — filesystem volume Directus;
- production — общий Garage на VPS, отдельный bucket и key проекта;
- frontend получает файлы через Directus `/assets`, а не напрямую из Garage.
