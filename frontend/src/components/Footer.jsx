import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Shield, HeartHandshake, PhoneCall, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-brand-navy border-t border-slate-800 text-slate-300 pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-sky to-blue-600 flex items-center justify-center">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">One<span className="text-brand-sky">Trip</span></span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              OneTrip is India's all-in-one travel booking platform. Book Trains, Flights, and Buses seamlessly with instant seat selection, live pricing, and 24x7 customer support.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> 100% Secure Checkout
              </span>
              <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 text-xs font-bold border border-sky-500/30 flex items-center gap-1.5">
                <HeartHandshake className="w-3.5 h-3.5" /> Instant Confirmation
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Book Transport</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/search/trains" className="hover:text-brand-sky transition-colors">IRCTC Train Booking</Link>
              </li>
              <li>
                <Link to="/search/flights" className="hover:text-brand-sky transition-colors">Domestic Flights</Link>
              </li>
              <li>
                <Link to="/search/buses" className="hover:text-brand-sky transition-colors">Volvo & AC Bus Tickets</Link>
              </li>
              <li>
                <Link to="/search/trains?class=1AC" className="hover:text-brand-sky transition-colors">Vande Bharat Express</Link>
              </li>
            </ul>
          </div>

          {/* Top Indian Routes */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Popular Routes</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/search/trains?from=Hyderabad&to=Vijayawada" className="hover:text-brand-sky transition-colors">Hyderabad to Vijayawada</Link>
              </li>
              <li>
                <Link to="/search/flights?from=Delhi&to=Mumbai" className="hover:text-brand-sky transition-colors">Delhi to Mumbai Flights</Link>
              </li>
              <li>
                <Link to="/search/buses?from=Bengaluru&to=Hyderabad" className="hover:text-brand-sky transition-colors">Bengaluru to Hyderabad Bus</Link>
              </li>
              <li>
                <Link to="/search/trains?from=Tirupati&to=Hyderabad" className="hover:text-brand-sky transition-colors">Tirupati to Hyderabad Train</Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Help & Support</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-slate-400">
                <Mail className="w-4 h-4 text-brand-sky" />
                <span>support@onetrip-demo.com</span>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <PhoneCall className="w-4 h-4 text-brand-sky" />
                <span>24x7 Customer Helpdesk</span>
              </li>
              <li className="flex items-start gap-2 text-slate-400">
                <MapPin className="w-4 h-4 text-brand-sky shrink-0 mt-0.5" />
                <span>Hitec City, Hyderabad 500081</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Demo Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} OneTrip Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 text-amber-300 text-center md:text-right">
            ⚠️ <strong>Demo Application Notice:</strong> Reservations generated on OneTrip are simulated demo bookings for testing purposes.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
