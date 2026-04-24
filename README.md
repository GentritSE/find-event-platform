# 🎟 Find Event Platform

A full-stack event ticketing platform with PayPal payments, QR ticket verification, ImageKit image uploads, and Brevo email notifications. Built with a modern dark-mode UI.

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React + Vite + Tailwind CSS (dark mode) |
| Backend | Node.js + Express (OOP modules) |
| Database | PostgreSQL |
| Auth | JWT (access + refresh tokens) |
| Payments | PayPal Checkout (sandbox) |
| Email | Brevo SMTP (Nodemailer) |
| Uploads | ImageKit |
| QR Codes | `qrcode` npm package |

---

## Project Structure

```
find-event-platform/
├── client/               # React frontend (Vite + Tailwind)
│   └── src/
│       ├── components/
│       ├── hooks/
│       ├── lib/
│       ├── pages/
│       └── services/
├── server/               # Node.js backend (Express OOP)
│   └── src/
│       ├── config/
│       ├── db/
│       │   └── migrations/
│       ├── middlewares/
│       ├── modules/
│       │   ├── auth/
│       │   ├── events/
│       │   ├── payments/
│       │   ├── tickets/
│       │   ├── uploads/
│       │   ├── notifications/
│       │   └── admin/
│       └── utils/
├── .env.example
├── docker-compose.yml
└── package.json          # Root workspace
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- Docker (for PostgreSQL) or a local PostgreSQL instance

### 1. Clone and install

```bash
git clone https://github.com/GentritSE/find-event-platform.git
cd find-event-platform
cd server && npm install && cd ..
cd client && npm install && cd ..
```

### 2. Configure environment

```bash
cp .env.example server/.env
# Edit server/.env with your actual credentials
```

### 3. Start PostgreSQL

```bash
docker-compose up -d
```

### 4. Run database migrations

```bash
cd server
npm run migrate
```

### 5. Start development servers

From the root (requires `concurrently`):
```bash
npm install
npm run dev
```

Or start individually:
```bash
# Terminal 1 – backend
cd server && npm run dev

# Terminal 2 – frontend
cd client && npm run dev
```

This starts:
- Backend on `http://localhost:5000`
- Frontend on `http://localhost:5173`

---

## Environment Variables

See `.env.example` for all required variables. Key services:

### PayPal (Free Sandbox)
1. Go to [developer.paypal.com](https://developer.paypal.com)
2. Create an app in the sandbox
3. Copy Client ID and Secret to `.env`

### Brevo Email (300 free emails/day)
1. Sign up at [brevo.com](https://brevo.com)
2. Go to SMTP & API → Generate SMTP key
3. Copy credentials to `.env`

### ImageKit (Free tier)
1. Sign up at [imagekit.io](https://imagekit.io)
2. Copy Public Key, Private Key, and URL endpoint to `.env`

---

## API Endpoints

### Auth
| Method | Path | Access |
|--------|------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Authenticated |

### Events
| Method | Path | Access |
|--------|------|--------|
| GET | `/api/events` | Public |
| GET | `/api/events/:id` | Public |
| POST | `/api/events` | Organizer/Admin |
| PUT | `/api/events/:id` | Organizer/Admin |
| PATCH | `/api/events/:id/publish` | Organizer/Admin |
| DELETE | `/api/events/:id` | Organizer/Admin |

### Payments
| Method | Path | Access |
|--------|------|--------|
| POST | `/api/payments/paypal/create-order` | Authenticated |
| POST | `/api/payments/paypal/capture-order` | Authenticated |
| GET | `/api/payments/orders` | Authenticated |

### Tickets
| Method | Path | Access |
|--------|------|--------|
| GET | `/api/tickets/my` | Authenticated |
| POST | `/api/tickets/verify` | Organizer/Admin |
| GET | `/api/tickets/event/:id` | Organizer/Admin |

### Uploads
| Method | Path | Access |
|--------|------|--------|
| POST | `/api/uploads/image` | Organizer/Admin |

### Notifications
| Method | Path | Access |
|--------|------|--------|
| GET | `/api/notifications/me` | Authenticated |
| PATCH | `/api/notifications/:id/read` | Authenticated |
| PATCH | `/api/notifications/read-all` | Authenticated |

### Admin
| Method | Path | Access |
|--------|------|--------|
| GET | `/api/admin/dashboard` | Admin |
| GET | `/api/admin/users` | Admin |
| PATCH | `/api/admin/users/:id/role` | Admin |
| GET | `/api/admin/events` | Admin |
| GET | `/api/admin/revenue` | Admin |

---

## Frontend Pages

| Route | Page |
|-------|------|
| `/` | Landing/Home |
| `/events` | Event listings |
| `/events/:id` | Event detail + buy |
| `/login` | Login |
| `/register` | Register |
| `/tickets/my` | My QR tickets |
| `/dashboard/organizer` | Organizer dashboard |
| `/scan` | QR scanner for organizers |
| `/dashboard/admin` | Admin dashboard |
| `/payment/success` | PayPal success |
| `/payment/cancel` | PayPal cancel |

---

## Roles

| Role | Capabilities |
|------|-------------|
| `user` | Browse events, purchase tickets, view own tickets |
| `organizer` | + Create/manage events, scan QR tickets, upload images |
| `admin` | + All organizer actions, manage users, view all data |

---

## Development Notes

- **QR Verification Flow**: On payment capture → generate ticket + unique QR token → send email → organizer scans at event entry
- **PayPal Flow**: Create order → redirect to PayPal → capture on return → generate ticket
- **Dark Mode**: Default dark theme using Tailwind CSS custom palette
