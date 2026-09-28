# Project 1 — B2B Hub (Angular + Node.js + MongoDB)

A B2B wholesale ordering platform: **volume (tiered) pricing**, **minimum order quantities (MOQ)**, email-verified accounts, password reset, and a **one-click demo account** for recruiters.

| Layer | Tech |
|---|---|
| Frontend | Angular 18 (standalone components, signals, lazy routes) |
| Backend | Node.js + Express 4 |
| Database | MongoDB + Mongoose |
| Auth | JWT, bcrypt, email verification & reset tokens (Nodemailer) |

## 1. Prerequisites
Node.js 18+ (20 recommended), VS Code, and MongoDB (local install **or** free MongoDB Atlas cluster).

## 2. Run the backend
```bash
cd backend
npm install
cp .env.example .env      # Windows: copy .env.example .env
# edit .env: set MONGO_URI and a long random JWT_SECRET
npm run seed              # creates 12 products + demo user
npm run dev               # API on http://localhost:5000
```
Demo account: `demo@b2bhub.com` / `Demo@1234`.
**Email without SMTP:** verification/reset links are printed in the backend console and shown on screen as "Dev mode" links, so everything works locally. For real emails fill the `SMTP_*` variables (Brevo, Mailtrap, Gmail app password...).

## 3. Run the frontend
```bash
cd frontend
npm install
npm start                 # http://localhost:4200  (proxies /api to :5000)
```
Recruiter shortcut: **http://localhost:4200/login?demo=1** signs in automatically.

## 4. Backend explained (`backend/`)
- `server.js` – Express app: security headers (helmet), gzip (compression), CORS, routes, error handler, MongoDB connection.
- `models.js` – Mongoose schemas: `User` (verified flag + tokens), `Product` (`moq`, `tiers[]` volume prices), `Order`.
- `routes/auth.js` – `POST /register` (hash password, create verify token, send mail) · `GET /verify/:token` · `POST /login` (blocks unverified users) · `POST /forgot` and `/reset/:token` (1-hour token) · `POST /demo` (returns JWT for the seeded demo user).
- `routes/shop.js` – `GET /products`, `POST /orders` (JWT protected; **prices and MOQ are recomputed on the server**, never trusted from the client), `GET /orders`.
- `mail.js` – Nodemailer wrapper with console fallback. `seed.js` – sample data.

## 5. Frontend explained (`frontend/src/app/`)
- `main.ts` – bootstraps the app with router + HttpClient + JWT interceptor (no NgModules).
- `core.ts` – `Auth` service (signals hold the user, token in localStorage), `Cart` service (persisted, computes tier prices), `authGuard`, `authInterceptor`.
- `routes.ts` – **Home is eager, every other page is lazy-loaded** → tiny first bundle and instant home page (no API call, no external fonts/images, SVG logo).
- `pages/` – `home`, `catalog` (search + category filter), `cart`, `orders` (guarded), `auth` (login, register, verify, forgot, reset).
- `public/logo.svg` & `favicon.svg` – app logo/icon. `styles.css` – responsive dark theme with CSS variables.

## 6. Deploy (for your LinkedIn link)
1. **Database:** MongoDB Atlas free cluster → copy the connection string.
2. **Backend:** Render/Railway → root `backend`, start `npm start`, add the env vars, set `CLIENT_URL` to your frontend URL. Run the seed once (`npm run seed` from the platform shell or locally with the Atlas URI).
3. **Frontend:** in `frontend/proxy.conf.json` proxies work only in dev. For production replace `'/api/...'` with your API URL (or add a rewrite `/api/* → https://your-api`). Deploy `dist/b2b-hub/browser` to Netlify/Vercel/Cloudflare Pages with an SPA fallback to `index.html`.
4. Free backends sleep when idle: open the API `/api/health` once before sharing, or use a free uptime pinger.
5. LinkedIn: add the link under *Featured* with `https://your-app/login?demo=1` + a screenshot and the GitHub repo.

## 7. Ideas to extend
Product detail page, admin dashboard, quote requests, Stripe, unit tests (Jest/Karma), Docker Compose.
