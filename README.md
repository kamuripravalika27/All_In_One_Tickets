# OneTrip - All-in-One Travel Booking Platform 🚅 ✈️ 🚌

OneTrip is a complete, full-stack travel booking application that allows users to search, compare, and book **Trains**, **Flights**, and **Buses** from a single unified platform. Inspired by modern travel engines, it features rich UI aesthetics, real-time seat selection layouts, secure JWT authentication, server-side fare calculation, Razorpay & Demo payment modes, PDF e-ticket downloads, customer cancellation refund tracking, and a comprehensive role-protected Admin Portal.

---

## 🌟 Features & Highlights

### 1. 🚅 IRCTC Train Bookings
- Search trains across major Indian cities (Hyderabad, Vijayawada, Bengaluru, Chennai, Mumbai, Delhi, Visakhapatnam, Pune, Tirupati).
- Filter by Travel Class (**1AC, 2AC, 3AC, Sleeper, Chair Car**), Price Range, and Departure Time.
- Select berth preferences (Lower, Middle, Upper, Side Lower, Side Upper).
- Guaranteed demo PNR reference generation.

### 2. ✈️ Flight Bookings
- One-way and Round-trip flight search.
- Airline options (IndiGo, Air India, Vistara, Akasa Air).
- Cabin classes (Economy, Premium Economy, Business).
- Baggage allowance and tax breakdowns.

### 3. 🚌 Interactive Bus Seat Selector
- Real-time bus seat availability layout (Lower and Upper decks).
- Color-coded seat states (**Available**, **Selected**, **Booked**).
- Atomic double-booking prevention engine.
- Boarding & Dropping point station selectors with departure times.

### 4. 💳 Payments & PDF E-Tickets
- Multiple payment modes (UPI, Credit/Debit Card, Net Banking, Wallets, and Demo Payment Simulator).
- Razorpay test integration ready via environment variables.
- Automated generation of printable e-tickets & downloadable PDF itineraries.

### 5. 🛡️ Role-Based Admin Portal
- Admin Dashboard with live stats: Users, Total Revenue, Train/Flight/Bus bookings, Pending reservations, and Cancellations.
- Recharts interactive analytics charts for booking trends and transport distribution.
- Complete CRUD management for Train, Flight, and Bus services.
- Promo coupon creation and management.
- Security Audit Log tracker and API status monitor.

---

## 💻 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router DOM, Lucide Icons, Recharts, jsPDF, html2canvas.
- **Backend**: Node.js, Express.js, JWT, bcryptjs, Helmet security, CORS, Rate Limiting, Morgan logger.
- **Database**: MongoDB & Mongoose ORM (Supports automatic zero-config `MongoMemoryServer` fallback).

---

## 🔑 Demo Account Credentials

| User Type | Email | Password |
| :--- | :--- | :--- |
| **Customer** | `customer@onetrip.com` | `User@OneTrip2026` |
| **Admin** | `admin@onetrip.com` | `Admin@OneTrip2026` |

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### 1. Install Dependencies
Run the command below from the root directory to install packages for both backend and frontend:
```bash
npm run install:all
```

### 2. Environment Configuration
The project comes with pre-configured `.env` files. You can customize secrets in `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/onetrip
JWT_SECRET=onetrip_super_secret_jwt_key_2026_production
JWT_EXPIRES_IN=7d
RAZORPAY_KEY_ID=rzp_test_onetrip_demo_key
RAZORPAY_KEY_SECRET=rzp_test_onetrip_demo_secret
ADMIN_EMAIL=admin@onetrip.com
ADMIN_PASSWORD=Admin@OneTrip2026
NODE_ENV=development
```

### 3. Seed Database
To populate the database with realistic Indian cities, train routes, flights, buses, promo codes, and demo accounts:
```bash
npm run seed
```

### 4. Run Development Servers
Start both backend (Port 5000) and frontend (Port 5173):

```bash
# Terminal 1: Backend
npm run dev:backend

# Terminal 2: Frontend
npm run dev:frontend
```

Open your browser at: `http://localhost:5173`

---

## 🧪 Testing

Run the automated backend verification test suite:
```bash
npm run test:backend
```

---

## 🔌 API Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Register customer account |
| `POST` | `/api/v1/auth/login` | Authenticate user & get JWT token |
| `GET` | `/api/v1/search/cities` | List supported Indian cities |
| `GET` | `/api/v1/trains/search` | Search train schedules with filters |
| `GET` | `/api/v1/flights/search` | Search flight schedules |
| `GET` | `/api/v1/buses/search` | Search bus schedules |
| `GET` | `/api/v1/buses/:id/seats` | Get interactive bus seat layout |
| `POST` | `/api/v1/bookings/create` | Create booking reservation |
| `POST` | `/api/v1/payments/verify-confirm` | Verify payment and confirm PNR |
| `GET` | `/api/v1/admin/dashboard-stats` | Get admin analytics & metrics |
