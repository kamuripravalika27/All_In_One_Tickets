import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import CitySelector from './CitySelector';
import TransportTabs from './TransportTabs';
import { ArrowLeftRight, Calendar, Users, Search, AlertCircle } from 'lucide-react';

const SearchForm = () => {
  const navigate = useNavigate();
  const { searchQuery, updateSearchQuery } = useBooking();
  const [errorMsg, setErrorMsg] = useState('');

  const handleSwap = () => {
    updateSearchQuery({
      from: searchQuery.to,
      to: searchQuery.from
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!searchQuery.from || !searchQuery.to) {
      setErrorMsg('Please select both Origin and Destination cities.');
      return;
    }

    if (searchQuery.from.toLowerCase() === searchQuery.to.toLowerCase()) {
      setErrorMsg('Source and Destination cities must be different!');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    if (searchQuery.date < today) {
      setErrorMsg('Departure date cannot be in the past.');
      return;
    }

    if (searchQuery.mode === 'flight' && searchQuery.tripType === 'round') {
      if (!searchQuery.returnDate || searchQuery.returnDate < searchQuery.date) {
        setErrorMsg('Return date must be equal to or after departure date.');
        return;
      }
    }

    // Navigate to respective search results page
    navigate(`/search/${searchQuery.mode}s?from=${encodeURIComponent(searchQuery.from)}&to=${encodeURIComponent(searchQuery.to)}&date=${searchQuery.date}&mode=${searchQuery.mode}`);
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/80 max-w-5xl mx-auto text-slate-800">
      {/* Mode Tabs */}
      <div className="mb-6">
        <TransportTabs
          activeTab={searchQuery.mode}
          onChange={(tab) => updateSearchQuery({ mode: tab })}
        />
      </div>

      {/* Flight Sub-Options (One Way / Round Trip) */}
      {searchQuery.mode === 'flight' && (
        <div className="flex items-center gap-6 mb-6 px-2 text-sm font-semibold text-slate-600">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="tripType"
              checked={searchQuery.tripType === 'oneway'}
              onChange={() => updateSearchQuery({ tripType: 'oneway' })}
              className="text-brand-sky focus:ring-brand-sky"
            />
            One Way
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="tripType"
              checked={searchQuery.tripType === 'round'}
              onChange={() => updateSearchQuery({ tripType: 'round' })}
              className="text-brand-sky focus:ring-brand-sky"
            />
            Round Trip
          </label>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSearch} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* FROM CITY */}
          <div className="md:col-span-4">
            <CitySelector
              label="From"
              value={searchQuery.from}
              onChange={(city) => updateSearchQuery({ from: city })}
            />
          </div>

          {/* SWAP BUTTON */}
          <div className="md:col-span-1 flex items-center justify-center">
            <button
              type="button"
              onClick={handleSwap}
              className="w-10 h-10 rounded-full bg-slate-100 hover:bg-sky-50 text-slate-600 hover:text-brand-sky border border-slate-200 flex items-center justify-center shadow-sm hover:rotate-180 transition-all duration-300"
              title="Swap Cities"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          {/* TO CITY */}
          <div className="md:col-span-4">
            <CitySelector
              label="To"
              value={searchQuery.to}
              onChange={(city) => updateSearchQuery({ to: city })}
            />
          </div>

          {/* PASSENGERS */}
          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Passengers</label>
            <div className="relative">
              <div className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-3 flex items-center gap-2.5">
                <Users className="w-4 h-4 text-brand-sky" />
                <select
                  value={searchQuery.passengersCount}
                  onChange={(e) => updateSearchQuery({ passengersCount: Number(e.target.value) })}
                  className="w-full bg-transparent font-bold text-slate-900 text-sm focus:outline-none cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num} Passenger{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* DEPARTURE DATE */}
          <div className={searchQuery.mode === 'flight' && searchQuery.tripType === 'round' ? 'md:col-span-4' : 'md:col-span-5'}>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Departure Date</label>
            <div className="relative">
              <div className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-3 flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-brand-sky" />
                <input
                  type="date"
                  value={searchQuery.date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => updateSearchQuery({ date: e.target.value })}
                  className="w-full bg-transparent font-bold text-slate-900 text-sm focus:outline-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* RETURN DATE (If Roundtrip Flight) */}
          {searchQuery.mode === 'flight' && searchQuery.tripType === 'round' && (
            <div className="md:col-span-4">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Return Date</label>
              <div className="relative">
                <div className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-3 flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-brand-sky" />
                  <input
                    type="date"
                    value={searchQuery.returnDate || searchQuery.date}
                    min={searchQuery.date}
                    onChange={(e) => updateSearchQuery({ returnDate: e.target.value })}
                    className="w-full bg-transparent font-bold text-slate-900 text-sm focus:outline-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* CLASS SELECTOR */}
          <div className={searchQuery.mode === 'flight' && searchQuery.tripType === 'round' ? 'md:col-span-4' : 'md:col-span-4'}>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Travel Class</label>
            <select
              value={searchQuery.travelClass}
              onChange={(e) => updateSearchQuery({ travelClass: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-3 font-bold text-slate-900 text-sm focus:outline-none cursor-pointer"
            >
              {searchQuery.mode === 'train' && (
                <>
                  <option value="3AC">3rd AC (3AC)</option>
                  <option value="2AC">2nd AC (2AC)</option>
                  <option value="1AC">1st AC (1AC)</option>
                  <option value="SL">Sleeper (SL)</option>
                  <option value="CC">AC Chair Car (CC)</option>
                </>
              )}
              {searchQuery.mode === 'flight' && (
                <>
                  <option value="Economy">Economy Class</option>
                  <option value="Premium Economy">Premium Economy</option>
                  <option value="Business">Business Class</option>
                </>
              )}
              {searchQuery.mode === 'bus' && (
                <>
                  <option value="All">All Bus Types</option>
                  <option value="AC Sleeper">AC Sleeper</option>
                  <option value="AC Seater">AC Seater</option>
                  <option value="Volvo">Volvo Multi-Axle</option>
                </>
              )}
            </select>
          </div>

          {/* SUBMIT BUTTON */}
          <div className={searchQuery.mode === 'flight' && searchQuery.tripType === 'round' ? 'md:col-span-12' : 'md:col-span-3'}>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-brand-sky to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black text-base py-3.5 px-6 rounded-xl shadow-lg hover:shadow-glow flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <Search className="w-5 h-5" />
              <span>Search {searchQuery.mode.toUpperCase()}S</span>
            </button>
          </div>

        </div>
      </form>
    </div>
  );
};

export default SearchForm;
