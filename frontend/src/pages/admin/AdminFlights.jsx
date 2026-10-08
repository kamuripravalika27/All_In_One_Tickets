import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Plane, Plus, Trash2 } from 'lucide-react';

const AdminFlights = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFlights = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/flights');
      if (res.success) setFlights(res.flights);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  const handleDeleteFlight = async (id) => {
    if (!window.confirm('Delete this flight schedule?')) return;
    try {
      const res = await api.delete(`/admin/flights/${id}`);
      if (res.success) fetchFlights();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Plane className="w-6 h-6 text-sky-500" /> Manage Airline Schedules
          </h1>
          <p className="text-xs text-slate-500">Configure IndiGo, Air India, Vistara flight inventory and fares.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-700 text-xs uppercase font-bold">
            <tr>
              <th className="p-4">Flight # / Airline</th>
              <th className="p-4">Route</th>
              <th className="p-4">Timing</th>
              <th className="p-4">Fare</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
            {flights.map((f) => (
              <tr key={f._id} className="hover:bg-slate-50">
                <td className="p-4">
                  <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">{f.flightNumber}</span>
                  <p className="font-bold text-slate-900">{f.airlineName}</p>
                </td>
                <td className="p-4">{f.sourceCity} → {f.destinationCity}</td>
                <td className="p-4">{f.departureTime} - {f.arrivalTime} ({f.duration})</td>
                <td className="p-4 font-bold text-brand-blue">₹{f.classes?.[0]?.fare || 3500}</td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDeleteFlight(f._id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
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

export default AdminFlights;
