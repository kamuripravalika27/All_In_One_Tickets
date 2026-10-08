import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import TicketCard from '../components/TicketCard';
import FilterSidebar from '../components/FilterSidebar';
import LoadingSkeleton from '../components/LoadingSkeleton';
import SearchForm from '../components/SearchForm';
import { Train, Filter, AlertTriangle, RefreshCw } from 'lucide-react';

const TrainSearchPage = () => {
  const [searchParams] = useSearchParams();
  const from = searchParams.get('from') || 'Hyderabad';
  const to = searchParams.get('to') || 'Vijayawada';
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [filters, setFilters] = useState({
    maxPrice: 5000,
    travelClass: '',
    timeSlot: ''
  });
  const [sortOption, setSortOption] = useState('price_asc');

  const fetchTrains = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/trains/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${date}`);
      if (res.success) {
        setTrains(res.trains);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch train schedules.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrains();
  }, [from, to, date]);

  // Apply filters and sorting
  let filteredTrains = trains.filter(t => {
    if (filters.travelClass) {
      const hasClass = t.classes?.some(c => c.code === filters.travelClass);
      if (!hasClass) return false;
    }
    const minFare = Math.min(...(t.classes?.map(c => c.fare) || [t.fare || 0]));
    if (minFare > filters.maxPrice) return false;
    return true;
  });

  if (sortOption === 'price_asc') {
    filteredTrains.sort((a, b) => (a.classes?.[0]?.fare || 0) - (b.classes?.[0]?.fare || 0));
  } else if (sortOption === 'price_desc') {
    filteredTrains.sort((a, b) => (b.classes?.[0]?.fare || 0) - (a.classes?.[0]?.fare || 0));
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Search Header Bar */}
      <div className="bg-brand-navy text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-sky font-bold text-xs uppercase tracking-wider">
            <Train className="w-4 h-4" /> Train Search Results
          </div>
          <h1 className="text-2xl font-black mt-1">
            {from} to {to}
          </h1>
          <p className="text-xs text-slate-300">Journey Date: {date} • Showing {filteredTrains.length} trains</p>
        </div>

        <button
          onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          className="md:hidden px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2"
        >
          <Filter className="w-4 h-4 text-brand-sky" /> Filters & Sort
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block lg:col-span-4 sticky top-24">
          <FilterSidebar
            filters={filters}
            onFilterChange={setFilters}
            sortOption={sortOption}
            onSortChange={setSortOption}
            onResetFilters={() => setFilters({ maxPrice: 5000, travelClass: '', timeSlot: '' })}
            type="train"
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
              <button onClick={fetchTrains} className="px-6 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs">
                Retry Search
              </button>
            </div>
          ) : filteredTrains.length === 0 ? (
            <div className="bg-white border border-slate-200 p-12 rounded-3xl text-center space-y-4 shadow-sm">
              <Train className="w-16 h-16 text-slate-300 mx-auto" />
              <h3 className="text-xl font-black text-slate-900">No Trains Found for this Route</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto">
                No direct train services matching your criteria between {from} and {to}. Try resetting your filters or selecting a different date.
              </p>
              <button
                onClick={() => setFilters({ maxPrice: 5000, travelClass: '', timeSlot: '' })}
                className="px-6 py-2.5 rounded-xl bg-brand-sky text-white font-bold text-xs"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredTrains.map((train) => (
              <TicketCard key={train._id} transport={train} type="train" />
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default TrainSearchPage;
