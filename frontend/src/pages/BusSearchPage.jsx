import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import TicketCard from '../components/TicketCard';
import FilterSidebar from '../components/FilterSidebar';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { Bus, Filter, AlertTriangle } from 'lucide-react';

const BusSearchPage = () => {
  const [searchParams] = useSearchParams();
  const from = searchParams.get('from') || 'Hyderabad';
  const to = searchParams.get('to') || 'Vijayawada';
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState({
    maxPrice: 3000,
    busType: '',
    timeSlot: ''
  });
  const [sortOption, setSortOption] = useState('price_asc');

  const fetchBuses = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/buses/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${date}`);
      if (res.success) {
        setBuses(res.buses || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch bus schedules.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, [from, to, date]);

  let filteredBuses = buses.filter(b => {
    if (filters.busType && !b.busType.toLowerCase().includes(filters.busType.toLowerCase())) {
      return false;
    }
    if (b.fare > filters.maxPrice) return false;
    return true;
  });

  if (sortOption === 'price_asc') {
    filteredBuses.sort((a, b) => a.fare - b.fare);
  } else if (sortOption === 'price_desc') {
    filteredBuses.sort((a, b) => b.fare - a.fare);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-brand-navy text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <Bus className="w-4 h-4" /> Bus Search Results
          </div>
          <h1 className="text-2xl font-black mt-1">
            {from} to {to}
          </h1>
          <p className="text-xs text-slate-300">Date: {date} • {filteredBuses.length} Bus Services</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sidebar Filters */}
        <div className="hidden lg:block lg:col-span-4 sticky top-24">
          <FilterSidebar
            filters={filters}
            onFilterChange={setFilters}
            sortOption={sortOption}
            onSortChange={setSortOption}
            onResetFilters={() => setFilters({ maxPrice: 3000, busType: '', timeSlot: '' })}
            type="bus"
          />
        </div>

        {/* Results List */}
        <div className="lg:col-span-8 space-y-6">
          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <div className="bg-rose-50 border border-rose-200 p-8 rounded-3xl text-center space-y-4">
              <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
              <p className="text-rose-800 font-bold">{error}</p>
            </div>
          ) : filteredBuses.length === 0 ? (
            <div className="bg-white border border-slate-200 p-12 rounded-3xl text-center space-y-4 shadow-sm">
              <Bus className="w-16 h-16 text-slate-300 mx-auto" />
              <h3 className="text-xl font-black text-slate-900">No Bus Services Found</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto">
                No direct buses found for {from} to {to}.
              </p>
            </div>
          ) : (
            filteredBuses.map((bus) => (
              <TicketCard key={bus._id} transport={bus} type="bus" />
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default BusSearchPage;
