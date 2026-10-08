import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useBooking } from '../context/BookingContext';
import { Plane, ShieldCheck, Luggage, ArrowRight, ArrowLeft } from 'lucide-react';

const FlightDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setSelectedTransport } = useBooking();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState('Economy');

  useEffect(() => {
    const fetchFlight = async () => {
      try {
        const res = await api.get(`/flights/${id}`);
        if (res.success) {
          setFlight(res.flight);
          if (res.flight.classes?.[0]) {
            setSelectedClass(res.flight.classes[0].className);
          }
        }
      } catch (err) {
        console.error('Error fetching flight:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFlight();
  }, [id]);

  const handleProceed = () => {
    const chosenClassObj = flight.classes.find(c => c.className === selectedClass) || flight.classes[0];
    setSelectedTransport({
      ...flight,
      transportType: 'flight',
      selectedClass: chosenClassObj.className,
      fare: chosenClassObj.fare,
      baggage: chosenClassObj.baggageAllowance
    });
    navigate('/passenger-details');
  };

  if (loading || !flight) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-sky border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm font-bold text-slate-600">
        <ArrowLeft className="w-4 h-4" /> Back to Flights
      </button>

      <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold">
              {flight.airlineName} ({flight.flightNumber})
            </span>
            <h2 className="text-3xl font-black text-slate-900 mt-2">{flight.sourceCity} to {flight.destinationCity}</h2>
          </div>
          <Plane className="w-10 h-10 text-brand-sky" />
        </div>

        <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl text-center">
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase">Departure</p>
            <p className="text-xl font-black text-slate-900">{flight.departureTime}</p>
            <p className="text-xs font-semibold text-slate-600">{flight.sourceAirport}</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="text-xs text-slate-400 font-bold">{flight.duration}</span>
            <ArrowRight className="w-6 h-6 text-brand-sky my-1" />
            <span className="text-[10px] text-emerald-600 font-bold">Non-Stop</span>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase">Arrival</p>
            <p className="text-xl font-black text-slate-900">{flight.arrivalTime}</p>
            <p className="text-xs font-semibold text-slate-600">{flight.destinationAirport}</p>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase text-slate-500 mb-3">Cabin & Fare Class</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {flight.classes?.map((c) => (
              <button
                key={c.className}
                onClick={() => setSelectedClass(c.className)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedClass === c.className
                    ? 'bg-brand-navy text-white border-brand-navy shadow-lg font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                }`}
              >
                <p className="text-sm font-black">{c.className}</p>
                <p className="text-xl font-black text-brand-sky mt-1">₹{c.fare}</p>
                <p className="text-[11px] opacity-80 mt-1 flex items-center gap-1">
                  <Luggage className="w-3.5 h-3.5" /> {c.baggageAllowance}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t flex justify-end">
          <button
            onClick={handleProceed}
            className="px-8 py-3.5 bg-gradient-to-r from-brand-sky to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-glow"
          >
            Proceed to Passenger Information
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlightDetailsPage;
