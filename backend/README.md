# Web-ларёк. Тёмная сторона

Backend интернет-магазина «Web-ларёк», разработанный в рамках проектной работы Яндекс Практикума.

Серверная часть приложения построена на **Node.js, Express, TypeScript и MongoDB**.

## Стек

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Celebrate / Joi
- Multer
- Winston / express-winston
- CORS

## Возможности

Backend предоставляет API для:

- получения списка товаров;
- создания, редактирования и удаления товаров;
- загрузки изображений товаров;
- оформления заказов;
- регистрации пользователей;
- авторизации пользователей;
- обновления access-токена;
- выхода из аккаунта;
- получения данных текущего пользователя.

## Установка

Клонировать репозиторий и перейти в директорию backend:

```bash
cd backend
```

Установить зависимости:

```bash
npm install
```

## Переменные окружения

Создать файл `.env` в директории `backend`:

```env
PORT=3000

DB_ADDRESS=mongodb://127.0.0.1:27017/weblarek

UPLOAD_PATH=images
UPLOAD_PATH_TEMP=temp

ORIGIN_ALLOW=http://localhost:5173

AUTH_REFRESH_TOKEN_EXPIRY=7d
AUTH_ACCESS_TOKEN_EXPIRY=10m

JWT_SECRET=development-secret
```

Для запуска MongoDB используется база:

```text
mongodb://127.0.0.1:27017/weblarek
```

## Запуск

Запуск сервера в режиме разработки:

```bash
npm run dev
```

Запуск через `ts-node`:

```bash
npm run start
```

Сборка проекта:

```bash
npm run build
```

Проверка кода ESLint:

```bash
npm run lint
```

После запуска сервер доступен по адресу:

```text
http://localhost:3000
```

## API

### Товары

#### Получить список товаров

```http
GET /product
```

Ответ:

```json
{
  "items": [],
  "total": 0
}
```

#### Создать товар

```http
POST /product
```

Требуется авторизация.

Пример тела запроса:

```json
{
  "title": "Мамка-таймер",
  "image": {
    "fileName": "/images/example.png",
    "originalName": "example.png"
  },
  "category": "софт-скил",
  "description": "Описание товара",
  "price": 1000
}
```

#### Изменить товар

```http
PATCH /product/:productId
```

Требуется авторизация.

#### Удалить товар

```http
DELETE /product/:productId
```

Требуется авторизация.

---

### Заказы

#### Создать заказ

```http
POST /order
```

Пример:

```json
{
  "payment": "card",
  "email": "user@example.com",
  "phone": "+79999999999",
  "address": "Москва, ул. Пушкина, д. 1",
  "total": 2000,
  "items": ["64f000000000000000000001", "64f000000000000000000002"]
}
```

Перед созданием заказа сервер проверяет:

- существование товаров;
- корректность ID товаров;
- возможность продажи товара;
- соответствие общей суммы заказа стоимости товаров.

Ответ:

```json
{
  "id": "uuid",
  "total": 2000
}
```

---

### Авторизация

#### Регистрация

```http
POST /auth/register
```

Пример:

```json
{
  "name": "Максим",
  "email": "admin@ya.ru",
  "password": "password123"
}
```

#### Вход

```http
POST /auth/login
```

Ответ:

```json
{
  "user": {
    "email": "admin@ya.ru",
    "name": "Максим"
  },
  "success": true,
  "accessToken": "jwt-токен"
}
```

Refresh-токен устанавливается в `httpOnly` cookie.

#### Обновить access-токен

```http
GET /auth/token
```

Для запроса используется refresh-токен из cookie.

#### Выйти

```http
GET /auth/logout
```

Ответ:

```json
{
  "success": true
}
```

#### Получить текущего пользователя

```http
GET /auth/user
```

Требуется access-токен:

```http
Authorization: Bearer <accessToken>
```

Ответ:

```json
{
  "user": {
    "email": "admin@ya.ru",
    "name": "Максим"
  },
  "success": true
}
```

---

### Загрузка изображений

#### Загрузить изображение

```http
POST /upload
```

Требуется авторизация.

Формат запроса:

```text
multipart/form-data
```

Имя поля:

```text
file
```

Ответ:

```json
{
  "fileName": "/images/686ade58.png",
  "originalName": "5_Dots.png"
}
```

Загруженный файл сначала помещается во временную директорию, а после создания или изменения товара переносится в директорию изображений.

## Авторизация

Для защищённых маршрутов используется JWT.

Access-токен передаётся в заголовке:

```http
Authorization: Bearer <accessToken>
```

Срок действия:

- access-токен — 10 минут;
- refresh-токен — 7 дней.

Refresh-токен хранится в `httpOnly` cookie и не передаётся JavaScript-коду браузера.

## Обработка ошибок

В приложении используется централизованный обработчик ошибок.

Основные HTTP-коды:

| Код   | Назначение                                            |
| ----- | ----------------------------------------------------- |
| `400` | Некорректные данные запроса                           |
| `401` | Требуется авторизация или токен недействителен        |
| `404` | Ресурс или маршрут не найден                          |
| `409` | Конфликт, например дубликат email или названия товара |
| `500` | Внутренняя ошибка сервера                             |

Формат ответа:

```json
{
  "message": "Описание ошибки"
}
```

Для проверки входных данных используется **Celebrate / Joi**.

## Логирование

HTTP-запросы и ошибки записываются с помощью `express-winston` и `winston`.

Создаются файлы:

```text
request.log
error.log
```

Файлы логов не добавляются в Git.

## Статические файлы

Изображения товаров находятся в:

```text
src/public/images
```

Временные загруженные файлы:

```text
src/public/temp
```

## Структура проекта

```text
backend/
├── src/
│   ├── app.ts
│   ├── config.ts
│   │
│   ├── controllers/
│   │   ├── auth.ts
│   │   ├── order.ts
│   │   ├── product.ts
│   │   └── upload.ts
│   │
│   ├── errors/
│   │   ├── bad-request-error.ts
│   │   ├── base-error.ts
│   │   ├── conflict-error.ts
│   │   ├── not-found-error.ts
│   │   └── unauthorized-error.ts
│   │
│   ├── middlewares/
│   │   ├── auth.ts
│   │   ├── error-handler.ts
│   │   ├── file.ts
│   │   ├── not-found.ts
│   │   └── validation.ts
│   │
│   ├── models/
│   │   ├── product.ts
│   │   └── user.ts
│   │
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── order.ts
│   │   ├── product.ts
│   │   └── upload.ts
│   │
│   ├── types/
│   │   └── express.d.ts
│   │
│   ├── utils/
│   │   ├── file.ts
│   │   └── token.ts
│   │
│   └── public/
│       ├── images/
│       └── temp/
│
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Frontend

Frontend должен использовать адрес backend API:

```env
VITE_API_ORIGIN=http://localhost:3000
```

Backend разрешает запросы от указанного в `ORIGIN_ALLOW` источника и поддерживает передачу cookies.
