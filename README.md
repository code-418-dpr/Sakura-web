# Sakura-web

[![license](https://img.shields.io/github/license/code-418-dpr/Sakura-web)](https://opensource.org/licenses/MIT)
[![release](https://img.shields.io/github/v/release/code-418-dpr/Sakura-web?include_prereleases)](https://github.com/code-418-dpr/Sakura-web/releases)
[![downloads](https://img.shields.io/github/downloads/code-418-dpr/Sakura-web/total)](https://github.com/code-418-dpr/Sakura-web/releases)
[![code size](https://img.shields.io/github/languages/code-size/code-418-dpr/Sakura-web.svg)](https://github.com/code-418-dpr/Sakura-web)

[![linters](https://github.com/code-418-dpr/Sakura-web/actions/workflows/linters.yaml/badge.svg)](https://github.com/code-418-dpr/Sakura-web/actions/workflows/linters.yaml)
[![codeql](https://github.com/code-418-dpr/Sakura-web/actions/workflows/codeql.yaml/badge.svg)](https://github.com/code-418-dpr/Sakura-web/actions/workflows/codeql.yaml)
[![build](https://github.com/code-418-dpr/Sakura-web/actions/workflows/build.yaml/badge.svg)](https://github.com/code-418-dpr/Sakura-web/actions/workflows/build.yaml)
[![docker build](https://github.com/code-418-dpr/Sakura-web/actions/workflows/docker.yaml/badge.svg)](https://github.com/code-418-dpr/Sakura-web/actions/workflows/docker.yaml)

Веб-приложение для проекта [Sakura](https://github.com/code-418-dpr/Sakura)

## Стек

- **Bun** — быстрая среда исполнения JavaScript
- **TypeScript** — статически типизированный JavaScript
- **Next.js** — фронтенд-фреймворк на основе React
- **Tailwind CSS** — CSS-фреймворк
- **HeroUI** — набор компонентов
- **Prisma ORM** — ORM для работы с БД
- **Auth.js** — авторизация и управление сессиями
- **ESLint** — статический анализатор кода
- **Stylelint** — анализатор стилей
- **Prettier** — форматировщик кода
- **Docker** — платформа для контейнеризации

## Установка и запуск

> [!WARNING]
> Полноценная работа веб-приложения возможна только в том случае, если оно запущено как часть
> [базового репозитория](https://github.com/code-418-dpr/Sakura). Инструкция ниже предназначена для
> локального тестирования.

0. Клонируйте репозиторий и перейдите в его папку.

### Посредством Docker

1. Установите Docker.
2. Поднимите базу данных PostgreSQL:

```shell
docker compose up -d
```

3. Создайте файл `.env` на основе [.env.template](.env.template) и настройте все описанные там параметры.
4. Запустите сборку образа:

```shell
docker build -t sakura-web .
```

4. Теперь запускать образ можно командой:

```shell
docker run -d --name sakura-web-standalone -p 3000:3000 sakura-web
```

### Без использования Docker

1. Установите Bun одним из способов. Например, для Windows:

```shell
powershell -c "irm bun.sh/install.ps1 | iex"
```

2. Поднимите базу данных PostgreSQL.

3. Установите зависимости:

```shell
bun install
```

4. Создайте файл `.env` на основе [.env.template](.env.template) и настройте все описанные там параметры.

5. Соберите проект:

```shell
bun run build
```

6. Теперь запускать проект можно командой:

```shell
bun run start
```

## Модификация

Запуск сервера в режиме отладки осуществляется командой:

```shell
bun run dev
```

Запуск Prisma Studio выполняется командой:

```shell
bun run db:studio
```

Применение изменений к базе данных выполняется командой:

```shell
bun run db:push
```

Заполнение базы данных первоначальными значениями выполняется командой:

```shell
bun run db:seed
```

Прочие скрипты, необходимые для запуска линтеров, форматировщика и т. д. находятся в
файле [package.json](./package.json).
