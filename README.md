# AUTOVISTA

AUTOVISTA is a premium car showroom and dealership management system built with React/Vite, Express, Sequelize, and PostgreSQL. Customer, vehicle, application, finance, installment, payment, notification, supplier, settings, and audit data are persisted through the backend.

## Overview

This project simulates a modern automotive dealership experience where:

- Customers browse available vehicles and apply for purchase
- Admins and staff manage inventory, customers, suppliers, and applications
- Role-based pages restrict access based on the signed-in user
- Business data is persisted in PostgreSQL through Sequelize APIs
- Authentication uses JWT and Axios attaches the bearer token to protected requests
- Redux Toolkit manages authentication and user-management state; workflow services use the shared Axios client

## Features

- Role-based login for Super Admin (legacy `Admin`), Manager (legacy `Sales Manager`), Inventory Manager, and Customer
- Premium showroom landing page and vehicle detail views
- Search and filtering across the car inventory
- Vehicle application form with validation
- Application tracking and status updates
- Inventory management for creating, editing, and deleting vehicles
- Dashboard summaries for sales, stock, and profit indicators
- Supplier and customer views
- Notification and activity tracking
- User Management at `/admin/users` with create, read, update, delete, search, validation, and delete confirmation
- Styled responsive UI using React + custom CSS and MUI components

## Tech Stack

- React 19
- Vite
- React Router
- Redux Toolkit
- React Redux
- Axios
- Material UI
- Lucide React
- Node.js/Express backend
- PostgreSQL/Sequelize persistence
- JWT authentication and role/ownership authorization

## Getting Started

### Install dependencies

```bash
npm install
```

Install backend dependencies separately:

```powershell
cd Backend
npm install
```

### Configure PostgreSQL

Create a PostgreSQL database named `car_showroom`, then copy `Backend/.env.example` to `Backend/.env` and set the real password and JWT secret:

```text
PORT=5000
DB_NAME=car_showroom
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=use_a_long_random_secret
JWT_EXPIRES_IN=1d
FRONTEND_URL=http://localhost:5173
```

### Run the app locally

```bash
npm run dev
```

Start the backend first:

```powershell
cd Backend
npm run dev
```

Then start the frontend in a second terminal:

```powershell
cd Car-Showroom
npm run dev
```

The frontend is typically available at:

```text
http://localhost:5173
```

### Production build

```bash
npm run build
```

### Linting

```bash
npm run lint
```

## User Management Redux Flow

The admin User Management page follows this flow:

```text
Users page -> Redux thunk -> Axios user API service -> user slice -> Redux state -> UI
```

The module is split into reusable components and Redux layers:

- `src/pages/users/Users.jsx` connects the page to Redux
- `src/components/users/` contains the form, table, and confirmation modal
- `src/redux/users/` contains the slice, async CRUD actions, and selectors
- `src/services/userApi.js` contains Axios requests only
- `src/app/store.js` registers the `users` reducer

Supported API contract:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/users/user` | Fetch users (Admin) |
| POST | `/api/users/user` | Create a user (Admin) |
| PUT | `/api/users/user` | Update a user (Admin) |
| DELETE | `/api/users/user/:id` | Delete a user (Admin) |

## API Configuration

Environment variables are stored in `.env`:

```text
VITE_API_URL=http://localhost:5000/api
```

Set `VITE_API_URL` to the backend base URL. Business workflow requests must use the backend; LocalStorage is only retained for the existing browser session compatibility.

## API List

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Health check |
| POST | `/api/users/login` | Login and receive JWT |
| POST | `/api/users/register` | Public customer registration |
| GET/POST/PUT/DELETE | `/api/users/user` | Admin user management |
| GET | `/api/vehicles` | List inventory |
| POST/PUT/DELETE | `/api/vehicles` | Admin vehicle management |
| GET/POST | `/api/applications` | Role-filtered applications and customer submission |
| PATCH | `/api/applications/:id/status` | Valid status transition |
| PATCH | `/api/applications/:id/assign-manager` | Admin manager assignment |
| PATCH | `/api/applications/:id/verify-customer` | Manager verification |
| PATCH | `/api/applications/:id/vehicle` | Manager vehicle confirmation |
| POST/GET | `/api/applications/:id/finance` | Finance plan and authoritative calculations |
| POST | `/api/applications/:id/payments` | Atomic installment payment |
| GET | `/api/dashboard` | Role-scoped live KPIs |
| GET | `/api/dashboard/audit` | Admin audit activity |
| GET | `/api/account/profile` | Current user profile |
| GET | `/api/account/notifications` | Current user notifications |
| GET/PUT | `/api/settings` | Persistent settings |

Protected endpoints require:

```text
Authorization: Bearer <JWT>
```

## Local Workflow Test

1. Log in as `customer@udevs.com`, open the showroom, and submit an application.
2. Log in as `admin@udevs.com`, approve the application, and assign `sales@udevs.com`.
3. Log in as `sales@udevs.com`, verify the customer, confirm an available vehicle, and create a finance plan.
4. Record an installment payment and verify the paid and remaining balances.
5. Confirm customer access is limited to their own applications.
6. Confirm manager access is limited to assigned applications.
7. Confirm customer status changes, manager assignment, and payment mutation requests return `403`.

The backend creates the initial demo users and inventory records when the database is empty.

## Demo Accounts

| Role | Email | Password |
| --- | --- | --- |
| Admin | admin@udevs.com | Admin@123 |
| Sales Manager | sales@udevs.com | Sales@123 |
| Inventory Manager | inventory@udevs.com | Inventory@123 |
| Customer | customer@udevs.com | Customer@123 |

## Authorization Rules

- Users are redirected to login when not authenticated.
- Route access is restricted by role.
- Super Admin (the existing `Admin` role) can manage users, vehicles, applications, assignments, reports, and audit data.
- Managers can only access applications assigned to their authenticated user.
- Customers can only access their own applications, finance plans, installments, payments, and profile.
- CNIC values are not returned to unrelated users.
- Passwords are bcrypt hashes and are never returned in API JSON.

## Project Structure

```text
src/
  App.jsx
  App.css
  main.jsx
  assets/
  app/
    store.js
  components/
    common/
    layout/
    users/
  context/
  redux/
    users/
  pages/
    admin/
    auth/
    users/
  services/
  utils/
```

## Important Notes

- PostgreSQL is the source of truth for business data; LocalStorage is used only for the browser session compatibility record and JWT.
- `sequelize.sync({ alter: true })` is used for local development; use migrations before production deployment.
- Images use remote Unsplash sources.
- The project is intended for demo and learning purposes.

## License

This project is for demonstration and educational use.
