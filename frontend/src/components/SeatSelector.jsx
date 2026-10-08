import React from 'react';
import { Bus, Check, Info } from 'lucide-react';

const SeatSelector = ({
  seats = [],
  selectedSeats = [],
  onSeatClick,
  bus,
  boardingPoint,
  setBoardingPoint,
  droppingPoint,
  setDroppingPoint,
  onProceed
}) => {
  const lowerDeckSeats = seats.filter(s => s.deck === 'Lower');
  const upperDeckSeats = seats.filter(s => s.deck === 'Upper');

  const totalSelectedPrice = selectedSeats.reduce((sum, seatNo) => {
    const seatObj = seats.find(s => s.seatNo === seatNo);
    return sum + (seatObj ? seatObj.price : (bus?.fare || 0));
  }, 0);

  const isSeatSelected = (seatNo) => selectedSeats.includes(seatNo);

  const getSeatColor = (seat) => {
    if (seat.status === 'booked') return 'bg-slate-300 border-slate-400 text-slate-500 cursor-not-allowed';
    if (isSeatSelected(seat.seatNo)) return 'bg-brand-sky border-sky-400 text-white shadow-glow font-extrabold scale-105';
    return 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100 cursor-pointer font-bold';
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Bus className="w-6 h-6 text-brand-sky" /> Select Your Seats
          </h3>
          <p className="text-xs text-slate-500 font-medium">{bus?.operatorName} • {bus?.busType}</p>
        </div>
        
        {/* Seat Legend */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-emerald-100 border border-emerald-400"></span> Available
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-brand-sky"></span> Selected
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-slate-300"></span> Booked
          </div>
        </div>
      </div>

      {/* Seat Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-6">
        
        {/* Lower Deck */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 bg-slate-200 px-3 py-1 rounded-full">
              Lower Deck
            </span>
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
              🛞 Steering
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {lowerDeckSeats.map((seat) => (
              <button
                key={seat.seatNo}
                disabled={seat.status === 'booked'}
                onClick={() => onSeatClick(seat.seatNo)}
                className={`h-14 rounded-xl border flex flex-col items-center justify-center transition-all p-1 text-xs ${getSeatColor(seat)}`}
              >
                <span>{seat.seatNo}</span>
                <span className="text-[10px] opacity-80">₹{seat.price}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Upper Deck */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 bg-slate-200 px-3 py-1 rounded-full">
              Upper Deck
            </span>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {upperDeckSeats.map((seat) => (
              <button
                key={seat.seatNo}
                disabled={seat.status === 'booked'}
                onClick={() => onSeatClick(seat.seatNo)}
                className={`h-14 rounded-xl border flex flex-col items-center justify-center transition-all p-1 text-xs ${getSeatColor(seat)}`}
              >
                <span>{seat.seatNo}</span>
                <span className="text-[10px] opacity-80">₹{seat.price}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Boarding and Dropping Points Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 border-t border-slate-100">
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Boarding Point</label>
          <select
            value={boardingPoint}
            onChange={(e) => setBoardingPoint(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800"
          >
            <option value="">-- Select Boarding Station --</option>
            {bus?.boardingPoints?.map((bp, idx) => (
              <option key={idx} value={`${bp.station} (${bp.time})`}>
                {bp.station} - {bp.time}
              </option>
            )) || <option value={bus?.sourceCity}>{bus?.sourceCity} Main Stand</option>}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Dropping Point</label>
          <select
            value={droppingPoint}
            onChange={(e) => setDroppingPoint(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800"
          >
            <option value="">-- Select Dropping Station --</option>
            {bus?.droppingPoints?.map((dp, idx) => (
              <option key={idx} value={`${dp.station} (${dp.time})`}>
                {dp.station} - {dp.time}
              </option>
            )) || <option value={bus?.destinationCity}>{bus?.destinationCity} Main Stand</option>}
          </select>
        </div>
      </div>

      {/* Bottom Summary Bar */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-xs text-slate-500 font-semibold">Selected Seats ({selectedSeats.length})</p>
          <p className="text-base font-black text-slate-900">
            {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None selected'}
          </p>
        </div>

        <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
          <div>
            <p className="text-xs text-slate-500 font-semibold">Total Fare</p>
            <p className="text-2xl font-black text-brand-blue">₹{totalSelectedPrice}</p>
          </div>

          <button
            disabled={selectedSeats.length === 0}
            onClick={onProceed}
            className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all ${
              selectedSeats.length > 0
                ? 'bg-gradient-to-r from-brand-sky to-blue-600 hover:shadow-glow cursor-pointer'
                : 'bg-slate-300 cursor-not-allowed'
            }`}
          >
            Continue Booking
          </button>
        </div>
      </div>

    </div>
  );
};

export default SeatSelector;
