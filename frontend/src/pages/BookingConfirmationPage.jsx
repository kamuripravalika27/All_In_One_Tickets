import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import PrintableTicket from '../components/PrintableTicket';
import { CheckCircle2, Ticket, ArrowRight, Compass } from 'lucide-react';

const BookingConfirmationPage = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await api.get(`/bookings/${bookingId}`);
        if (res.success) {
          setBooking(res.booking);
        }
      } catch (err) {
        console.error('Error fetching booking:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-sky border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!booking) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl p-8 shadow-2xl text-center space-y-3 relative overflow-hidden">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-md">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>
        <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider">
          Booking Confirmed & Paid
        </span>
        <h1 className="text-3xl font-black">Congratulations! Your Journey is Booked.</h1>
        <p className="text-emerald-100 text-sm max-w-xl mx-auto">
          We have generated your e-ticket itinerary with Demo PNR <strong className="text-white bg-emerald-800/60 px-2 py-0.5 rounded">{booking.PNR}</strong>.
        </p>

        <div className="pt-4 flex items-center justify-center gap-4">
          <Link
            to="/my-bookings"
            className="px-6 py-2.5 rounded-xl bg-white text-emerald-900 font-bold text-xs shadow-md hover:bg-slate-100 transition-all flex items-center gap-1.5"
          >
            <Ticket className="w-4 h-4" /> View All My Bookings
          </Link>
          <Link
            to="/"
            className="px-6 py-2.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-1.5"
          >
            Book Another Trip <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Render Printable Ticket & PDF Download */}
      <PrintableTicket booking={booking} />

    </div>
  );
};

export default BookingConfirmationPage;
