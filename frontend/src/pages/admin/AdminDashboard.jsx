import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { 
  Users, 
  Ticket, 
  Train, 
  Plane, 
  Bus, 
  DollarSign, 
  AlertCircle, 
  Clock, 
  XCircle, 
  ShieldAlert, 
  Tag, 
  Activity, 
  FileText 
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await api.get('/admin/dashboard-stats');
        if (res.success) {
          setStats(res.stats);
          setCharts(res.charts);
        }
      } catch (err) {
        console.error('Error loading dashboard stats:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  const COLORS = ['#F59E0B', '#0EA5E9', '#10B981'];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-sky border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Header */}
      <div className="bg-brand-navy text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40 flex items-center gap-1.5 w-fit">
            <ShieldAlert className="w-3.5 h-3.5" /> Administrator Control Panel
          </span>
          <h1 className="text-3xl font-black mt-2">OneTrip Operations & Metrics</h1>
          <p className="text-xs text-slate-300">Live booking analytics, transport inventory control, and audit monitoring.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link to="/admin/trains" className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold">
            Manage Trains
          </Link>
          <Link to="/admin/flights" className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold">
            Manage Flights
          </Link>
          <Link to="/admin/buses" className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold">
            Manage Buses
          </Link>
          <Link to="/admin/api-status" className="px-4 py-2 rounded-xl bg-brand-sky text-white text-xs font-bold">
            API Status
          </Link>
        </div>
      </div>

      {/* 8 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Total Revenue (Demo)</p>
            <p className="text-2xl font-black text-slate-900 mt-1">₹{stats?.demoRevenue?.toLocaleString() || 0}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Total Bookings</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{stats?.totalBookings || 0}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-brand-sky flex items-center justify-center">
            <Ticket className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Customer Accounts</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{stats?.totalUsers || 0}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Cancellations</p>
            <p className="text-2xl font-black text-rose-600 mt-1">{stats?.cancellations || 0}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <XCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Train Bookings</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{stats?.trainBookings || 0}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Train className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Flight Bookings</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{stats?.flightBookings || 0}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Plane className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Bus Bookings</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{stats?.busBookings || 0}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Bus className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Pending Reservations</p>
            <p className="text-2xl font-black text-amber-600 mt-1">{stats?.pendingBookings || 0}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Revenue Trend Area Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
            <Activity className="w-5 h-5 text-brand-sky" /> Monthly Revenue Trend (₹)
          </h3>
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts?.monthlyData || []}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={12} />
                <YAxis stroke="#64748B" fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#0EA5E9" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transport Share Pie Chart */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <h3 className="font-extrabold text-slate-900 text-lg">Transport Breakdown</h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts?.modeShare || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(charts?.modeShare || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-around text-xs font-bold text-slate-600 border-t pt-3">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500"></span> Train</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-sky-500"></span> Flight</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Bus</span>
          </div>
        </div>

      </div>

      {/* Quick Nav Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link to="/admin/bookings" className="p-4 rounded-2xl bg-slate-900 text-white font-bold text-sm flex items-center justify-between hover:bg-slate-800">
          <span>Manage Bookings</span> <FileText className="w-4 h-4 text-brand-sky" />
        </Link>
        <Link to="/admin/users" className="p-4 rounded-2xl bg-slate-900 text-white font-bold text-sm flex items-center justify-between hover:bg-slate-800">
          <span>Customers List</span> <Users className="w-4 h-4 text-purple-400" />
        </Link>
        <Link to="/admin/coupons" className="p-4 rounded-2xl bg-slate-900 text-white font-bold text-sm flex items-center justify-between hover:bg-slate-800">
          <span>Promo Coupons</span> <Tag className="w-4 h-4 text-amber-400" />
        </Link>
        <Link to="/admin/audit-logs" className="p-4 rounded-2xl bg-slate-900 text-white font-bold text-sm flex items-center justify-between hover:bg-slate-800">
          <span>Audit Logs</span> <Activity className="w-4 h-4 text-emerald-400" />
        </Link>
      </div>

    </div>
  );
};

export default AdminDashboard;
