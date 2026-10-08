import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchForm from '../components/SearchForm';
import api from '../services/api';
import { 
  Train, 
  Plane, 
  Bus, 
  ShieldCheck, 
  Sparkles, 
  Tag, 
  Check, 
  Star, 
  ArrowRight,
  Headphones,
  Clock,
  Ticket
} from 'lucide-react';

const POPULAR_DESTINATIONS = [
  {
    city: 'Hyderabad',
    code: 'HYD',
    image: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?w=600&auto=format&fit=crop&q=80',
    tag: 'City of Pearls',
    startsFrom: '₹480'
  },
  {
    city: 'Bengaluru',
    code: 'BLR',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&auto=format&fit=crop&q=80',
    tag: 'Silicon Valley',
    startsFrom: '₹650'
  },
  {
    city: 'Vijayawada',
    code: 'BZA',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&auto=format&fit=crop&q=80',
    tag: 'Prakasam Barrage',
    startsFrom: '₹210'
  },
  {
    city: 'Mumbai',
    code: 'BOM',
    image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=600&auto=format&fit=crop&q=80',
    tag: 'Financial Capital',
    startsFrom: '₹890'
  },
  {
    city: 'Chennai',
    code: 'MAA',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&auto=format&fit=crop&q=80',
    tag: 'Marina Gateway',
    startsFrom: '₹430'
  },
  {
    city: 'Tirupati',
    code: 'TPTY',
    image: 'https://images.unsplash.com/photo-1600100397608-f010e423b971?w=600&auto=format&fit=crop&q=80',
    tag: 'Spiritual Hub',
    startsFrom: '₹550'
  }
];

const HomePage = () => {
  const [coupons, setCoupons] = useState([]);
  const [copiedCode, setCopiedCode] = useState('');

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await api.get('/coupons/active');
        if (res.success) {
          setCoupons(res.coupons);
        }
      } catch (err) {
        console.error('Failed to load coupons:', err.message);
      }
    };
    fetchCoupons();
  }, []);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  return (
    <div className="space-y-20 pb-16">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-brand-navy via-slate-900 to-brand-dark pt-12 pb-24 px-4 overflow-hidden text-white">
        
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.15),transparent_50%)] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-brand-sky text-xs font-bold shadow-md">
            <Sparkles className="w-4 h-4" /> India's Premier All-in-One Booking Platform
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Your Journey, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-sky via-sky-300 to-blue-400">All in One Place</span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto font-medium">
            Search, compare, and instant-book Trains, Flights, and Buses across Indian cities with guaranteed seat availability and 24x7 support.
          </p>

          {/* Interactive Search Box */}
          <div className="pt-6">
            <SearchForm />
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-sky">Top Routes</span>
            <h2 className="text-3xl font-black text-slate-900">Popular Travel Destinations</h2>
          </div>
          <Link to="/search/trains" className="text-sm font-bold text-brand-sky hover:text-blue-700 flex items-center gap-1">
            Explore All Routes <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {POPULAR_DESTINATIONS.map((dest) => (
            <Link
              key={dest.code}
              to={`/search/trains?from=Hyderabad&to=${dest.city}`}
              className="group relative rounded-3xl overflow-hidden shadow-card hover:shadow-2xl transition-all duration-300 h-64 border border-slate-200"
            >
              <img
                src={dest.image}
                alt={dest.city}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent"></div>
              
              <div className="absolute bottom-0 inset-x-0 p-6 flex justify-between items-end">
                <div>
                  <span className="px-2.5 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-white text-[10px] font-extrabold uppercase">
                    {dest.tag}
                  </span>
                  <h3 className="text-2xl font-black text-white mt-1">{dest.city}</h3>
                  <p className="text-xs text-slate-300">Daily Trains & Flights</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-300 uppercase block font-semibold">Fares from</span>
                  <span className="text-xl font-black text-brand-sky">{dest.startsFrom}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Promotional Coupons */}
      <section className="bg-slate-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Offers & Deals</span>
            <h2 className="text-3xl font-black">Exclusive OneTrip Discounts</h2>
            <p className="text-slate-400 text-sm">Use these promo codes at checkout for instant savings on your travel bookings.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coupons.map((coupon) => (
              <div
                key={coupon._id}
                className="bg-slate-800 border border-slate-700/80 rounded-3xl p-6 relative flex flex-col justify-between shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-extrabold flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" /> PROMO
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">Min ₹{coupon.minBookingAmount}</span>
                  </div>
                  <h3 className="text-xl font-black text-white">{coupon.code}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{coupon.description}</p>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-700 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-bold">
                    {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                  </span>
                  <button
                    onClick={() => handleCopyCode(coupon.code)}
                    className="px-4 py-2 rounded-xl bg-brand-sky hover:bg-sky-400 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    {copiedCode === coupon.code ? (
                      <>
                        <Check className="w-4 h-4 text-white" /> Copied!
                      </>
                    ) : (
                      'Copy Code'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose OneTrip Benefits */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-sky">Why Choose Us</span>
          <h2 className="text-3xl font-black text-slate-900">Built for Modern Travelers</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <Train className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">IRCTC Train Booking</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Check real-time berth availability across 1AC, 2AC, 3AC, Sleeper, and Vande Bharat trains.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto">
              <Plane className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">Instant Flight Deals</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Compare IndiGo, Air India, and Vistara with transparent baggage policy and tax breakdowns.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <Bus className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">Interactive Bus Layout</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Choose your exact upper/lower sleeper seat with live boarding and dropping point selections.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
              <Headphones className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">24x7 Customer Help</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Instant cancellation refund calculations and PDF e-ticket generation anytime.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
