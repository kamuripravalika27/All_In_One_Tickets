import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Train, 
  Plane, 
  Bus, 
  User, 
  LogOut, 
  ShieldAlert, 
  Ticket, 
  HelpCircle, 
  Menu, 
  X,
  Compass,
  ChevronDown
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-brand-navy border-b border-slate-700/60 shadow-lg text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-sky to-blue-600 flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
              <Compass className="w-7 h-7 text-white animate-pulse-subtle" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-white">One<span className="text-brand-sky">Trip</span></span>
              <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-widest -mt-1">All-in-One Travel</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 bg-slate-800/60 p-1.5 rounded-full border border-slate-700/50">
            <Link
              to="/"
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                isActive('/') ? 'bg-brand-sky text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/search/trains"
              className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition-all ${
                isActive('/search/trains') ? 'bg-brand-sky text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Train className="w-4 h-4 text-amber-400" />
              Trains
            </Link>
            <Link
              to="/search/flights"
              className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition-all ${
                isActive('/search/flights') ? 'bg-brand-sky text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Plane className="w-4 h-4 text-sky-400" />
              Flights
            </Link>
            <Link
              to="/search/buses"
              className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition-all ${
                isActive('/search/buses') ? 'bg-brand-sky text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Bus className="w-4 h-4 text-emerald-400" />
              Buses
            </Link>
            {isAuthenticated && (
              <Link
                to="/my-bookings"
                className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition-all ${
                  isActive('/my-bookings') ? 'bg-brand-sky text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Ticket className="w-4 h-4 text-purple-400" />
                My Bookings
              </Link>
            )}
            <Link
              to="/help"
              className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition-all ${
                isActive('/help') ? 'bg-brand-sky text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-yellow-300" />
              Help
            </Link>
          </div>

          {/* User Right Action Menu */}
          <div className="hidden md:flex items-center gap-3">
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="px-3 py-2 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-500/30 transition-all"
              >
                <ShieldAlert className="w-4 h-4" />
                Admin Dashboard
              </Link>
            )}

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700/80 px-3.5 py-2 rounded-full border border-slate-700 text-sm font-medium transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-brand-sky flex items-center justify-center font-bold text-white text-xs">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate">{user?.name}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-800 hover:text-brand-sky"
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </Link>
                    <Link
                      to="/my-bookings"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-800 hover:text-brand-sky"
                    >
                      <Ticket className="w-4 h-4" />
                      My Bookings
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-amber-400 hover:bg-slate-800"
                      >
                        <ShieldAlert className="w-4 h-4" />
                        Admin Portal
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-400 hover:bg-slate-800 border-t border-slate-800 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-200 hover:text-white transition-all"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-brand-sky to-blue-600 hover:from-sky-400 hover:to-blue-500 rounded-full shadow-md hover:shadow-glow transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-2">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Home
          </Link>
          <Link
            to="/search/trains"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            <Train className="w-5 h-5 text-amber-400" />
            Trains
          </Link>
          <Link
            to="/search/flights"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            <Plane className="w-5 h-5 text-sky-400" />
            Flights
          </Link>
          <Link
            to="/search/buses"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            <Bus className="w-5 h-5 text-emerald-400" />
            Buses
          </Link>
          {isAuthenticated && (
            <Link
              to="/my-bookings"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
            >
              <Ticket className="w-5 h-5 text-purple-400" />
              My Bookings
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/admin/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium text-amber-400 hover:bg-slate-800"
            >
              <ShieldAlert className="w-5 h-5" />
              Admin Portal
            </Link>
          )}

          <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <div className="px-3 py-2 text-sm text-slate-400">Signed in as <span className="text-white font-bold">{user?.email}</span></div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2.5 rounded-xl bg-rose-500/20 text-rose-300 font-bold"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-xl bg-slate-800 text-white font-bold"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-xl bg-brand-sky text-white font-bold"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
