import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Bus, Trash2 } from 'lucide-react';

const AdminBuses = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBuses = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/buses');
      if (res.success) setBuses(res.buses);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  const handleDeleteBus = async (id) => {
    if (!window.confirm('Delete this bus service?')) return;
    try {
      const res = await api.delete(`/admin/buses/${id}`);
      if (res.success) fetchBuses();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Bus className="w-6 h-6 text-emerald-500" /> Manage Bus Services
          </h1>
          <p className="text-xs text-slate-500">Volvo, AC Sleeper & Seater operators and seat inventories.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-700 text-xs uppercase font-bold">
            <tr>
              <th className="p-4">Bus # / Operator</th>
              <th className="p-4">Bus Type</th>
              <th className="p-4">Route</th>
              <th className="p-4">Fare</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
            {buses.map((b) => (
              <tr key={b._id} className="hover:bg-slate-50">
                <td className="p-4">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">{b.busNumber}</span>
                  <p className="font-bold text-slate-900">{b.operatorName}</p>
                </td>
                <td className="p-4 text-xs font-bold">{b.busType}</td>
                <td className="p-4">{b.sourceCity} → {b.destinationCity}</td>
                <td className="p-4 font-bold text-brand-blue">₹{b.fare}</td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDeleteBus(b._id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg">
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

export default AdminBuses;
