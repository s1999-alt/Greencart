# GreenCart Logistics – Delivery Simulation & KPI Dashboard

## 📌 Overview
GreenCart Logistics is an internal tool for managers to simulate eco-friendly delivery operations and calculate KPIs based on company rules.  
Managers can adjust driver counts, start times, and working hours, then run simulations to see **Total Profit, Efficiency Score, Delivery Performance, and Fuel Cost Breakdown**.

**Features:**
- Secure login for managers (JWT authentication)
- Dashboard with KPI metrics and charts
- Simulation page with configurable inputs
- Management pages (CRUD) for Drivers, Routes, Orders
- Business logic rules for late penalties, driver fatigue, high-value bonuses, and fuel cost calculation
- Simulation history stored in database with timestamps
- Responsive UI for desktop & mobile
- Cloud-hosted backend, frontend, and database

---

## 🛠 Tech Stack

**Backend:**
- Django 5.x
- Django REST Framework
- PostgreSQL (Neon/PostgreSQL on Render)
- JWT Authentication (`djangorestframework-simplejwt`)
- WhiteNoise (static file serving)
- django-cors-headers

**Frontend:**
- React (Hooks)
- React Router
- Axios
- Recharts (charts & graphs)
- CSS Flex/Grid for responsiveness

**Deployment:**
- Backend: Render
- Database: Render PostgreSQL
- Frontend: Vercel

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/greencart-logistics.git
cd greencart-logistics
```

### 2️⃣ Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install --upgrade pip
pip install -r requirements.txt
```

1. **Create `.env` in `backend/`:**
  ```env
  DJANGO_SECRET_KEY=your_secret_key
  DEBUG=1
  ALLOWED_HOSTS=*
  DATABASE_URL=sqlite:///db.sqlite3   # or your Postgres connection URL
  ```

2. **Run migrations & import data:**
  ```bash
  python manage.py migrate
  python manage.py import_drivers drivers.csv
  python manage.py import_routes routes.csv
  python manage.py import_orders orders.csv
  ```

3. **Create superuser:**
  ```bash
  python manage.py createsuperuser
  ```

4. **Run backend:**
  ```bash
  python manage.py runserver
  ```

### 3️⃣ Frontend Setup

```bash
cd ../frontend
npm install
```

1. **Create `.env` in `frontend/`:**
  ```env
  REACT_APP_API_URL=http://localhost:8000
  ```

2. **Run frontend:**
  ```bash
  npm start
  ```

---

### 🔑 Environment Variables

**Backend (`.env`):**
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_HOST`
- `POSTGRES_PORT`
- `DJANGO_SECRET_KEY`
- `DEBUG`
- `ALLOWED_HOSTS`

**Frontend (`.env`):**
- `REACT_APP_API_URL`

---

## 📡 API Documentation

### Authentication

**POST `/api/token/`**  
Authenticate and obtain JWT tokens.

**Request:**
```json
{
  "username": "manager",
  "password": "pass123"
}
```

**Response:**
```json
{
  "refresh": "...",
  "access": "..."
}
```

**POST `/api/token/refresh/`**  
Refresh access token.

**Request:**
```json
{
  "refresh": "..."
}
```

**Response:**
```json
{
  "access": "..."
}
```

---

### Drivers

- **GET `/api/drivers/`** — List all drivers
- **POST `/api/drivers/`** — Create a driver
- **PUT/PATCH `/api/drivers/{id}/`** — Update a driver
- **DELETE `/api/drivers/{id}/`** — Delete a driver

### Routes

- **GET `/api/routes/`** — List all routes
- **POST `/api/routes/`** — Create a route
- **PUT/PATCH `/api/routes/{id}/`** — Update a route
- **DELETE `/api/routes/{id}/`** — Delete a route

### Orders

- **GET `/api/orders/`** — List all orders
- **POST `/api/orders/`** — Create an order
- **PUT/PATCH `/api/orders/{id}/`** — Update an order
- **DELETE `/api/orders/{id}/`** — Delete an order

---

### Simulation

**POST `/api/simulate/`**  
Run a delivery simulation.

**Request:**
```json
{
  "num_drivers": 2,
  "start_time": "09:00",
  "max_hours": 8
}
```

**Response:**
```json
{
  "id": 1,
  "created_at": "2025-08-15T10:00:00Z",
  "total_profit": 12000,
  "efficiency_score": 85.0,
  "on_time": 40,
  "late": 7,
  "fuel_cost_total": 2500,
  "details": { "orders": [...] }
}
```

---

### Simulation Results (History)

- **GET `/api/simulationresult/`** — List all simulation runs (most recent first)

---

### Deployment URLs

- **Frontend:** [https://your-frontend.vercel.app](https://your-frontend.vercel.app)
- **Backend API:** [https://your-backend.onrender.com](https://your-backend.onrender.com)

---

## How to Run Tests

### Backend

```bash
pytest
```