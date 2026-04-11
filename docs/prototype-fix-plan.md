# План доработки прототипа — demo-ready

> Дата: 2026-04-11  
> Ветка: feat/tz-alignment-v2

---

## Что ОК (не трогаем)

| Экран | Статус |
|-------|--------|
| Login screen | ✅ Demo-ready, чистый UI |
| Admin users page | ✅ Таблица, поиск, статусы |
| Admin journal | ✅ Read-only, фильтр, экспорт |
| Admin audit | ✅ Таблица событий, фильтр по типу |
| Admin roles | ✅ Матрица доступов |
| Analytics dashboards | ✅ KPI, скриншот, сигналы |
| Analytics ranking | ✅ Переиспользует ProjectsRankingView |
| Analytics timeline-2050 | ✅ Список проектов по годам |
| Analytics feasibility | ✅ Mock с IRR/NPV/payback |
| Analytics investments | ✅ Разбивка по периодам |
| Analytics effectiveness | ✅ Метрики по проектам |
| Analytics org-model | ✅ Источники финансирования |
| Map (/map) | ✅ Не трогаем |
| Constructor | ✅ Сохранён, но требует интеграции в IA |

---

## Что надо исправить (баги)

| Приоритет | Проблема | Файл | Что делать |
|-----------|----------|------|------------|
| 🔴 Крит | `/auth/login` не существует — все ссылки на него = 404 | forgot-password, locked, first-login | Создать `app/auth/login/page.tsx` или заменить ссылки на `/` |
| 🔴 Крит | first-login вызывает `login()` при уже залогиненном пользователе | first-login/page.tsx | Сравнивать пароль напрямую через MOCK_PASSWORDS |
| 🟡 Средний | `/auth/locked` никогда не достигается | login-screen, auth-wrapper | Добавить `router.push('/auth/locked')` при ACCOUNT_LOCKED |
| 🟡 Средний | `/settings` в sidebar — 404 | sidebar.tsx | Удалить ссылку |
| 🟡 Средний | `/export` и `/analytics/reports` — дубликаты | export/page, analytics/reports | `/export` скрыть из навигации, сделать редирект |
| 🟡 Средний | `<a href>` вместо `<Link>` | login-screen.tsx | Заменить на `<Link>` |
| 🟡 Средний | Мёртвые кнопки Search/Download в header | app-header.tsx | Убрать или связать |

---

## Что мешает восприятию прототипа

| Проблема | Почему | Решение |
|----------|--------|---------|
| `/archive` и `/export` — orphaned | Нет ссылок в header/sidebar | Встроить в IA или скрыть |
| Терминология: проект/маршрут/сценарий | Путаница для заказчика | Унифицировать UI-тексты |
| Нет footer на большинстве страниц | Только analytics имеют footer | Добавить единый footer через AppShell |
| Sidebar component — мёртвый код | Не используется нигде | Удалить или интегрировать |
| Нет breadcrumbs | Непонятно где находишься в аналитике/админке | Добавить breadcrumbs в page headers |
| Разные паттерны page header | Каждый экран делает header по-своему | Создать единый `<PageHeader>` компонент |

---

## Что меняем

1. **Auth**: создать `/auth/login`, исправить first-login, добавить redirect на locked
2. **Навигация**: удалить `/settings`, убрать дубликаты, починить dead buttons
3. **IA**: встроить `/archive` и `/export`, убрать orphaned страницы из меню
4. **Единый паттерн страниц**: PageHeader + breadcrumbs + footer
5. **Терминология**: проект = маршрут, сценарий = отдельная сущность в конструкторе
6. **Ранжирование**: усилить UX — показать веса, пороги, сохранение

---

## Что сознательно НЕ трогаем

| Что | Почему |
|-----|--------|
| SVG карты, network-map.tsx | Жёсткое ограничение |
| Логика фильтрации карты | Не влияет на UI |
| Mock-данные | Прототип, не production |
| Backend-архитектура | За рамками |
