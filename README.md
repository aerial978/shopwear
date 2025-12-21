# ShopWear — Headless E-commerce (Symfony API + React)

## Overview

**ShopWear** is a **demonstration** e-commerce project developed *from scratch* using a **headless/API-first** architecture.

The project's objective is to present a **modern, clean, and credible** technical foundation, closely aligned with current industry standards, serving as the basis for a future e-commerce platform (products, shopping cart, authentication, etc.).

The project is intentionally divided into a **backend API** and a **frontend SPA**, with an isolated database hosted via Docker.

## Badges

---

### Tech stack

Backend : Symfony 6.4 LTS (API REST)
Frontend : React + Vite + TypeScript
Styling :Tailwind CSS (v4, plugin Vite)
Base de données : MySQL 8 (Docker)
Admin DB : phpMyAdmin
Architecture : Headless / API-first
OS dev : Windows

### Installation and startup (locally)

- **Clone the repository**

```bash
git clone https://github.com/<votre-utilisateur>/shopwear.git
cd shopwear
```
- **Start the database (Docker)**

```bash
docker compose -f docker/docker-compose.yml up -d
```
phpMyAdmin : http://localhost:8081
Database created automatically : shopwear

- **Backend Symfony (API)**

backend/.env :

```bash
DATABASE_URL=mysql://<user>:<password>@127.0.0.1:3307/<database>?serverVersion=8.0&charset=utf8mb4
```

- **Start the server**

```bash
symfony serve --no-tls --port=8001
```
Test : http://127.0.0.1:8001/api/v1/health

- **Frontend React / Vite**

frontend/.env :

```bash
VITE_API_BASE_URL=http://127.0.0.1:8001
```
Start : npm run dev
Test : http://localhost:5173

## License

[MIT](https://choosealicense.com/licenses/mit/)

