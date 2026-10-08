import React from 'react';

const LoadingSkeleton = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm animate-pulse space-y-4">
          <div className="flex justify-between items-center">
            <div className="h-6 bg-slate-200 rounded-full w-36"></div>
            <div className="h-5 bg-slate-200 rounded-full w-24"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="h-10 bg-slate-200 rounded-xl w-full"></div>
            <div className="h-10 bg-slate-200 rounded-xl w-full"></div>
            <div className="h-10 bg-slate-200 rounded-xl w-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
