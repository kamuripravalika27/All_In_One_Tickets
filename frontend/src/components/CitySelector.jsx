import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Building2, ChevronDown } from 'lucide-react';

const CITIES = [
  { code: 'HYD', name: 'Hyderabad', state: 'Telangana', sub: 'Rajiv Gandhi Intl / Secunderabad (SC)' },
  { code: 'BGA', name: 'Bengaluru', state: 'Karnataka', sub: 'Kempegowda Intl / KSR City (SBC)' },
  { code: 'BZA', name: 'Vijayawada', state: 'Andhra Pradesh', sub: 'Vijayawada Intl / Vijayawada Jn (BZA)' },
  { code: 'MAA', name: 'Chennai', state: 'Tamil Nadu', sub: 'Chennai Intl / Central (MAS)' },
  { code: 'BOM', name: 'Mumbai', state: 'Maharashtra', sub: 'Chhatrapati Shivaji Intl / CSMT' },
  { code: 'DEL', name: 'Delhi', state: 'Delhi', sub: 'Indira Gandhi Intl / New Delhi (NDLS)' },
  { code: 'VTZ', name: 'Visakhapatnam', state: 'Andhra Pradesh', sub: 'Visakhapatnam Intl / VSKP' },
  { code: 'PUN', name: 'Pune', state: 'Maharashtra', sub: 'Pune Intl / Pune Jn (PUNE)' },
  { code: 'TPTY', name: 'Tirupati', state: 'Andhra Pradesh', sub: 'Tirupati Intl / Tirupati Main' },
  { code: 'CCU', name: 'Kolkata', state: 'West Bengal', sub: 'Netaji Subhash Intl / Howrah (HWH)' }
];

const CitySelector = ({ label, value, onChange, placeholder = 'Select City' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedCityObj = CITIES.find(c => c.name.toLowerCase() === (value || '').toLowerCase());

  const filteredCities = CITIES.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full" ref={wrapperRef}>
      {label && <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</label>}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-slate-200 hover:border-brand-sky rounded-xl px-3.5 py-3 flex items-center justify-between cursor-pointer shadow-sm transition-all"
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-sky-50 text-brand-sky flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="truncate">
            {selectedCityObj ? (
              <div>
                <span className="font-bold text-slate-900 text-base">{selectedCityObj.name}</span>
                <span className="ml-2 text-xs font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">{selectedCityObj.code}</span>
              </div>
            ) : (
              <span className="text-slate-400 font-medium text-sm">{placeholder}</span>
            )}
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 p-2 max-h-72 overflow-y-auto">
          <input
            type="text"
            placeholder="Search city or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg mb-2 focus:outline-none focus:border-brand-sky"
            autoFocus
          />
          <div className="space-y-1">
            {filteredCities.map((city) => (
              <div
                key={city.code}
                onClick={() => {
                  onChange(city.name);
                  setIsOpen(false);
                  setSearchTerm('');
                }}
                className={`p-2.5 rounded-xl cursor-pointer flex items-center justify-between transition-colors ${
                  value === city.name ? 'bg-sky-50 border border-brand-sky/30' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{city.name}, <span className="text-slate-500 font-normal">{city.state}</span></p>
                    <p className="text-[11px] text-slate-400 truncate max-w-[200px]">{city.sub}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-brand-sky bg-sky-100 px-2 py-0.5 rounded">{city.code}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CitySelector;
