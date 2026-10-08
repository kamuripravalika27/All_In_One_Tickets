import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { ShieldCheck, Cpu, Database, CreditCard, Radio, AlertTriangle } from 'lucide-react';

const AdminApiStatus = () => {
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApiStatus = async () => {
      try {
        const res = await api.get('/admin/api-status');
        if (res.success) setStatusData(res.apiStatus);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApiStatus();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-sky border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      <div className="bg-brand-navy text-white p-8 rounded-3xl shadow-xl flex items-center justify-between">
        <div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40 inline-flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5" /> API Service Architecture Monitor
          </span>
          <h1 className="text-3xl font-black mt-2">API Provider Status</h1>
          <p className="text-xs text-slate-300">Provider adapters & external payment gateway status.</p>
        </div>
        <ShieldCheck className="w-12 h-12 text-brand-sky" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Transport Provider */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase">Transport Engine</p>
          <h3 className="text-xl font-black text-slate-900">{statusData?.transportProvider?.providerName}</h3>
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            {statusData?.transportProvider?.status}
          </span>
          <p className="text-xs text-slate-500">{statusData?.transportProvider?.message}</p>
        </div>

        {/* Payment Gateway */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase">Payment Gateway</p>
          <h3 className="text-xl font-black text-slate-900">{statusData?.paymentGateway?.name}</h3>
          <span className="inline-block px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold">
            {statusData?.paymentGateway?.mode}
          </span>
          <p className="text-xs text-slate-500">
            {statusData?.paymentGateway?.isConfigured ? 'Razorpay keys loaded from .env' : 'Running in Zero-Config Demo Payment Mode'}
          </p>
        </div>

        {/* Database Status */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase">Database Server</p>
          <h3 className="text-xl font-black text-slate-900">{statusData?.database?.name}</h3>
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            STATUS: {statusData?.database?.status}
          </span>
          <p className="text-xs text-slate-500">Mongoose models with full schema indexing.</p>
        </div>

      </div>

      {/* Guide to Switching to Real APIs */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl space-y-4">
        <h3 className="text-lg font-black text-brand-sky flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" /> Provider Adapter Extension Guide
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          OneTrip is structured with modular service adapters in <code className="bg-slate-800 px-2 py-0.5 rounded text-amber-300">backend/src/adapters/</code>.
          To switch from Demo Data to authorized real IRCTC or flight GDS APIs:
        </p>
        <ol className="list-decimal list-inside text-xs text-slate-300 space-y-1 pl-2">
          <li>Create a new class inheriting from <code className="text-sky-300">BaseTransportAdapter</code> in <code className="text-amber-300">backend/src/adapters/realProvider.js</code>.</li>
          <li>Implement <code className="text-sky-300">searchTrains()</code>, <code className="text-sky-300">searchFlights()</code>, and <code className="text-sky-300">searchBuses()</code> with authorized GDS API endpoints.</li>
          <li>Set <code className="text-amber-300">RAZORPAY_KEY_ID</code> and <code className="text-amber-300">RAZORPAY_KEY_SECRET</code> in <code className="text-amber-300">backend/.env</code> for live Razorpay test/production mode.</li>
        </ol>
      </div>

    </div>
  );
};

export default AdminApiStatus;
