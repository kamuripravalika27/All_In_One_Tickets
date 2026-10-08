import React from 'react';
import { SlidersHorizontal, ArrowUpDown, RefreshCw, Sun, Sunset, Moon, Sunrise } from 'lucide-react';

const FilterSidebar = ({
  filters,
  onFilterChange,
  sortOption,
  onSortChange,
  onResetFilters,
  type = 'train'
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <h3 className="font-extrabold text-slate-900 flex items-center gap-2 text-base">
          <SlidersHorizontal className="w-4 h-4 text-brand-sky" /> Filters & Sorting
        </h3>
        <button
          onClick={onResetFilters}
          className="text-xs font-bold text-brand-sky hover:text-blue-700 flex items-center gap-1"
        >
          <RefreshCw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Sorting Dropdown */}
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
          <ArrowUpDown className="w-3.5 h-3.5 text-brand-sky" /> Sort Results By
        </label>
        <select
          value={sortOption}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none"
        >
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="duration_asc">Shortest Duration</option>
          <option value="departure_asc">Earliest Departure</option>
        </select>
      </div>

      {/* Price Range */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Max Price</label>
          <span className="text-sm font-black text-brand-blue">₹{filters.maxPrice || 5000}</span>
        </div>
        <input
          type="range"
          min="300"
          max="8000"
          step="100"
          value={filters.maxPrice || 5000}
          onChange={(e) => onFilterChange({ ...filters, maxPrice: Number(e.target.value) })}
          className="w-full accent-brand-sky cursor-pointer"
        />
      </div>

      {/* Departure Time Slots */}
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Departure Time</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'morning', label: 'Morning (6am - 12pm)', icon: Sun },
            { id: 'afternoon', label: 'Afternoon (12pm - 6pm)', icon: Sunset },
            { id: 'night', label: 'Night (6pm - 12am)', icon: Moon },
            { id: 'early', label: 'Early (12am - 6am)', icon: Sunrise }
          ].map(slot => {
            const Icon = slot.icon;
            const isSelected = filters.timeSlot === slot.id;
            return (
              <button
                key={slot.id}
                onClick={() => onFilterChange({ ...filters, timeSlot: isSelected ? '' : slot.id })}
                className={`p-2 rounded-xl text-left border transition-all ${
                  isSelected
                    ? 'bg-sky-50 border-brand-sky text-brand-sky font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 text-xs'
                }`}
              >
                <Icon className="w-4 h-4 mb-1" />
                <span className="text-[11px] block leading-tight">{slot.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Travel Class Filter */}
      {type === 'train' && (
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Travel Class</label>
          <div className="flex flex-wrap gap-2">
            {['1AC', '2AC', '3AC', 'SL', 'CC'].map(code => (
              <button
                key={code}
                onClick={() => onFilterChange({ ...filters, travelClass: filters.travelClass === code ? '' : code })}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  filters.travelClass === code
                    ? 'bg-brand-navy text-white border-brand-navy'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {code}
              </button>
            ))}
          </div>
        </div>
      )}

      {type === 'flight' && (
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Airline</label>
          <select
            value={filters.airline || ''}
            onChange={(e) => onFilterChange({ ...filters, airline: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800"
          >
            <option value="">All Airlines</option>
            <option value="IndiGo">IndiGo</option>
            <option value="Vistara">Vistara</option>
            <option value="Air India">Air India</option>
            <option value="Akasa Air">Akasa Air</option>
          </select>
        </div>
      )}

      {type === 'bus' && (
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Bus Type</label>
          <select
            value={filters.busType || ''}
            onChange={(e) => onFilterChange({ ...filters, busType: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800"
          >
            <option value="">All Types</option>
            <option value="Volvo">Volvo AC Multi-Axle</option>
            <option value="AC Sleeper">AC Sleeper</option>
            <option value="AC Seater">AC Seater</option>
          </select>
        </div>
      )}

    </div>
  );
};

export default FilterSidebar;
