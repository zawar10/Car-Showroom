# AUTOVISTA

AUTOVISTA is a premium car showroom and dealership management prototype built with React and Vite. It includes a customer-facing showroom, staff dashboards, application workflows, and role-based access built entirely on browser-local data.

## Overview

This project simulates a modern automotive dealership experience where:

- Customers browse available vehicles and apply for purchase
- Admins and staff manage inventory, customers, suppliers, and applications
- Role-based pages restrict access based on the signed-in user
- Data is persisted in LocalStorage, so the demo works without a backend
- Admins manage users through Redux Toolkit CRUD actions and an Axios API service

## Features

- Role-based login for Admin, Sales Manager, Inventory Manager, and Customer
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
- LocalStorage-based persistence

## Getting Started

### Install dependencies

```bash
npm install
```

### Run the app locally

```bash
npm run dev
```

The app will start in development mode and is typically available at:

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
| GET | `/users` | Fetch users |
| POST | `/users` | Create a user |
| PUT | `/users/:id` | Update a user |
| DELETE | `/users/:id` | Delete a user |

## API Configuration

Environment variables are stored in `.env`:

```text
VITE_API_URL=http://localhost:5000/api
VITE_USE_DEMO_FALLBACK=true
```

Set `VITE_API_URL` to the group's backend base URL. The demo fallback is enabled for local development and persists CRUD changes in LocalStorage when no API URL is configured. Set `VITE_USE_DEMO_FALLBACK=false` to require the backend.

## Demo Accounts

| Role | Email | Password |
| --- | --- | --- |
| Admin | admin@udevs.com | Admin@123 |
| Sales Manager | sales@udevs.com | Sales@123 |
| Inventory Manager | inventory@udevs.com | Inventory@123 |
| Customer | customer@udevs.com | Customer@123 |

## Default App Behavior

- Users are redirected to login when not authenticated.
- Route access is restricted by role.
- Demo data is seeded automatically into LocalStorage on first run.
- All changes persist only in the current browser environment.

## Local Storage Structure

The app stores data in browser LocalStorage under keys such as:

- `udevs_users`
- `udevs_session`
- `udevs_cars`
- `udevs_suppliers`
- `udevs_customers`
- `udevs_applications`
- `udevs_notifications`
- `udevs_activity_logs`
- `udevs_settings`

This data is managed from `src/services/localStorageService.js`.

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

- The showroom remains usable as a frontend prototype with LocalStorage demo data; the User Management module is API-ready through Axios.
- Authentication is simulated using seeded user data.
- Images use remote Unsplash sources.
- The project is intended for demo and learning purposes.

## License

This project is for demonstration and educational use.
