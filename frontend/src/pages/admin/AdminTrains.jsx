import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Train, Plus, Trash2, Edit, CheckCircle2 } from 'lucide-react';

const AdminTrains = () => {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    trainNumber: '',
    trainName: '',
    sourceCity: 'Hyderabad',
    destinationCity: 'Chennai',
    departureStation: 'Secunderabad Junction (SC)',
    arrivalStation: 'Chennai Central (MAS)',
    departureTime: '06:00 PM',
    arrivalTime: '08:15 AM',
    duration: '14h 15m',
    runningDays: ['Daily'],
    classes: [
      { className: '3rd AC', code: '3AC', fare: 1200, seatsAvailable: 50 },
      { className: '2nd AC', code: '2AC', fare: 1800, seatsAvailable: 30 }
    ]
  });

  const fetchTrains = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/trains');
      if (res.success) setTrains(res.trains);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrains();
  }, []);

  const handleCreateTrain = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/trains', form);
      if (res.success) {
        setShowModal(false);
        fetchTrains();
      }
    } catch (err) {
      alert(err.message || 'Failed to create train.');
    }
  };

  const handleDeleteTrain = async (id) => {
    if (!window.confirm('Are you sure you want to delete this train service?')) return;
    try {
      const res = await api.delete(`/admin/trains/${id}`);
      if (res.success) fetchTrains();
    } catch (err) {
      alert(err.message || 'Failed to delete train.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Train className="w-6 h-6 text-amber-500" /> Manage IRCTC Train Services
          </h1>
          <p className="text-xs text-slate-500">Add, edit, or delete train schedules and fares across Indian cities.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-brand-sky text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
        >
          <Plus className="w-4 h-4" /> Add New Train Service
        </button>
      </div>

      {loading ? (
        <div className="min-h-[200px] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-brand-sky border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-700 text-xs uppercase font-bold">
              <tr>
                <th className="p-4">Train # / Name</th>
                <th className="p-4">Route</th>
                <th className="p-4">Timing & Duration</th>
                <th className="p-4">Class Fares</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
              {trains.map((train) => (
                <tr key={train._id} className="hover:bg-slate-50">
                  <td className="p-4">
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">#{train.trainNumber}</span>
                    <p className="font-bold text-slate-900 text-sm">{train.trainName}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-slate-900">{train.sourceCity} → {train.destinationCity}</p>
                    <p className="text-[11px] text-slate-400">{train.departureStation}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-slate-900">{train.departureTime} - {train.arrivalTime}</p>
                    <p className="text-[11px] text-slate-400">{train.duration}</p>
                  </td>
                  <td className="p-4 text-xs">
                    {train.classes?.map(c => `${c.code}: ₹${c.fare}`).join(', ')}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDeleteTrain(train._id)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-xl font-black">Add New Train Service</h3>
            <form onSubmit={handleCreateTrain} className="space-y-3 text-xs">
              <input
                type="text"
                placeholder="Train Number (e.g. 12760)"
                value={form.trainNumber}
                onChange={(e) => setForm({ ...form, trainNumber: e.target.value })}
                className="w-full p-2.5 border rounded-xl"
                required
              />
              <input
                type="text"
                placeholder="Train Name (e.g. Charminar Express)"
                value={form.trainName}
                onChange={(e) => setForm({ ...form, trainName: e.target.value })}
                className="w-full p-2.5 border rounded-xl"
                required
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Source City"
                  value={form.sourceCity}
                  onChange={(e) => setForm({ ...form, sourceCity: e.target.value })}
                  className="p-2.5 border rounded-xl"
                  required
                />
                <input
                  type="text"
                  placeholder="Destination City"
                  value={form.destinationCity}
                  onChange={(e) => setForm({ ...form, destinationCity: e.target.value })}
                  className="p-2.5 border rounded-xl"
                  required
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-brand-sky text-white font-bold"
                >
                  Save Train
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTrains;
