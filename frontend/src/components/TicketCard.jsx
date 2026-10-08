import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { 
  Train, 
  Plane, 
  Bus, 
  Clock, 
  Luggage, 
  Star, 
  ShieldCheck, 
  ChevronRight, 
  Info,
  CheckCircle2
} from 'lucide-react';

const TicketCard = ({ transport, type }) => {
  const navigate = useNavigate();
  const { setSelectedTransport, updateSearchQuery } = useBooking();
  const [selectedClass, setSelectedClass] = useState(
    type === 'train' ? transport.classes?.[0]?.code : type === 'flight' ? transport.classes?.[0]?.className : null
  );

  const handleBook = () => {
    setSelectedTransport({ ...transport, selectedClass });
    if (type === 'bus') {
      navigate(`/bus/${transport._id}/select-seats`);
    } else if (type === 'train') {
      navigate(`/train/${transport._id}/details`);
    } else {
      navigate(`/flight/${transport._id}/details`);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card hover:shadow-xl transition-all duration-300 relative group overflow-hidden">
      
      {/* Top Banner Info */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          {type === 'train' && (
            <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold flex items-center gap-1">
              <Train className="w-3.5 h-3.5" /> Superfast Express #{transport.trainNumber}
            </span>
          )}
          {type === 'flight' && (
            <span className="px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold flex items-center gap-1">
              <Plane className="w-3.5 h-3.5" /> {transport.airlineName} ({transport.flightNumber})
            </span>
          )}
          {type === 'bus' && (
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1">
              <Bus className="w-3.5 h-3.5" /> {transport.operatorName}
            </span>
          )}

          {transport.rating && (
            <span className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded">
              <Star className="w-3.5 h-3.5 fill-amber-400" /> {transport.rating}
            </span>
          )}
        </div>

        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
          <ShieldCheck className="w-4 h-4 text-emerald-500" /> Demo Guaranteed Seat
        </span>
      </div>

      {/* Main Schedule & Route Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Title & Timing Info */}
        <div className="md:col-span-7 space-y-3">
          <div>
            <h4 className="text-xl font-black text-slate-900 group-hover:text-brand-sky transition-colors">
              {type === 'train' ? transport.trainName : type === 'flight' ? `${transport.airlineName} Flight` : transport.busType}
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              Runs on: {transport.runningDays?.join(', ') || 'Daily'}
            </p>
          </div>

          {/* Time & Duration Graph */}
          <div className="flex items-center justify-between gap-4 max-w-md bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div>
              <p className="text-lg font-black text-slate-900">{transport.departureTime}</p>
              <p className="text-xs text-slate-500 font-semibold truncate max-w-[120px]">
                {transport.sourceStation || transport.sourceAirport || transport.sourceCity}
              </p>
            </div>

            <div className="flex-1 flex flex-col items-center">
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {transport.duration}
              </span>
              <div className="w-full flex items-center my-1">
                <div className="h-2 w-2 rounded-full bg-brand-sky"></div>
                <div className="h-0.5 flex-1 bg-slate-300"></div>
                <div className="h-2 w-2 rounded-full bg-brand-blue"></div>
              </div>
              <span className="text-[10px] text-emerald-600 font-bold">
                {type === 'flight' ? (transport.stops === 0 ? 'Non-Stop' : `${transport.stops} Stop`) : 'Direct'}
              </span>
            </div>

            <div className="text-right">
              <p className="text-lg font-black text-slate-900">{transport.arrivalTime}</p>
              <p className="text-xs text-slate-500 font-semibold truncate max-w-[120px]">
                {transport.arrivalStation || transport.destinationAirport || transport.destinationCity}
              </p>
            </div>
          </div>
        </div>

        {/* Classes & Pricing Side */}
        <div className="md:col-span-5 flex flex-col justify-between h-full space-y-4">
          
          {/* Class Options (For Train or Flight) */}
          {type === 'train' && transport.classes && (
            <div className="flex flex-wrap gap-1.5">
              {transport.classes.map((c) => (
                <button
                  key={c.code}
                  onClick={() => setSelectedClass(c.code)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    selectedClass === c.code
                      ? 'bg-brand-navy text-white border-brand-navy shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {c.code}: ₹{c.fare}
                </button>
              ))}
            </div>
          )}

          {type === 'flight' && transport.classes && (
            <div className="flex flex-wrap gap-1.5">
              {transport.classes.map((c) => (
                <button
                  key={c.className}
                  onClick={() => setSelectedClass(c.className)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    selectedClass === c.className
                      ? 'bg-brand-navy text-white border-brand-navy shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {c.className}: ₹{c.fare}
                </button>
              ))}
            </div>
          )}

          {/* Pricing & CTA */}
          <div className="flex items-center justify-between gap-4 pt-2">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Starting From</p>
              <p className="text-2xl font-black text-brand-blue">
                ₹{type === 'train'
                  ? (transport.classes?.find(c => c.code === selectedClass)?.fare || transport.classes?.[0]?.fare)
                  : type === 'flight'
                  ? (transport.classes?.find(c => c.className === selectedClass)?.fare || transport.classes?.[0]?.fare)
                  : transport.fare}
              </p>
            </div>

            <button
              onClick={handleBook}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-sky to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-sm shadow-md hover:shadow-glow flex items-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>{type === 'bus' ? 'Select Seats' : 'Book Now'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

export default TicketCard;
