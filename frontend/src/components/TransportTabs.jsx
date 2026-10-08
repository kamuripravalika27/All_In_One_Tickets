import React from 'react';
import { Train, Plane, Bus } from 'lucide-react';

const TransportTabs = ({ activeTab, onChange }) => {
  const tabs = [
    { id: 'train', label: 'Trains', icon: Train, badge: 'IRCTC Partner' },
    { id: 'flight', label: 'Flights', icon: Plane, badge: 'Domestic & Intl' },
    { id: 'bus', label: 'Buses', icon: Bus, badge: 'Volvo & Sleeper' }
  ];

  return (
    <div className="flex items-center justify-center gap-2 p-1.5 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-700/60 max-w-md mx-auto shadow-2xl">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-200 ${
              isActive
                ? 'bg-gradient-to-r from-brand-sky to-blue-600 text-white shadow-glow scale-105'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default TransportTabs;
