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
