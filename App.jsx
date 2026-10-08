import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

// Customer Pages
import HomePage from './pages/HomePage';
import TrainSearchPage from './pages/TrainSearchPage';
import FlightSearchPage from './pages/FlightSearchPage';
import BusSearchPage from './pages/BusSearchPage';
import TrainDetailsPage from './pages/TrainDetailsPage';
import FlightDetailsPage from './pages/FlightDetailsPage';
import BusDetailsPage from './pages/BusDetailsPage';
import PassengerDetailsPage from './pages/PassengerDetailsPage';
import PaymentCheckoutPage from './pages/PaymentCheckoutPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import MyBookingsPage from './pages/MyBookingsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import HelpCenterPage from './pages/HelpCenterPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTrains from './pages/admin/AdminTrains';
import AdminFlights from './pages/admin/AdminFlights';
import AdminBuses from './pages/admin/AdminBuses';
import AdminBookings from './pages/admin/AdminBookings';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminAuditLogs from './pages/admin/AdminAuditLogs';
import AdminApiStatus from './pages/admin/AdminApiStatus';

function App() {
  return (
    <Router>
      <AuthProvider>
        <BookingProvider>
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
            <Navbar />
            
            <main className="flex-grow">
              <Routes>
                {/* Public Customer Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/search/trains" element={<TrainSearchPage />} />
                <Route path="/search/flights" element={<FlightSearchPage />} />
                <Route path="/search/buses" element={<BusSearchPage />} />
                <Route path="/train/:id/details" element={<TrainDetailsPage />} />
                <Route path="/flight/:id/details" element={<FlightDetailsPage />} />
                <Route path="/bus/:id/select-seats" element={<BusDetailsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/help" element={<HelpCenterPage />} />

                {/* Protected Customer Routes */}
                <Route
                  path="/passenger-details"
                  element={
                    <ProtectedRoute>
                      <PassengerDetailsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/payment-checkout/:bookingId"
                  element={
                    <ProtectedRoute>
                      <PaymentCheckoutPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/booking-confirmation/:bookingId"
                  element={
                    <ProtectedRoute>
                      <BookingConfirmationPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-bookings"
                  element={
                    <ProtectedRoute>
                      <MyBookingsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Admin Routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/trains"
                  element={
                    <AdminRoute>
                      <AdminTrains />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/flights"
                  element={
                    <AdminRoute>
                      <AdminFlights />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/buses"
                  element={
                    <AdminRoute>
                      <AdminBuses />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/bookings"
                  element={
                    <AdminRoute>
                      <AdminBookings />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <AdminRoute>
                      <AdminUsers />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/coupons"
                  element={
                    <AdminRoute>
                      <AdminCoupons />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/audit-logs"
                  element={
                    <AdminRoute>
                      <AdminAuditLogs />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/api-status"
                  element={
                    <AdminRoute>
                      <AdminApiStatus />
                    </AdminRoute>
                  }
                />
              </Routes>
            </main>

            <Footer />
          </div>
        </BookingProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
