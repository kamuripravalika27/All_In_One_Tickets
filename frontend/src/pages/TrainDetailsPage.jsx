import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useBooking } from '../context/BookingContext';
import { Train, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';

const TrainDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setSelectedTransport, searchQuery } = useBooking();
  const [train, setTrain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState('3AC');

  useEffect(() => {
    const fetchTrain = async () => {
      try {
        const res = await api.get(`/trains/${id}`);
        if (res.success) {
          setTrain(res.train);
          if (res.train.classes?.[0]) {
            setSelectedClass(res.train.classes[0].code);
          }
        }
      } catch (err) {
        console.error('Error fetching train:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTrain();
  }, [id]);

  const handleProceed = () => {
    const chosenClassObj = train.classes.find(c => c.code === selectedClass) || train.classes[0];
    setSelectedTransport({
      ...train,
      transportType: 'train',
      selectedClass: chosenClassObj.className,
      selectedClassCode: chosenClassObj.code,
      fare: chosenClassObj.fare
    });
    navigate('/passenger-details');
  };

  if (loading || !train) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-sky border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm font-bold text-slate-600">
        <ArrowLeft className="w-4 h-4" /> Back to Trains
      </button>

      <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
              IRCTC Train Service #{train.trainNumber}
            </span>
            <h2 className="text-3xl font-black text-slate-900 mt-2">{train.trainName}</h2>
          </div>
          <ShieldCheck className="w-10 h-10 text-emerald-500" />
        </div>

        <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl text-center">
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase">Departure</p>
            <p className="text-xl font-black text-slate-900">{train.departureTime}</p>
            <p className="text-xs font-semibold text-slate-600">{train.departureStation}</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="text-xs text-slate-400 font-bold">{train.duration}</span>
            <ArrowRight className="w-6 h-6 text-brand-sky my-1" />
            <span className="text-[10px] text-emerald-600 font-bold">Daily Service</span>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase">Arrival</p>
            <p className="text-xl font-black text-slate-900">{train.arrivalTime}</p>
            <p className="text-xs font-semibold text-slate-600">{train.arrivalStation}</p>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase text-slate-500 mb-3">Choose Travel Quota / Class</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {train.classes?.map((c) => (
              <button
                key={c.code}
                onClick={() => setSelectedClass(c.code)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedClass === c.code
                    ? 'bg-brand-navy text-white border-brand-navy shadow-lg font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                }`}
              >
                <p className="text-sm font-black">{c.className}</p>
                <p className="text-xl font-black text-brand-sky mt-1">₹{c.fare}</p>
                <p className="text-[10px] opacity-80 mt-1">Seats: {c.seatsAvailable} (Available)</p>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t flex justify-end">
          <button
            onClick={handleProceed}
            className="px-8 py-3.5 bg-gradient-to-r from-brand-sky to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-glow"
          >
            Proceed to Passenger Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrainDetailsPage;
