import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import PrintableTicket from '../components/PrintableTicket';
import { Ticket, Train, Plane, Bus, Calendar, RefreshCw, XCircle, Download, AlertCircle, Eye } from 'lucide-react';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL'); // ALL, Upcoming, Completed, Cancelled
  const [selectedTicketBooking, setSelectedTicketBooking] = useState(null);
  const [cancelModalBooking, setCancelModalBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchMyBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings/my-bookings');
      if (res.success) {
        setBookings(res.bookings);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const handleCancelBooking = async () => {
    if (!cancelModalBooking) return;
    setIsCancelling(true);
    setActionSuccess('');
    try {
      const res = await api.post(`/bookings/${cancelModalBooking._id}/cancel`, {
        reason: cancelReason || 'Customer requested cancellation'
      });
      if (res.success) {
        setActionSuccess(`Booking #${cancelModalBooking.bookingRef} cancelled. Refund of ₹${res.refundAmount} processed.`);
        setCancelModalBooking(null);
        setCancelReason('');
        fetchMyBookings();
      }
    } catch (err) {
      alert(err.message || 'Failed to cancel booking.');
    } finally {
      setIsCancelling(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeFilter === 'Cancelled') return b.bookingStatus === 'Cancelled';
    if (activeFilter === 'Confirmed') return b.bookingStatus === 'Confirmed';
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <Ticket className="w-8 h-8 text-brand-sky" /> My Bookings
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage your travel itineraries, download tickets, or request cancellations.
          </p>
        </div>

        <button
          onClick={fetchMyBookings}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 self-start"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bold">
          ✓ {actionSuccess}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {['ALL', 'Confirmed', 'Cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeFilter === tab
                ? 'bg-brand-navy text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab === 'ALL' ? 'All Bookings' : tab}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="min-h-[200px] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-brand-sky border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4">
          <Ticket className="w-16 h-16 text-slate-300 mx-auto" />
          <h3 className="text-xl font-black text-slate-900">No Bookings Found</h3>
          <p className="text-slate-500 text-sm">You haven't made any travel bookings yet.</p>
          <Link
            to="/"
            className="inline-block px-6 py-3 rounded-xl bg-brand-sky text-white font-bold text-sm shadow-md"
          >
            Search & Book Tickets Now
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  {booking.transportType === 'train' && <Train className="w-5 h-5 text-amber-500" />}
                  {booking.transportType === 'flight' && <Plane className="w-5 h-5 text-sky-500" />}
                  {booking.transportType === 'bus' && <Bus className="w-5 h-5 text-emerald-500" />}
                  <span className="font-black text-slate-900 text-base">{booking.snapshot?.transportName}</span>
                  <span className="text-xs font-bold text-slate-400">({booking.snapshot?.transportNumber})</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                    booking.bookingStatus === 'Confirmed'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : booking.bookingStatus === 'Cancelled'
                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {booking.bookingStatus}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-medium text-slate-600">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Route</span>
                  <strong className="text-slate-900 text-sm">{booking.snapshot?.sourceCity} → {booking.snapshot?.destinationCity}</strong>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Journey Date & Time</span>
                  <strong className="text-slate-900 text-sm">{booking.snapshot?.journeyDate} ({booking.snapshot?.departureTime})</strong>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">PNR & Ref</span>
                  <strong className="text-brand-blue text-sm">{booking.PNR}</strong>
                  <span className="block text-[10px] text-slate-400">Ref: #{booking.bookingRef}</span>
                </div>

                <div className="sm:text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Paid</span>
                  <strong className="text-slate-900 text-base">₹{booking.finalAmount}</strong>
                  <span className="block text-[10px] text-emerald-600 font-bold">{booking.paymentStatus}</span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-slate-400">
                  Passengers ({booking.passengers?.length}): <strong className="text-slate-700">{booking.passengers?.map(p => p.name).join(', ')}</strong>
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedTicketBooking(booking)}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm hover:bg-slate-800"
                  >
                    <Eye className="w-3.5 h-3.5" /> View Ticket
                  </button>

                  {booking.bookingStatus === 'Confirmed' && (
                    <button
                      onClick={() => setCancelModalBooking(booking)}
                      className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-bold flex items-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ticket Modal */}
      {selectedTicketBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl my-8">
            <button
              onClick={() => setSelectedTicketBooking(null)}
              className="absolute -top-12 right-0 text-white hover:text-slate-300 font-bold text-sm bg-slate-800 px-4 py-1.5 rounded-full"
            >
              ✕ Close
            </button>
            <PrintableTicket booking={selectedTicketBooking} />
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {cancelModalBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 border border-slate-200 shadow-2xl">
            <h3 className="text-xl font-black text-slate-900">Cancel Booking #{cancelModalBooking.bookingRef}?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              As per demo cancellation terms, 90% refund (<strong>₹{Math.round(cancelModalBooking.finalAmount * 0.9)}</strong>) will be credited to your account.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Reason for Cancellation</label>
              <textarea
                rows="3"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Change of plans, health emergency, etc."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold focus:outline-none"
              ></textarea>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalBooking(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleCancelBooking}
                disabled={isCancelling}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs shadow-md"
              >
                {isCancelling ? 'Processing...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyBookingsPage;
