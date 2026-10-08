import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Ticket, CheckCircle2, XCircle } from 'lucide-react';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/bookings');
      if (res.success) setBookings(res.bookings);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (id, bookingStatus, paymentStatus) => {
    try {
      const res = await api.put(`/admin/bookings/${id}/status`, { bookingStatus, paymentStatus });
      if (res.success) fetchBookings();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <Ticket className="w-6 h-6 text-brand-sky" /> All Customer Bookings
        </h1>
        <p className="text-xs text-slate-500">Monitor live customer PNR reservations and update payment/booking statuses.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-700 text-xs uppercase font-bold">
            <tr>
              <th className="p-4">Ref / PNR</th>
              <th className="p-4">User</th>
              <th className="p-4">Transport / Route</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Update Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
            {bookings.map((b) => (
              <tr key={b._id} className="hover:bg-slate-50">
                <td className="p-4">
                  <span className="font-bold text-slate-900">{b.bookingRef}</span>
                  <p className="text-xs text-brand-blue font-bold">{b.PNR}</p>
                </td>
                <td className="p-4">
                  <p className="font-bold">{b.user?.name || 'Customer'}</p>
                  <p className="text-[11px] text-slate-400">{b.contactEmail}</p>
                </td>
                <td className="p-4">
                  <p className="font-bold">{b.snapshot?.transportName}</p>
                  <p className="text-xs text-slate-500">{b.snapshot?.sourceCity} → {b.snapshot?.destinationCity}</p>
                </td>
                <td className="p-4 font-black text-slate-900">₹{b.finalAmount}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    b.bookingStatus === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {b.bookingStatus}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => handleUpdateStatus(b._id, 'Confirmed', 'Paid')}
                    className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(b._id, 'Cancelled', 'Refunded')}
                    className="px-3 py-1 bg-rose-100 text-rose-800 text-xs font-bold rounded-lg"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBookings;
